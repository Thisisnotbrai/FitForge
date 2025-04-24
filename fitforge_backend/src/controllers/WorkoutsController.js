const { Workouts: Workouts } = require("../models/database");
const { Exercise: Exercise } = require("../models/database");
const send = require("../utils/response");
require("dotenv").config();

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workouts.findAll();
    res.json(workouts);
  } catch (error) {
    console.error("Error fetching Workout", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workouts.findByPk(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not Found" });
    }

    // Get the exercises separately if the association isn't set up
    const exercises = await Exercise.findAll({
      where: { workout_id: req.params.id },
      order: [["exercise_order", "ASC"]],
      attributes: [
        "id",
        "exercise_name",
        "sets",
        "reps",
        "work_time",
        "rest_time",
        "rest_between",
      ],
    });

    // Manually combine the workout with its exercises
    const result = {
      ...workout.toJSON(),
      exercises: exercises,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching workout details", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
