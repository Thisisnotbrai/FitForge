/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

// Import controllers
const adminController = require("../controllers/AdminController");

// Import middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Admin system health route
router.get(
  "/admin/system-health",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  adminController.getSystemHealth
);

module.exports = router; 