const express = require("express");
const Group = require("../models/Group");
const Ride = require("../models/Ride");
const Driver = require("../models/Driver");
const mongoose = require("mongoose");
const router = express.Router();

// Advanced Group Matching API
router.post("/match", async (req, res) => {
  const { pickupLocation, dropOffLocation } = req.body;

  try {
    // Find rides with matching pickupLocation, dropOffLocation, and status "pending"
    console.log(
      "Searching for rides with pickup:",
      pickupLocation,
      "and drop-off:",
      dropOffLocation
    );

    const rides = await Ride.find({
      pickupLocation,
      dropOffLocation,
      status: "pending", // Only consider pending rides
    });

    // Log the result of the ride query
    console.log("Rides found:", rides);

    if (rides.length < 2) {
      // At least 2 rides needed to form a group
      return res.status(404).json({ error: "Not enough rides available" });
    }

    // Example: Find an available driver
    const driver = await Driver.findOne({ available: true });

    // Log the result of the driver query
    console.log("Available driver:", driver);

    if (!driver) {
      return res.status(404).json({ error: "No available drivers" });
    }

    // Create a new group for the matching rides
    const group = new Group({
      members: rides.map((ride) => ride.userId),
      rideIds: rides.map((ride) => ride._id), // Store all ride ids in the group
    });
    await group.save();

    // Update the status of the rides to 'grouped' and assign the driver to the rides
    for (let ride of rides) {
      ride.status = "grouped";
      ride.driverId = driver._id;
      ride.groupId = group._id;
      await ride.save();
    }

    // Send the response with the created group and updated rides
    res.status(201).json({
      message: "Group formed successfully",
      group,
      rides,
      driver,
    });
  } catch (error) {
    console.error("Error in forming group:", error);
    res.status(500).json({ error: "Error in forming group" });
  }
});

module.exports = router;
