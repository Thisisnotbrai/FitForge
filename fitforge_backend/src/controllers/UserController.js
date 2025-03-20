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
}

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
    const { user_name, user_email, user_password, user_role } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
      return send.sendResponseMessage(res, 400, null, "Email already in use");
    }

    if (!["trainee", "trainer", "admin"].includes(user_role)) {
      return send.sendResponseMessage(res, 400, null, "Invalid role provided");
    }

    const hash = await argon2.hash(user_password);

    const verificationcode = Math.floor(100000 + Math.random() * 900000);
    const emailsent = await verificationEmail(user_email, verificationcode);
    if (!emailsent) {
      return send.sendResponseMessage(res, 500, null, "Email not sent");
    }
    const newUser = await User.create({
      user_name: user_name,
      user_email: user_email,
      user_password: hash,
      user_role: user_role || "trainee",
      verification_code: verificationcode,
      is_verified: false,
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
