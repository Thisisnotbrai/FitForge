const { Workouts, Exercise, TraineeWorkout, WorkoutHistory, Sequelize } = require("../models/database");
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
    console.error("error saving workout history", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Workout Analytics for Admin Dashboard
exports.getWorkoutStats = async (req, res) => {
  try {
    // Get total number of workouts
    const totalWorkouts = await getWorkoutCount();
    
    // Get total number of completed workouts
    const completedWorkouts = await getCompletedWorkoutCount();
    
    // Get popular workout types
    const popularWorkouts = await getPopularWorkouts();
    
    return res.status(200).json({
      success: true,
      message: "Workout statistics retrieved successfully",
      data: {
        totalWorkouts,
        completedWorkouts,
        popularWorkouts
      }
    });
  } catch (error) {
    console.error("Error retrieving workout stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve workout statistics",
      error: error.message
    });
  }
};

// Helper function to count workouts
const getWorkoutCount = async () => {
  try {
    const count = await Workouts.count();
    return count;
  } catch (error) {
    console.error("Error counting workouts:", error);
    return 0;
  }
};

// Helper function to count completed workouts
const getCompletedWorkoutCount = async () => {
  try {
    const count = await TraineeWorkout.count({
      where: {
        status: 'completed'
      }
    });
    return count;
  } catch (error) {
    console.error("Error counting completed workouts:", error);
    return 0;
  }
};

// Helper function to get popular workout types
const getPopularWorkouts = async () => {
  try {
    const db = Sequelize;
    const popularWorkouts = await Workouts.findAll({
      attributes: [
        'workout_type',
        [db.fn('COUNT', '*'), 'count']
      ],
      group: ['workout_type'],
      order: [
        [db.literal('count'), 'DESC']
      ],
      limit: 5
    });
    
    return popularWorkouts.map(workout => ({
      name: workout.workout_type,
      count: parseInt(workout.get('count'), 10)
    }));
  } catch (error) {
    console.error("Error getting popular workouts:", error);
    return [];
  }
};
