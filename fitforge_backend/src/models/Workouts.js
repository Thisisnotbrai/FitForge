module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define("Workout", {
    workout_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workout_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workout_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workout_calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workout_level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Workout;
};
