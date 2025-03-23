const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenNo: { type: String, required: true },
    expiredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
