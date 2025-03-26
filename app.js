// app.js
require("dotenv").config(); // Load environment variables first
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
const rideRoutes = require("./routes/rideRoutes");
const driverRoutes = require("./routes/driverRoutes");

app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);

// Server configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
