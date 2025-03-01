const express = require("express");
const app = express();
const parser = require("body-parser");
const morgan = require("morgan");
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

app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  res.json({
    message: error.message,
  });
});

app.use((req, res, next) => {
  return res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
