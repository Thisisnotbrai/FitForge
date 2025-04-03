/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const WorkoutController = require("../controllers/WorkoutsController");

router.get("/workouts/:id", WorkoutController.getWorkoutById);
router.get("/workouts", WorkoutController.getWorkouts);

module.exports = router;
