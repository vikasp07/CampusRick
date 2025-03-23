const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
