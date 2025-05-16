/* eslint-disable no-undef */
const dbconfig = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

// Log database configuration (without sensitive info)
console.log("Database configuration:", {
  database: dbconfig.database,
  host: dbconfig.host,
  dialect: dbconfig.dialect,
});

const sequelize = new Sequelize(
  dbconfig.database,
  dbconfig.user,
  dbconfig.password,
  {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
    logging: console.log, // Enable SQL query logging
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log(err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.TrainerInfo = require("../models/TrainerInfo")(sequelize, DataTypes);
db.User = require("../models/User")(sequelize, DataTypes);
db.Exercise = require("../models/Exercise")(sequelize, DataTypes);
db.Workouts = require("../models/Workouts")(sequelize, DataTypes);
db.WorkoutHistory = require("../models/WorkoutHistory")(sequelize, DataTypes);
db.Bookings = require("../models/Bookings")(sequelize, DataTypes);
db.TraineeWorkout = require("../models/TraineeWorkout")(sequelize, DataTypes);
db.Partnership = require("../models/Partnership")(sequelize, DataTypes);

// Log model definitions
console.log("Bookings model definition:", {
  end_date: db.Bookings.rawAttributes.end_date,
});

console.log("Partnership model definition:", {
  end_date: db.Partnership.rawAttributes.end_date,
});

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize
  .sync({ alter: false }) // Using alter:true to update the schema
  .then(() => console.log("Database synced successfully!"))
  .catch((error) => console.error("error during connection", error));

module.exports = db;
