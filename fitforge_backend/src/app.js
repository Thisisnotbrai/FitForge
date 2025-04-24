/* eslint-disable no-undef */
const express = require("express");
const app = express();
const parser = require("body-parser");
const morgan = require("morgan");
// eslint-disable-next-line no-unused-vars
const database = require("./models/database");
const cors = require("cors");

app.use(morgan("dev"));
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

const userRoutes = require("./routes/UserRoutes");
const exerciseRoutes = require("./routes/ExerciseRoutes");
const workoutRoutes = require("./routes/WorkoutRoutes");
const trainerinfoRoutes = require("./routes/TrainerInfoRoutes");
const traineeWorkoutRoutes = require("./routes/TraineeWorkoutRoutes");

app.use("/users", userRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/workouts", workoutRoutes);
app.use("/trainerinfo", trainerinfoRoutes);
app.use("/", traineeWorkoutRoutes); // Using root path since routes have their own prefixes

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.json({
    message: error.message,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  return res.status(error.status || 500);
  // eslint-disable-next-line no-unreachable
  res.json({
    message: error.message,
  });
});

module.exports = app;
