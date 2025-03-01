const { User: User } = require("../models/database");
const send = require("../utils/response");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    const newUser = await User.create({
      user_name: user_name,
      user_email: user_email,
      user_password: hash,
      user_role: user_role || "trainee",
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
