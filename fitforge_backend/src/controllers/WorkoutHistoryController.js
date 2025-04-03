const { WorkoutHistory: WorkoutHistory } = require("../models/database");
const send = require("../utils/response");
require("dotenv").config();

exports.postWorkoutHistory = async (req, res) => {
  try {
    const { workoutId, completionTime, date } = req.body;

    await WorkoutHistory.create({
      workout_id: workoutId,
      completion_time: completionTime,
      date: date,
    });

    res.status(201).json({
      message: "Workout History saved successfully",
    });
  } catch (error) {
    console.error("error saving workout history");
    res.status(500).json({ message: "Server Error" });
  }
};
