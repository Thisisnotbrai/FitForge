/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const TraineeWorkout = sequelize.define(
    "TraineeWorkout",
    {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "traineeworkouts", // Moved to configuration options
    }
  );

  TraineeWorkout.associate = (models) => {
    TraineeWorkout.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "creator",
    });

    TraineeWorkout.hasMany(models.Exercise, {
      foreignKey: "workout_id",
      as: "exercises",
    });
  };

  return TraineeWorkout;
};
