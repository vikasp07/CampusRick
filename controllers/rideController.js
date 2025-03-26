const Ride = require("../models/Ride");
const Token = require("../models/Token");
const Driver = require("../models/Driver");
const mongoose = require("mongoose");

// Utility function to generate unique token as a 4-digit number (string)
const generateUniqueToken = async () => {
  while (true) {
    // Generate a random 4-digit token between 1000 and 9999
    const tokenNo = Math.floor(1000 + Math.random() * 9000).toString();
    // Check if token already exists
    const existingToken = await Token.findOne({ tokenNo });
    if (!existingToken) {
      return tokenNo;
    }
  }
};

exports.requestRide = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, pickupLocation, dropOffLocation } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find an existing token document that can be joined for this route,
    // i.e. with matching pickup & drop-off and group with less than 3 users.
    const existingTokens = await Token.find({
      "routes.pickupLocation": pickupLocation,
      "routes.dropOffLocation": dropOffLocation,
      "routes.userIds.2": { $exists: false },
    });

    let tokenDoc, tokenNo, routeIndex;
    if (existingTokens.length > 0) {
      tokenDoc = existingTokens[0];
      tokenNo = tokenDoc.tokenNo;
      // Check if user is already in the group
      routeIndex = tokenDoc.canJoinRoute(pickupLocation, dropOffLocation);
      if (routeIndex === -1) {
        // No matching route found; generate new token and create new route entry
        tokenNo = await generateUniqueToken();
        tokenDoc = new Token({
          tokenNo,
          routes: [
            {
              pickupLocation,
              dropOffLocation,
              userIds: [userObjectId],
            },
          ],
        });
      } else {
        // Add user to the existing route's userIds array
        tokenDoc.routes[routeIndex].userIds.push(userObjectId);
      }
    } else {
      // No existing token for this route; generate new token and create route entry
      tokenNo = await generateUniqueToken();
      tokenDoc = new Token({
        tokenNo,
        routes: [
          {
            pickupLocation,
            dropOffLocation,
            userIds: [userObjectId],
          },
        ],
      });
    }

    await tokenDoc.save({ session });

    // Create a new ride using the determined token
    const newRide = new Ride({
      userId: userObjectId,
      pickupLocation,
      dropOffLocation,
      tokenNo,
      status: tokenDoc.routes[0].userIds.length === 3 ? "assigned" : "grouped",
    });
    await newRide.save({ session });

    // Count rides for this token and route (only rides with status "pending" or "grouped")
    const ridesCount = await Ride.countDocuments({
      tokenNo,
      pickupLocation,
      dropOffLocation,
      status: { $in: ["pending", "grouped"] },
    });

    // Determine group status based on ridesCount:
    // 1 ride: pending, 2 rides: grouped, 3 rides: assigned
    let groupStatus = "pending";
    if (ridesCount === 2) {
      groupStatus = "grouped";
    } else if (ridesCount === 3) {
      groupStatus = "assigned";
    }

    // Update all rides for this token on the route to the new group status
    await Ride.updateMany(
      { tokenNo, pickupLocation, dropOffLocation },
      { status: groupStatus },
      { session }
    );

    // If group status is now "assigned" (i.e. triple sharing is complete), assign an available driver
    let driverData = null;
    if (groupStatus === "assigned") {
      const driver = await Driver.findOne({ available: true });
      if (driver) {
        await Ride.updateMany(
          { tokenNo, pickupLocation, dropOffLocation },
          { status: "assigned", driverId: driver._id },
          { session }
        );
        // Mark the driver as no longer available
        driver.available = false;
        await driver.save({ session });
        driverData = {
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          vehicleNo: driver.vehicleNo,
          idProof: driver.idProof,
          profilePhoto: driver.profilePhoto,
        };
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Retrieve group details (the userIds from the token's first route)
    const groupDetails = tokenDoc.routes[0].userIds;

    res.status(201).json({
      message: "Ride requested successfully",
      ride: newRide,
      tokenNo,
      status: newRide.status,
      groupCount: tokenDoc.routes[0].userIds.length,
      groupDetails,
      driver: driverData,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Ride request error:", error);
    res.status(500).json({
      message: "Error requesting ride",
      error: error.message,
    });
  }
};

exports.cancelRide = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tokenNo } = req.body;
    const ride = await Ride.findOneAndUpdate(
      { tokenNo },
      { status: "cancelled" },
      { new: true, session }
    );
    if (!ride) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Ride not found" });
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Ride cancellation error:", error);
    res.status(500).json({
      message: "Error cancelling ride",
      error: error.message,
    });
  }
};
