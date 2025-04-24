/* eslint-disable no-undef */
const { TraineeWorkout, Exercise, User } = require("../models/database");

/**
 * Create a new workout by a trainee
 */
exports.createWorkout = async (req, res) => {
  try {
    const { 
      workout_name, 
      workout_type, 
      workout_level, 
      workout_duration, 
      workout_calories,
      description,
      is_public 
    } = req.body;

    // Validate required fields
    if (!workout_name || !workout_type || !workout_level || !workout_duration || !workout_calories) {
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing" 
      });
    }

    // Get user ID from authenticated user
    const userId = req.user.id;

    // Create the workout
    const newWorkout = await TraineeWorkout.create({
      workout_name,
      workout_type,
      workout_level,
      workout_duration,
      workout_calories,
      description: description || "",
      user_id: userId,
      is_public: is_public || false
    });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: newWorkout
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create workout",
      error: error.message
    });
  }
};

/**
 * Get all workouts created by current trainee
 */
exports.getMyWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;

    const workouts = await TraineeWorkout.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: workouts
    });
  } catch (error) {
    console.error("Error fetching trainee workouts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch workouts",
      error: error.message
    });
  }
};

/**
 * Get a specific workout by ID
 */
exports.getWorkoutById = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;

    const workout = await TraineeWorkout.findOne({
      where: { id: workoutId },
      include: [
        {
          model: Exercise,
          as: 'exercises'
        }
      ]
    });

    if (!workout) {
      return res.status(404).json({ 
        success: false, 
        message: "Workout not found" 
      });
    }

    // Check if the workout belongs to the user or is public
    if (workout.user_id !== userId && !workout.is_public) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to view this workout" 
      });
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error("Error fetching workout details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch workout details",
      error: error.message 
    });
  }
};

/**
 * Update an existing workout
 */
exports.updateWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;
    
    const workout = await TraineeWorkout.findByPk(workoutId);
    
    if (!workout) {
      return res.status(404).json({ 
        success: false, 
        message: "Workout not found" 
      });
    }
    
    // Check if the workout belongs to the user
    if (workout.user_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to update this workout" 
      });
    }
    
    // Update the workout
    await workout.update(req.body);
    
    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: workout
    });
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update workout",
      error: error.message
    });
  }
};

/**
 * Delete a workout
 */
exports.deleteWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;
    
    const workout = await TraineeWorkout.findByPk(workoutId);
    
    if (!workout) {
      return res.status(404).json({ 
        success: false, 
        message: "Workout not found" 
      });
    }
    
    // Check if the workout belongs to the user
    if (workout.user_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this workout" 
      });
    }
    
    // Delete associated exercises first
    await Exercise.destroy({
      where: { workout_id: workoutId }
    });
    
    // Delete the workout
    await workout.destroy();
    
    res.status(200).json({
      success: true,
      message: "Workout deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete workout",
      error: error.message
    });
  }
};

/**
 * Get public workouts created by trainees
 */
exports.getPublicWorkouts = async (req, res) => {
  try {
    const workouts = await TraineeWorkout.findAll({
      where: { is_public: true },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'first_name', 'last_name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: workouts
    });
  } catch (error) {
    console.error("Error fetching public workouts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch public workouts",
      error: error.message
    });
  }
}; 