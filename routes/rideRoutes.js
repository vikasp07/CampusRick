// routes/rideRoutes.js
const express = require("express");
const { requestRide, cancelRide } = require("../controllers/rideController");

const router = express.Router();

router.post("/request", requestRide);
router.post("/cancel", cancelRide);

module.exports = router;
