"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First remove any existing problematic foreign key
    await queryInterface.removeConstraint(
      "trainerinfos",
      "trainerinfos_userId_foreign"
    );

    // Then add the correct foreign key
    await queryInterface.addConstraint("trainerinfos", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_trainerinfos_users",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "trainerinfos",
      "fk_trainerinfos_users"
    );
  },
};
