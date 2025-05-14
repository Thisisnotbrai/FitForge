/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define(
    "Exercise",
    {
      workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "traineeworkouts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      exercise_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      work_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 45,
      },
      rest_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
      },
      rest_between: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      exercise_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      // This is where tableName should go - as a model option
      tableName: "exercises",
    }
  );

  Exercise.associate = (models) => {
    Exercise.belongsTo(models.TraineeWorkout, {
      foreignKey: "workout_id",
      as: "workout",
    });
  };

  return Exercise;
};
