const express = require("express");
const router = express.Router();
const WorkoutHistoryController = require("../controllers/WorkoutHistoryController");

router.post("/workout-history", WorkoutHistoryController.postWorkoutHistory);

module.exports = router;
