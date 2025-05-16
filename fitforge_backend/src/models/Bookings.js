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
        comment: "The date for the booking",
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Full date and time for the start of the booking",
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Full date and time for the end of the booking",
        get() {
          // This ensures we always get the raw value, not a modified one
          const rawValue = this.getDataValue("end_date");
          return rawValue;
        },
        set(value) {
          // This ensures we're setting the raw value correctly
          if (!value) {
            throw new Error("end_date cannot be null or undefined");
          }
          this.setDataValue("end_date", value);
        },
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
