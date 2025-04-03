/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define("Exercise", {
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reps: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    work_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rest_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rest_between: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    exercise_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Exercise;
};
