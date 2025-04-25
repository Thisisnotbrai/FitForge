/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define(
    "Bookings",
    {
      trainee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
        defaultValue: "pending",
      },
      notes: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      tableName: "Bookings",
      freezeTableName: true,
    }
  );

  Bookings.associate = function (models) {
    Bookings.belongsTo(models.User, {
      foreignKey: "trainee_id",
      as: "trainee",
    });

    Bookings.belongsTo(models.User, {
      foreignKey: "trainer_id",
      as: "trainer",
    });
  };

  return Bookings;
};
