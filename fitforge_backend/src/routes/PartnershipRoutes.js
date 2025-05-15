const express = require("express");
const router = express.Router();
const partnershipController = require("../controllers/PartnershipController");

// Create a new partnership
router.post("/create", partnershipController.createPartnership);

// Get partnerships by trainee ID
router.get("/trainee/:traineeId", partnershipController.getTraineePartnerships);

// Get partnerships by trainer ID
router.get("/trainer/:trainerId", partnershipController.getTrainerPartnerships);

// Update partnership status
router.put(
  "/:partnershipId/status",
  partnershipController.updatePartnershipStatus
);

// Delete partnership
router.delete("/:partnershipId", partnershipController.deletePartnership);

module.exports = router;
