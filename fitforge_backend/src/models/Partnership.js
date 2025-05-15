module.exports = (sequelize, DataTypes) => {
  const Partnership = sequelize.define(
    "Partnership",
    {
      trainee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "The date when the partnership began",
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "The date when the partnership ended (null if still active)",
      },
      status: {
        type: DataTypes.ENUM("active", "paused", "terminated"),
        defaultValue: "active",
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
      tableName: "Partnerships",
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["trainee_id", "trainer_id"],
        },
      ],
    }
  );

  Partnership.associate = function (models) {
    Partnership.belongsTo(models.User, {
      foreignKey: "trainee_id",
      as: "trainee",
    });

    Partnership.belongsTo(models.User, {
      foreignKey: "trainer_id",
      as: "trainer",
    });
  };

  return Partnership;
};
