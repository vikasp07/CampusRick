const mongoose = require("mongoose");

const tokenHistorySchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  tokenNo: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiredAt: { type: Date, required: true },
  confirmed: { type: Boolean, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TokenHistory", tokenHistorySchema);
