require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Token = require('./models/Token'); // Import Token model

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using .env variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Helper functions
function generateNum() {
  return parseInt(String(Math.floor(Math.random() * 1001)).padStart(4, '0'));
}

function generateTime() {
  return new Date();
}

function generateExp(createdAt) {
  return new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 minutes expiry
}

// Endpoint: Create a Token
app.post('/api/get', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const now = generateTime();
    const tokenData = {
      userId,
      tokenNo: generateNum(),
      createdAt: now,
      expiredAt: generateExp(now)
    };

    const token = new Token(tokenData);
    const savedToken = await token.save();
    res.json({ tokenId: savedToken._id });
  } catch (error) {
    console.error("Error in /api/get:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint: Check Token Status
app.post('/api/check', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const tokens = await Token.find({ userId });
    const currentTime = generateTime();
    let activeFound = tokens.some(token => token.expiredAt && currentTime < token.expiredAt);

    res.json({ expired: !activeFound });
  } catch (error) {
    console.error("Error in /api/check:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
