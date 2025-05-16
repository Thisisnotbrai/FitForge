/* eslint-disable no-undef */
const { sequelize } = require("../models/database");

async function addCreatedByTrainerField() {
  try {
    console.log(
      "Starting migration: Adding created_by_trainer field to traineeworkouts table"
    );

    // Check if the column already exists
    const [results] = await sequelize.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'traineeworkouts' AND COLUMN_NAME = 'created_by_trainer'"
    );

    if (results.length === 0) {
      // Column doesn't exist, add it
      await sequelize.query(
        "ALTER TABLE traineeworkouts ADD COLUMN created_by_trainer BOOLEAN DEFAULT false"
      );
      console.log(
        "Migration successful: Added created_by_trainer field to traineeworkouts table"
      );
    } else {
      console.log("Migration skipped: created_by_trainer field already exists");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Execute the migration
addCreatedByTrainerField();
