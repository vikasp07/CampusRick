const express = require("express");
const Driver = require("../models/Driver");
const router = express.Router();

// Driver Availability API
router.post("/update-availability", async (req, res) => {
  const { driverId, available } = req.body;

  try {
    // Find the driver by driverId
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update the availability of the driver
    driver.available = available;
    await driver.save();

    res.status(200).json({ message: "Driver availability updated", driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating driver availability" });
  }
});

module.exports = router;
