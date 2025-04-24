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
