const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/ExerciseController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/exercises", exerciseController.getExercises);
router.post("/exercises", exerciseController.addExercise);

// New routes for workout exercises
router.post("/create", authenticateToken, exerciseController.createExercise);
router.put("/:id", authenticateToken, exerciseController.updateExercise);
router.delete("/:id", authenticateToken, exerciseController.deleteExercise);
router.get("/workout/:workoutId", exerciseController.getExercisesByWorkout);

module.exports = router;
