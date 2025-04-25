const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingsController");

// Middleware to protect routes

// Create a new booking
router.post("/createbook", bookingController.createBooking);

// Get bookings by trainee ID
router.get("/trainee/:traineeId", bookingController.getBookingsByTrainee);

// Get bookings by trainer ID
router.get("/trainer/:trainerId", bookingController.getBookingsByTrainer);

// Update booking status
router.put("/:bookingId/status", bookingController.updateBookingStatus);

// Delete booking
router.delete("/:bookingId", bookingController.deleteBooking);

module.exports = router;
