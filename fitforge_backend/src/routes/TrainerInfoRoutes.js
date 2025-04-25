/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/TrainerInfoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all trainers
router.get("/trainers", trainerController.getAllTrainers);

// Get trainer info
router.get("/:userId", trainerController.getTrainerInfo);

// Create trainer info - requires authentication
router.post("/:userId", trainerController.createTrainerInfo);

// Update trainer info - requires authentication
router.put("/:userId", trainerController.updateTrainerInfo);

module.exports = router;
