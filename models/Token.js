const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tokenNo: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiredAt: { type: Date, required: true }
});

// Automatically remove expired tokens
tokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
