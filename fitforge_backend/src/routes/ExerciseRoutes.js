/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/ExerciseController");

router.get("/exercises", exerciseController.getExercises);
router.post("/exercises", exerciseController.addExercise);

module.exports = router;
