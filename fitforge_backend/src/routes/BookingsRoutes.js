const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware to protect routes

// Create a new booking
router.post("/createbook", bookingController.createBooking);

// Get bookings by trainee ID
router.get("/trainee/:traineeId", bookingController.getBookingsByTrainee);

// Get bookings by trainer ID
router.get("/trainer/:trainerId", bookingController.getBookingsByTrainer);

// Debug endpoint to verify bookings directly from database
router.get("/debug/trainer/:trainerId", bookingController.debugTrainerBookings);

// Update booking status
router.put("/:bookingId/status", bookingController.updateBookingStatus);

// Delete booking
router.delete("/:bookingId", bookingController.deleteBooking);

// Admin Analytics Routes
router.get(
  "/stats",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  bookingController.getBookingStats
);

module.exports = router;
