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
    return send.sendResponseMessage(res, 200, exercises, "Exercises retrieved successfully");
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

      if (!['Biceps', 'Triceps', 'Back', 'Chest', 'Legs', 'Forearms'].includes(muscle_group)) {
        return send.sendResponseMessage(res, 400, null, "Invalid muscle group");
      }

      const newExercise = await Exercise.create({
        picture: picturePath,
        reps_sets,
        muscle_group,
        direction,
      });

      return send.sendResponseMessage(res, 201, newExercise, "Exercise added successfully");
    } catch (error) {
      return send.sendErrorMessage(res, 500, error);
    }
  },
];
