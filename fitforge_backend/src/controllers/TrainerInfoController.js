const db = require("../models/database");
const { TrainerInfo, User } = db;

// Get trainer info by user ID
exports.getTrainerInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists and is a trainer
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.user_role !== "trainer") {
      return res.status(403).json({ message: "User is not a trainer" });
    }

    // Get trainer info - lookup by user_id field instead of id
    const trainerInfo = await TrainerInfo.findOne({
      where: { id: userId },
    });

    if (!trainerInfo) {
      return res.status(404).json({ message: "Trainer information not found" });
    }

    return res.status(200).json(trainerInfo);
  } catch (error) {
    console.error("Error getting trainer info:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Create trainer info
exports.createTrainerInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists and is a trainer
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.user_role !== "trainer") {
      return res.status(403).json({ message: "User is not a trainer" });
    }

    // Check if trainer info already exists
    const existingInfo = await TrainerInfo.findOne({
      where: { id: userId },
    });

    if (existingInfo) {
      return res
        .status(400)
        .json({ message: "Trainer information already exists" });
    }

    // Prepare data with proper time formatting
    const trainerData = {
      ...req.body,
      id: userId, // Set user_id field instead of id
      available_hours_from: req.body.available_hours_from || null,
      available_hours_to: req.body.available_hours_to || null,
    };

    // Create trainer info
    const trainerInfo = await TrainerInfo.create(trainerData);

    return res.status(201).json(trainerInfo);
  } catch (error) {
    console.error("Error creating trainer info:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update trainer info
exports.updateTrainerInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists and is a trainer
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.user_role !== "trainer") {
      return res.status(403).json({ message: "User is not a trainer" });
    }

    // Find trainer info
    const trainerInfo = await TrainerInfo.findOne({
      where: { id: userId },
    });

    if (!trainerInfo) {
      return res.status(404).json({ message: "Trainer information not found" });
    }

    // Update trainer info with the new values, including available hours
    const updateData = {
      ...req.body,
      available_hours_from: req.body.available_hours_from || null,
      available_hours_to: req.body.available_hours_to || null,
    };

    await trainerInfo.update(updateData);

    return res.status(200).json(trainerInfo);
  } catch (error) {
    console.error("Error updating trainer info:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all trainers with their info
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: {
        user_role: "trainer",
        is_verified: true,
        is_approved: true,
      },
      include: [
        {
          model: TrainerInfo,
          as: "trainerInfo",
        },
      ],
    });

    return res.status(200).json(trainers);
  } catch (error) {
    console.error("Error getting all trainers:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
