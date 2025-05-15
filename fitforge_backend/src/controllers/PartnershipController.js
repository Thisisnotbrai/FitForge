const db = require("../models/database");
const { Partnership, User, Bookings } = db;

// Create a new partnership between trainer and trainee
exports.createPartnership = async (req, res) => {
  try {
    const { trainee_id, trainer_id, start_date, notes } = req.body;

    // Validate that both users exist with proper roles
    const trainee = await User.findOne({
      where: { id: trainee_id, user_role: "trainee" },
    });
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found" });
    }

    const trainer = await User.findOne({
      where: {
        id: trainer_id,
        user_role: "trainer",
        is_verified: true,
        is_approved: true,
      },
    });
    if (!trainer) {
      return res
        .status(404)
        .json({ message: "Trainer not found or not approved" });
    }

    // Check if a partnership already exists
    const existingPartnership = await Partnership.findOne({
      where: {
        trainee_id,
        trainer_id,
      },
    });

    if (existingPartnership) {
      return res.status(400).json({
        message:
          "A partnership already exists between this trainer and trainee",
        partnership: existingPartnership,
      });
    }

    // Create new partnership with optional start_date
    const partnership = await Partnership.create({
      trainee_id,
      trainer_id,
      start_date: start_date || new Date(), // Use provided date or default to now
      end_date: null, // Initially null since it's a new active partnership
      notes,
      status: "active",
    });

    return res.status(201).json(partnership);
  } catch (error) {
    console.error("Error creating partnership:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get partnerships for a trainee
exports.getTraineePartnerships = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const partnerships = await Partnership.findAll({
      where: { trainee_id: traineeId },
      include: [
        {
          model: User,
          as: "trainer",
          attributes: ["id", "user_name", "user_email"],
          include: [
            {
              model: db.TrainerInfo,
              as: "trainerInfo",
              attributes: ["specialization", "hourly_rate"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(partnerships);
  } catch (error) {
    console.error("Error getting trainee partnerships:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get partnerships for a trainer
exports.getTrainerPartnerships = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const partnerships = await Partnership.findAll({
      where: { trainer_id: trainerId },
      include: [
        {
          model: User,
          as: "trainee",
          attributes: ["id", "user_name", "user_email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(partnerships);
  } catch (error) {
    console.error("Error getting trainer partnerships:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update partnership status
exports.updatePartnershipStatus = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { status, notes, end_date } = req.body;

    // Validate status
    if (!["active", "paused", "terminated"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const partnership = await Partnership.findByPk(partnershipId);
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    // Update partnership
    partnership.status = status;

    // If terminating, set end_date if not already set
    if (status === "terminated" && !partnership.end_date) {
      partnership.end_date = end_date || new Date();
    }

    // If reactivating, clear end_date
    if (status === "active" && partnership.end_date) {
      partnership.end_date = null;
    }

    if (notes) partnership.notes = notes;
    await partnership.save();

    return res.status(200).json(partnership);
  } catch (error) {
    console.error("Error updating partnership status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete partnership
exports.deletePartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    const partnership = await Partnership.findByPk(partnershipId);
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    await partnership.destroy();
    return res
      .status(200)
      .json({ message: "Partnership successfully deleted" });
  } catch (error) {
    console.error("Error deleting partnership:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Automatically create partnership when a booking is confirmed
exports.checkAndCreatePartnershipFromBooking = async (bookingId) => {
  try {
    const booking = await Bookings.findByPk(bookingId);

    if (!booking || booking.status !== "confirmed") {
      return null;
    }

    const { trainee_id, trainer_id } = booking;

    // Check if partnership already exists
    let partnership = await Partnership.findOne({
      where: { trainee_id, trainer_id },
    });

    // If it exists, just return it
    if (partnership) {
      return partnership;
    }

    // Create new partnership using the booking's start_date
    partnership = await Partnership.create({
      trainee_id,
      trainer_id,
      start_date: booking.start_date,
      end_date: null,
      notes: `Partnership created from confirmed booking #${bookingId}`,
      status: "active",
    });

    return partnership;
  } catch (error) {
    console.error("Error auto-creating partnership:", error);
    return null;
  }
};

exports.managePartnershipFromBookingStatus = async (bookingId, newStatus) => {
  try {
    const booking = await Bookings.findByPk(bookingId);

    if (!booking) {
      console.error(`Booking #${bookingId} not found`);
      return null;
    }

    const { trainee_id, trainer_id } = booking;

    // Find any existing partnership between this trainer and trainee
    let partnership = await Partnership.findOne({
      where: { trainee_id, trainer_id },
    });

    switch (newStatus) {
      case "confirmed":
        // If partnership doesn't exist, create a new one
        if (!partnership) {
          partnership = await Partnership.create({
            trainee_id,
            trainer_id,
            start_date: booking.start_date,
            end_date: null,
            notes: `Partnership created from confirmed booking #${bookingId}`,
            status: "active",
          });
          console.log(
            `Created new partnership #${partnership.id} from booking #${bookingId}`
          );
        } else if (partnership.status !== "active") {
          // If partnership exists but isn't active, reactivate it
          partnership.status = "active";
          partnership.end_date = null; // Clear end date when reactivating
          partnership.notes =
            partnership.notes + `\nReactivated from booking #${bookingId}`;
          await partnership.save();
          console.log(
            `Reactivated partnership #${partnership.id} from booking #${bookingId}`
          );
        }
        break;

      case "cancelled":
        // If partnership exists, terminate it
        if (partnership) {
          partnership.status = "terminated";
          partnership.end_date = new Date(); // Set end date to now
          partnership.notes =
            partnership.notes +
            `\nTerminated due to cancelled booking #${bookingId}`;
          await partnership.save();
          console.log(
            `Terminated partnership #${partnership.id} due to cancelled booking #${bookingId}`
          );
        }
        break;

      case "completed": {
        // When a booking is completed, check if there are any other active or pending bookings
        // If none, terminate the partnership
        const activeBookings = await Bookings.count({
          where: {
            trainee_id,
            trainer_id,
            status: ["confirmed", "pending"],
            id: { [db.Sequelize.Op.ne]: bookingId }, // Not the current booking
          },
        });

        if (activeBookings === 0 && partnership) {
          partnership.status = "terminated";
          partnership.end_date = new Date(); // Set end date to now
          partnership.notes =
            partnership.notes +
            `\nTerminated after completed booking #${bookingId} with no future bookings`;
          await partnership.save();
          console.log(
            `Terminated partnership #${partnership.id} after completed booking with no future bookings`
          );
        }
        break;
      }
    }

    return partnership;
  } catch (error) {
    console.error("Error managing partnership from booking:", error);
    return null;
  }
};
