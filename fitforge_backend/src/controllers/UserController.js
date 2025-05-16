/* eslint-disable no-undef */
const { User: User } = require("../models/database");
const send = require("../utils/response");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "fit.forge.app.gc@gmail.com",
    pass: "nkng ndmj kcir mwjk",
  },
});

const verificationEmail = async (email, token) => {
  try {
    await transporter.sendMail({
      from: '"Fit Forge" <fit.forge.app.gc@gmail.com>',
      to: email,
      subject: "Email Verification",
      text: "Please verify your email address",
      html: `<p>Please verify your email address by clicking the link below: ${token}</p>`,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });

    if (!existingUser) {
      return send.sendResponseMessage(res, 404, null, "User not found");
    }

    const verifyPassword = await argon2.verify(
      existingUser.user_password,
      user_password
    );
    if (verifyPassword) {
      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.user_role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return send.sendResponseMessage(
        res,
        200,
        token,
        {
          User: {
            id: existingUser.id,
            name: existingUser.user_name,
            email: existingUser.user_email,
            role: existingUser.user_role,
            is_verified: existingUser.is_verified,
            is_approved: existingUser.is_approved,
          },
        },
        "User logged in successfully!"
      );
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    send.sendErrorMessage(res, 500, error);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password, user_role, admin_secret } =
      req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
      return send.sendResponseMessage(res, 400, null, "Email already in use");
    }

    if (!["trainee", "trainer", "admin"].includes(user_role)) {
      return send.sendResponseMessage(res, 400, null, "Invalid role provided");
    }

    // Restrict admin account creation
    if (user_role === "admin" && admin_secret !== process.env.ADMIN_SECRET) {
      return send.sendResponseMessage(
        res,
        403,
        null,
        "Unauthorized to create an admin"
      );
    }

    const hash = await argon2.hash(user_password);
    const verificationcode = Math.floor(100000 + Math.random() * 900000);
    const emailsent = await verificationEmail(user_email, verificationcode);

    if (!emailsent) {
      return send.sendResponseMessage(res, 500, null, "Email not sent");
    }

    const newUser = await User.create({
      user_name,
      user_email,
      user_password: hash,
      user_role,
      verification_code: verificationcode,
      is_verified: user_role === "admin" ? true : false, // Admins are verified by default
      is_approved: user_role === "trainer" ? false : true,
    });

    return send.sendResponseMessage(
      res,
      201,
      newUser,
      "User registered successfully"
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verification_code } = req.body;
    const existingUser = await User.findOne({ where: { user_email: email } });
    if (!existingUser) {
      return send.sendResponseMessage(res, 404, null, "User not found");
    }
    if (existingUser.is_verified) {
      return send.sendResponseMessage(res, 400, null, "Email already verified");
    }
    if (existingUser.verification_code != verification_code) {
      return send.sendResponseMessage(
        res,
        400,
        null,
        "Invalid verification code"
      );
    }
    existingUser.is_verified = true;
    await existingUser.save();
    return send.sendResponseMessage(
      res,
      200,
      null,
      "Email verified successfully"
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

exports.getPendingTrainers = async (req, res) => {
  try {
    const pendingTrainers = await User.findAll({
      where: {
        user_role: "trainer",
        is_approved: false, // Only fetch trainers who are NOT approved
      },
      attributes: ["id", "user_name", "user_email", "user_role", "is_approved"],
    });

    if (pendingTrainers.length === 0) {
      return send.sendResponseMessage(
        res,
        404,
        null,
        "No pending trainers found."
      );
    }

    return send.sendResponseMessage(
      res,
      200,
      pendingTrainers,
      "Pending trainers retrieved successfully."
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

exports.approveTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const trainer = await User.findOne({
      where: { id: trainerId, user_role: "trainer" },
    });

    if (!trainer) {
      return send.sendResponseMessage(res, 404, null, "Trainer not found");
    }

    if (trainer.is_approved) {
      return send.sendResponseMessage(
        res,
        400,
        null,
        "Trainer is already approved"
      );
    }

    trainer.is_approved = true;
    await trainer.save();

    return send.sendResponseMessage(
      res,
      200,
      trainer,
      "Trainer approved successfully"
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: {
        user_role: "trainer",
        is_approved: true, // Only fetch approved trainers
      },
      attributes: [
        "id",
        "user_name",
        "user_email",
        "user_role",
        "is_verified",
        "is_approved",
      ],
    });

    return send.sendResponseMessage(
      res,
      200,
      trainers,
      "Trainers retrieved successfully."
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

exports.getTrainees = async (req, res) => {
  try {
    const trainees = await User.findAll({
      where: {
        user_role: "trainee",
      },
      attributes: ["id", "user_name", "user_email", "user_role", "is_verified"],
    });

    return send.sendResponseMessage(
      res,
      200,
      trainees,
      "Trainees retrieved successfully."
    );
  } catch (error) {
    return send.sendErrorMessage(res, 500, error);
  }
};

// Get User Analytics for Admin Dashboard
exports.getUserStats = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await getUserCount();
    
    // Count trainees
    const traineeCount = await getUserCount('trainee');
    
    // Count trainers
    const trainerCount = await getUserCount('trainer');
    
    // Count pending trainers
    const pendingCount = await getUserCount('trainer', false);
    
    // Get registration trend data (last 6 months)
    const registrationTrend = await getRegistrationTrend();
    
    return res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        totalUsers,
        traineeCount,
        trainerCount,
        pendingCount,
        registrationTrend
      }
    });
  } catch (error) {
    console.error("Error retrieving user stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user statistics",
      error: error.message
    });
  }
};

// Helper function to count users
const getUserCount = async (role, isApproved) => {
  const query = {};
  
  if (role) {
    query.user_role = role;
  }
  
  if (isApproved !== undefined) {
    query.is_approved = isApproved;
  }
  
  try {
    const count = await User.count({
      where: query
    });
    
    return count;
  } catch (error) {
    console.error("Error counting users:", error);
    return 0;
  }
};

// Helper function to get registration trend data
const getRegistrationTrend = async () => {
  try {
    // Get registration counts for last 6 months
    const { Sequelize } = require('../models/database');
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Simplified approach using JS date processing
    const users = await User.findAll({
      where: {
        created_at: {
          [Sequelize.Op.gte]: sixMonthsAgo
        }
      },
      attributes: ['created_at'],
      order: [['created_at', 'ASC']]
    });
    
    // Process users into monthly buckets
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    users.forEach(user => {
      const date = new Date(user.created_at);
      const monthName = months[date.getMonth()];
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0;
      }
      monthlyData[monthName]++;
    });
    
    // Convert to array format
    const trend = Object.keys(monthlyData).map(month => ({
      date: month,
      count: monthlyData[month]
    }));
    
    return trend;
  } catch (error) {
    console.error("Error getting registration trend:", error);
    return [];
  }
};

// Suspend a user (trainer or trainee)
exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { id: userId } });
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update user status to inactive
    existingUser.is_active = false;
    await existingUser.save();
    
    return res.status(200).json({
      success: true,
      message: "User suspended successfully",
      data: existingUser
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to suspend user",
      error: error.message
    });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.id;
    console.log(`Fetching trainer profile for ID: ${trainerId}`);

    if (!trainerId) {
      return send.sendErrorMessage(res, 400, "Trainer ID is required");
    }

    // Find the trainer by ID with fewer restrictions to help debugging
    const trainer = await User.findOne({
      where: {
        id: trainerId,
        user_role: "trainer",
      },
      attributes: [
        "id",
        "user_name",
        "user_email",
        "user_role",
        "is_verified",
        "is_approved",
      ],
      include: [
        {
          model: db.TrainerInfo,
          as: "trainerInfo",
          attributes: [
            "specialization",
            "experience",
            "hourly_rate",
            "available_days",
            "available_hours_from",
            "available_hours_to",
            "bio",
          ],
        },
      ],
    });

    if (!trainer) {
      console.log(`No trainer found with ID: ${trainerId}`);
      return send.sendErrorMessage(res, 404, "Trainer not found");
    }

    console.log(
      `Trainer found: ${trainer.user_name}, approved: ${trainer.is_approved}, verified: ${trainer.is_verified}`
    );

    // If trainer is not approved, return a specific message but still include the data
    if (!trainer.is_approved) {
      return send.sendResponseMessage(
        res,
        403,
        trainer,
        "Trainer account is pending approval"
      );
    }

    return send.sendResponseMessage(
      res,
      200,
      trainer,
      "Trainer retrieved successfully"
    );
  } catch (error) {
    console.error("Error getting trainer by ID:", error);
    return send.sendErrorMessage(res, 500, error);
  }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("User profile request:", { userId, userRole, user: req.user });

    if (!userId) {
      return send.sendResponseMessage(res, 401, null, "Not authenticated");
    }

    // Find the user by ID
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "user_name",
        "user_email",
        "user_role",
        "is_verified",
        "is_approved",
      ],
    });

    if (!user) {
      return send.sendResponseMessage(res, 404, null, "User not found");
    }

    console.log("Found user:", user.dataValues);

    // For trainers, check if they're approved
    if (user.user_role === "trainer" && !user.is_approved) {
      return send.sendResponseMessage(
        res,
        403,
        {
          id: user.id,
          name: user.user_name,
          email: user.user_email,
          role: user.user_role,
          is_verified: user.is_verified,
          is_approved: user.is_approved,
        },
        "Trainer account is pending approval"
      );
    }

    // Return the user profile
    return send.sendResponseMessage(
      res,
      200,
      {
        id: user.id,
        name: user.user_name,
        email: user.user_email,
        role: user.user_role,
        is_verified: user.is_verified,
        is_approved: user.is_approved,
      },
      "User profile retrieved successfully"
    );
  } catch (error) {
    console.error("Error getting user profile:", error);
    return send.sendErrorMessage(res, 500, error);
  }
}

