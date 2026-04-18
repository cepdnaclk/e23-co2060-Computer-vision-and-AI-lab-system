const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");

// Both routes require the user to be logged in
router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);

module.exports = router;