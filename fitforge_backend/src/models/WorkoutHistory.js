module.exports = (sequelize, DataTypes) => {
  const WorkoutHistory = sequelize.define("WorkoutHistory", {
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completion_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return WorkoutHistory;
};
