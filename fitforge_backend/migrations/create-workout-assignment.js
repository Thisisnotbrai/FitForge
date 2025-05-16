"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("WorkoutAssignments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trainee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      workout_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Workouts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assigned_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex("WorkoutAssignments", ["trainee_id"]);
    await queryInterface.addIndex("WorkoutAssignments", ["trainer_id"]);
    await queryInterface.addIndex("WorkoutAssignments", ["workout_id"]);
    await queryInterface.addIndex("WorkoutAssignments", ["assigned_date"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("WorkoutAssignments");
  },
};
