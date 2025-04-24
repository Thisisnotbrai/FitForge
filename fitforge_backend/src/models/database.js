/* eslint-disable no-undef */
const dbconfig = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbconfig.database,
  dbconfig.user,
  dbconfig.password,
  {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
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
db.Exercise = require("../models/exercise")(sequelize, DataTypes);
db.Workouts = require("../models/Workouts")(sequelize, DataTypes);
db.WorkoutHistory = require("../models/WorkoutHistory")(sequelize, DataTypes);
db.TraineeWorkout = require("../models/TraineeWorkout")(sequelize, DataTypes);

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize
  .sync({ alter: true }) // Using alter:true to update the schema
  .then(() => console.log("Database synced successfully!"))
  .catch((error) => console.error("error during connection", error));

module.exports = db;
