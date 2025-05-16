/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const WorkoutController = require("../controllers/WorkoutsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/workouts/:id", WorkoutController.getWorkoutById);
router.get("/workouts", WorkoutController.getWorkouts);

// Admin Analytics Routes
router.get(
  "/stats",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  WorkoutController.getWorkoutStats
);

module.exports = router;
