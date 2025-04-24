/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const TraineeWorkoutController = require("../controllers/TraineeWorkoutController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Create a new workout (requires authentication)
router.post("/trainee/workouts", authenticateToken, TraineeWorkoutController.createWorkout);

// Get all workouts created by current user
router.get("/trainee/my-workouts", authenticateToken, TraineeWorkoutController.getMyWorkouts);

// Get specific workout by ID
router.get("/trainee/workouts/:id", authenticateToken, TraineeWorkoutController.getWorkoutById);

// Update a workout
router.put("/trainee/workouts/:id", authenticateToken, TraineeWorkoutController.updateWorkout);

// Delete a workout
router.delete("/trainee/workouts/:id", authenticateToken, TraineeWorkoutController.deleteWorkout);

// Get public workouts from all trainees
router.get("/trainee/public-workouts", TraineeWorkoutController.getPublicWorkouts);

module.exports = router; 