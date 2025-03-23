const express = require("express");
const Ride = require("../models/Ride");
const Token = require("../models/Token");
const router = express.Router();

// Helper function to generate a unique 4-digit token (as a string)
async function generateUniqueToken() {
  let token;
  let tokenExists = true;
  while (tokenExists) {
    // Generate a random 4-digit number between 1000 and 9999
    token = Math.floor(1000 + Math.random() * 9000).toString();
    tokenExists = await Token.findOne({ tokenNo: token });
  }
  return token;
}

// Ride Request API
router.post("/request", async (req, res) => {
  const { userId, pickupLocation, dropOffLocation } = req.body;
  try {
    // Generate a unique 4-digit numeric token
    const token = await generateUniqueToken();
    // Set token expiration to 1 hour from now
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000);

    // Create and save a new token document
    const newToken = new Token({ userId, tokenNo: token, expiredAt });
    await newToken.save();

    // Create and save a new ride associated with the token
    const newRide = new Ride({
      userId,
      pickupLocation,
      dropOffLocation,
      tokenNo: token,
      status: "pending",
    });
    await newRide.save();

    res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    console.error("Error in ride request:", error);
    res.status(500).json({ error: "Error in ride request" });
  }
});

// Ride Cancellation API
router.post("/cancel", async (req, res) => {
  const { tokenNo } = req.body;
  try {
    const ride = await Ride.findOne({ tokenNo });
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Update ride status to "cancelled"
    ride.status = "cancelled";
    await ride.save();

    // If the ride was part of a group, trigger re-matching logic if needed

    res.status(200).json({ message: "Ride cancelled successfully", ride });
  } catch (error) {
    console.error("Error in cancelling ride:", error);
    res.status(500).json({ error: "Error in cancelling ride" });
  }
});

module.exports = router;
