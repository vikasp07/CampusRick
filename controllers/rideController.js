const Ride = require("../models/Ride");
const Token = require("../models/Token");

// Helper function to generate a unique 4-digit numeric token (as a string)
async function generateUniqueToken() {
  let token;
  let tokenExists = true;
  while (tokenExists) {
    // Generate a random 4-digit number between 1000 and 9999
    token = Math.floor(1000 + Math.random() * 9000).toString();
    tokenExists = await Token.findOne({ tokenNo: token });
  }
  return token;
}

exports.requestRide = async (req, res) => {
  const { userId, pickupLocation, dropOffLocation } = req.body;
  try {
    // Generate a unique 4-digit numeric token
    const token = await generateUniqueToken();
    // Set token expiration to 1 hour from now
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000);

    // Create and save a new token document
    const newToken = new Token({ userId, tokenNo: token, expiredAt });
    await newToken.save();

    // Create and save a new ride document associated with the token
    const newRide = new Ride({
      userId,
      pickupLocation,
      dropOffLocation,
      tokenNo: token,
      status: "pending",
    });
    await newRide.save();

    res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    console.error("Error in ride request:", error);
    res.status(500).json({ error: "Error in ride request" });
  }
};
