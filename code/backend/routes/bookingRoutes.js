const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require("../controllers/bookingController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Both routes require the user to be logged in
router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);
router.put("/:id/status", verifyToken, requireRole("officer"), updateBookingStatus);

module.exports = router;