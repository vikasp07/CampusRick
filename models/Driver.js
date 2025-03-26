// models/Driver.js
const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleNo: {
      type: String,
      required: true,
      unique: true,
    },
    idProof: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
