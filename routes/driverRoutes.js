// routes/driverRoutes.js
const express = require("express");
const {
  updateDriverAvailability,
  registerDriver,
} = require("../controllers/driverController");

const router = express.Router();

router.post("/update-availability", updateDriverAvailability);
router.post("/register", registerDriver);

module.exports = router;
