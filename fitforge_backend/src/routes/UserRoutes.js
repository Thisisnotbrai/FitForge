/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", userController.userLogin);
router.post("/register", userController.registerUser);
router.post("/verify", userController.verifyEmail);

// Add user profile route - get current authenticated user's profile
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  userController.getUserProfile
);

// Public route to get a trainer by ID (for trainees to view trainers)
router.get(
  "/trainer/:id",
  authMiddleware.authenticateToken,
  userController.getTrainerById
);

// Admin routes with authentication and admin role check
router.put(
  "/approve/:trainerId",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.approveTrainer
);
router.get(
  "/pending-trainers",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.getPendingTrainers
);
router.get(
  "/trainers",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.getTrainers
);
// Admin-only route to get trainer by ID (commented out since we have a public version above)
// router.get(
//   "/trainers/:id",
//   authMiddleware.authenticateToken,
//   authMiddleware.isAdmin,
//   userController.getTrainerById
// );
router.get(
  "/trainees",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.getTrainees
);

// Admin Analytics Routes
router.get(
  "/stats",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.getUserStats
);

// Admin User Management Routes
router.put(
  "/suspend/:userId",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  userController.suspendUser
);

module.exports = router;
