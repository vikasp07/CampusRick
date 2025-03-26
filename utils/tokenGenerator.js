// utils/tokenGenerator.js
const crypto = require("crypto");

const generateUniqueToken = async (TokenModel) => {
  while (true) {
    // Generate a 4-digit token
    const token = crypto.randomInt(1000, 9999).toString();

    // Check if token already exists
    const existingToken = await TokenModel.findOne({ tokenNo: token });

    if (!existingToken) {
      return token;
    }
  }
};

module.exports = generateUniqueToken;
