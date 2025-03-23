const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  pickup_location: { type: String, required: true },
  dropoff_location: { type: String, required: true },
  time: { type: Date, required: true },
  status: { type: String, default: "pending" },
});

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

module.exports = RideRequest;
