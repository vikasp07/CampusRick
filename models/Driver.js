const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    available: { type: Boolean, default: true },
    location: { type: { lat: Number, lon: Number }, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
