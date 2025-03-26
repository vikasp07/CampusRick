// controllers/driverController.js
const Driver = require("../models/Driver");

exports.updateDriverAvailability = async (req, res) => {
  try {
    const { driverId, available } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { available },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver availability updated",
      driver: {
        id: driver._id,
        name: driver.name,
        available: driver.available,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating driver availability",
        error: error.message,
      });
  }
};

exports.registerDriver = async (req, res) => {
  try {
    const { name, phoneNumber, vehicleNo, idProof, profilePhoto } = req.body;

    const driver = new Driver({
      name,
      phoneNumber,
      vehicleNo,
      idProof,
      profilePhoto,
    });

    await driver.save();

    res.status(201).json({
      message: "Driver registered successfully",
      driver: {
        id: driver._id,
        name: driver.name,
        phoneNumber: driver.phoneNumber,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering driver", error: error.message });
  }
};
