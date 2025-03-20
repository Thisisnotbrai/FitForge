/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
    const Exercise = sequelize.define("Exercise", {
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      reps_sets: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      muscle_group: {
        type: DataTypes.ENUM('Biceps', 'Triceps', 'Back', 'Chest', 'Legs', 'Forearms'),
        allowNull: false,
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Exercise;
  };