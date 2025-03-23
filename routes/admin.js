const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
const Group = require("../models/Group");
const Driver = require("../models/Driver");

// Admin Dashboard: Get all active rides
router.get("/rides", async (req, res) => {
  try {
    const rides = await Ride.find({
      status: { $in: ["pending", "grouped"] },
    }).populate("userId");
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rides." });
  }
});

// Admin Dashboard: Get all drivers
router.get("/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drivers." });
  }
});

// Admin: Report an issue
router.post("/incident", async (req, res) => {
  const { rideId, description } = req.body;

  if (!rideId || !description) {
    return res
      .status(400)
      .json({ error: "Ride ID and description are required." });
  }

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: "Ride not found." });
    }

    ride.incidents.push(description);
    await ride.save();

    res.status(200).json({ message: "Incident reported successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to report incident." });
  }
});

module.exports = router;
