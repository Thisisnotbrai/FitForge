/* eslint-disable no-undef */
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

    // Get trainer info - FIXED: query by userId instead of id
    const trainerInfo = await TrainerInfo.findOne({
      where: { userId: userId },
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
    const userId = req.params.userId;

    // Verify user exists and is a trainer
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.user_role !== "trainer") {
      return res.status(403).json({ message: "User is not a trainer" });
    }

    // Check if trainer info already exists - now check by userId
    const existingInfo = await TrainerInfo.findOne({
      where: { userId: userId },
    });

    if (existingInfo) {
      return res
        .status(400)
        .json({ message: "Trainer information already exists" });
    }

    // Prepare data with proper time formatting and the userId
    const trainerData = {
      ...req.body,
      userId: userId,
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

// Update trainer info - FIXED
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

    // Find trainer info - FIXED: query by userId instead of id
    const trainerInfo = await TrainerInfo.findOne({
      where: { userId: userId },
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
    console.log("Fetching all trainers with role 'trainer'");

    // Debug the connection
    if (!db.sequelize) {
      console.error("Database connection issue: sequelize is not initialized");
      return res.status(500).json({ message: "Database connection error" });
    }

    // First, check if we have any trainers
    const trainerCount = await User.count({
      where: {
        user_role: "trainer",
      },
    });

    console.log(`Found ${trainerCount} total users with role 'trainer'`);

    const verifiedCount = await User.count({
      where: {
        user_role: "trainer",
        is_verified: true,
      },
    });

    console.log(`Of which ${verifiedCount} are verified`);

    const approvedCount = await User.count({
      where: {
        user_role: "trainer",
        is_verified: true,
        is_approved: true,
      },
    });

    console.log(`And ${approvedCount} are both verified and approved`);

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
          required: false, // Allow trainers without trainer info
        },
      ],
      attributes: [
        "id",
        "user_name",
        "user_email",
        "user_role",
        "is_verified",
        "is_approved",
      ],
    });

    console.log(`Query returned ${trainers.length} trainers`);

    // Debug the trainer data
    if (trainers.length > 0) {
      trainers.forEach((trainer, index) => {
        console.log(
          `Trainer ${index + 1}: ID=${trainer.id}, Name=${trainer.user_name}`
        );
        if (trainer.trainerInfo) {
          console.log(
            `  Has trainer info with specialization: ${trainer.trainerInfo.specialization}`
          );
        } else {
          console.log(`  Does NOT have trainer info`);
        }
      });
    }

    // Even if we have no trainers, return an empty array instead of 404
    // This helps the frontend handle the display better
    return res.status(200).json(trainers || []);
  } catch (error) {
    console.error("Error getting all trainers:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
