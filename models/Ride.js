const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropOffLocation: { type: String, required: true },
    tokenNo: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending", // ride has been requested, but not yet grouped
        "grouped", // ride has been successfully grouped with others
        "assigned", // ride has been assigned a driver
        "in-transit", // ride is in transit
        "completed", // ride has completed successfully
        "cancelled", // ride has been cancelled
      ],
      default: "pending",
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    incidents: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
