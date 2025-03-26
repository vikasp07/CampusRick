// models/Ride.js
const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    tokenNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "grouped", "assigned", "cancelled"],
      default: "pending",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    incidents: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", RideSchema);
