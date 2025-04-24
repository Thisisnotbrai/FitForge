/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const TrainerInfo = sequelize.define("TrainerInfo", {
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    available_days: {
      type: DataTypes.JSON, // Array of available days (e.g., ["Monday", "Wednesday", "Friday"])
      allowNull: true,
    },
    available_hours_from: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    available_hours_to: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    qualifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certificates: {
      type: DataTypes.JSON, // Array of certificate objects
      allowNull: true,
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  // Define association with User model
  TrainerInfo.associate = function (models) {
    TrainerInfo.belongsTo(models.User, {
      foreignKey: {
        name: "id",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };

  return TrainerInfo;
};
