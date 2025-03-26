// models/Token.js
const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    tokenNo: {
      type: String,
      required: true,
      index: { unique: true, dropDups: false },
    },
    routes: [
      {
        pickupLocation: String,
        dropOffLocation: String,
        userIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
          expires: "1h", // Token expires after 1 hour
        },
      },
    ],
  },
  { timestamps: true }
);

// Custom method to check if route exists and can be joined
TokenSchema.methods.canJoinRoute = function (pickupLocation, dropOffLocation) {
  // Find a route with matching locations that hasn't reached 3 users
  const routeIndex = this.routes.findIndex(
    (route) =>
      route.pickupLocation === pickupLocation &&
      route.dropOffLocation === dropOffLocation &&
      route.userIds.length < 3
  );

  return routeIndex !== -1 ? routeIndex : -1;
};

module.exports = mongoose.model("Token", TokenSchema);
