/* eslint-disable no-undef */
const { Exercise } = require("../models/database");
const send = require("../utils/response");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Get all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    return send.sendResponseMessage(
      res,
      200,
      exercises,
      "Exercises retrieved successfully"
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

// Add a new exercise (Fixed version)
exports.addExercise = [
  upload.single("picture"), // Use multer as middleware
  async (req, res) => {
    try {
      const { reps_sets, muscle_group, direction } = req.body;

      if (!req.file) {
        return send.sendResponseMessage(res, 400, null, "Picture is required");
      }

      const picturePath = req.file.filename; // Save only the filename instead of the full path

      if (
        !["Biceps", "Triceps", "Back", "Chest", "Legs", "Forearms"].includes(
          muscle_group
        )
      ) {
        return send.sendResponseMessage(res, 400, null, "Invalid muscle group");
      }

      const newExercise = await Exercise.create({
        picture: picturePath,
        reps_sets,
        muscle_group,
        direction,
      });

      return send.sendResponseMessage(
        res,
        201,
        newExercise,
        "Exercise added successfully"
      );
    } catch (error) {
      return send.sendErrorMessage(res, 500, error);
    }
  },
];

// Create a new exercise for a workout
exports.createExercise = async (req, res) => {
  try {
    const { 
      exercise_name, 
      sets, 
      reps, 
      work_time, 
      rest_time, 
      rest_between,
      workout_id 
    } = req.body;

    // Validate required fields
    if (!exercise_name || !workout_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Exercise name and workout ID are required" 
      });
    }

    // Get the highest exercise_order for this workout
    const existingExercises = await Exercise.findAll({
      where: { workout_id: workout_id },
      order: [['exercise_order', 'DESC']],
      limit: 1
    });
    
    // Calculate new exercise order
    const exercise_order = existingExercises.length > 0 
      ? existingExercises[0].exercise_order + 1 
      : 1;

    // Create the exercise
    const newExercise = await Exercise.create({
      exercise_name,
      sets: sets || 3,
      reps: reps || 10,
      work_time: work_time || 45,
      rest_time: rest_time || 15,
      rest_between: rest_between || 60,
      workout_id,
      exercise_order
    });

    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create exercise",
      error: error.message
    });
  }
};

// Update an existing exercise
exports.updateExercise = async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const { 
      exercise_name, 
      sets, 
      reps, 
      work_time, 
      rest_time, 
      rest_between 
    } = req.body;

    // Find the exercise
    const exercise = await Exercise.findByPk(exerciseId);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    // Update the exercise
    await exercise.update({
      exercise_name: exercise_name || exercise.exercise_name,
      sets: sets || exercise.sets,
      reps: reps || exercise.reps,
      work_time: work_time || exercise.work_time,
      rest_time: rest_time || exercise.rest_time,
      rest_between: rest_between || exercise.rest_between
    });

    // Return the updated exercise
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update exercise",
      error: error.message
    });
  }
};

// Delete an exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exerciseId = req.params.id;
    
    // Find the exercise
    const exercise = await Exercise.findByPk(exerciseId);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    // Delete the exercise
    await exercise.destroy();

    // Return success message
    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exercise",
      error: error.message
    });
  }
};

// Get all exercises for a workout
exports.getExercisesByWorkout = async (req, res) => {
  try {
    const workoutId = req.params.workoutId;
    
    // Find all exercises for this workout
    const exercises = await Exercise.findAll({
      where: { workout_id: workoutId },
      order: [['exercise_order', 'ASC']]
    });

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error.message
    });
  }
};
