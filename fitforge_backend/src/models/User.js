/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
          msg: "Password must be at least 8 characters long and contain at least one capital letter and a number.",
        },
      },
    },
    user_role: {
      type: DataTypes.ENUM("trainee", "trainer", "admin"),
      allowNull: false,
      defaultValue: "trainee",
    },
    verification_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Trainers are not approved by default
    },
  });

  User.associate = function (models) {
    User.hasOne(models.TrainerInfo, {
      foreignKey: "userId",
      as: "trainerInfo",
    });
  };

  return User;
};
