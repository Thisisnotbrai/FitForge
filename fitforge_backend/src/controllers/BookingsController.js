const db = require("../models/database");
const { Bookings, User, TrainerInfo } = db;
const partnershipController = require("./PartnershipController");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { trainee_id, trainer_id, date, start_date, end_date, notes } =
      req.body;

    // Debug logging to check if end_date is being received
    console.log("Booking request received:", {
      trainee_id,
      trainer_id,
      date,
      start_date,
      end_date,
      notes,
      end_date_type: typeof end_date,
      end_date_null: end_date === null,
      end_date_undefined: end_date === undefined,
      end_date_empty: end_date === "",
    });

    // Validate required fields
    if (!trainee_id || !trainer_id || !date || !start_date || !end_date) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "trainee_id",
          "trainer_id",
          "date",
          "start_date",
          "end_date",
        ],
        received: { trainee_id, trainer_id, date, start_date, end_date },
      });
    }

    // Specific validation for end_date
    if (end_date === null || end_date === undefined || end_date === "") {
      return res.status(400).json({
        message: "end_date cannot be null, undefined, or empty",
        received_end_date: end_date,
        end_date_type: typeof end_date,
      });
    }

    // Try to parse end_date to ensure it's a valid date
    try {
      const endDateObj = new Date(end_date);
      if (isNaN(endDateObj.getTime())) {
        return res.status(400).json({
          message: "end_date is not a valid date",
          received_end_date: end_date,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Failed to parse end_date",
        received_end_date: end_date,
        error: error.message,
      });
    }

    // Validate that both users exist
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
      include: [{ model: TrainerInfo, as: "trainerInfo" }],
    });
    if (!trainer) {
      return res
        .status(404)
        .json({ message: "Trainer not found or not approved" });
    }

    // Check if trainee already has an active partnership with a different trainer
    const activePartnerships = await db.Partnership.findAll({
      where: {
        trainee_id,
        status: "active",
      },
    });

    // If there's an active partnership with a different trainer, reject the booking
    if (activePartnerships && activePartnerships.length > 0) {
      const hasAnotherTrainer = activePartnerships.some(
        (partnership) => partnership.trainer_id !== parseInt(trainer_id)
      );

      if (hasAnotherTrainer) {
        return res.status(403).json({
          message:
            "You already have an active partnership with a different trainer. You can only book sessions with your current trainer.",
        });
      }
    }

    // Check if trainer is available on that day
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.toLocaleString("en-us", { weekday: "long" });

    if (
      trainer.trainerInfo.available_days &&
      !trainer.trainerInfo.available_days.includes(dayOfWeek)
    ) {
      return res.status(400).json({
        message: `Trainer is not available on ${dayOfWeek}`,
      });
    }

    // Parse the start_date and end_date to extract hours for availability check
    const startDateTime = new Date(start_date);
    const endDateTime = new Date(end_date);

    // Format hours for comparison (assuming trainer's available_hours are in HH:MM format)
    const bookingStartHour =
      startDateTime.getHours() +
      ":" +
      (startDateTime.getMinutes() < 10 ? "0" : "") +
      startDateTime.getMinutes();
    const bookingEndHour =
      endDateTime.getHours() +
      ":" +
      (endDateTime.getMinutes() < 10 ? "0" : "") +
      endDateTime.getMinutes();

    // Check if the requested time is within trainer's available hours
    const trainerStartTime = trainer.trainerInfo.available_hours_from;
    const trainerEndTime = trainer.trainerInfo.available_hours_to;

    if (
      bookingStartHour < trainerStartTime ||
      bookingEndHour > trainerEndTime
    ) {
      return res.status(400).json({
        message: `Trainer is only available from ${trainerStartTime} to ${trainerEndTime}`,
      });
    }

    // Check for existing bookings in the same time slot
    const existingBooking = await Bookings.findOne({
      where: {
        trainer_id,
        status: ["pending", "confirmed"],
        // Either starts or ends during the requested time slot
        [db.Sequelize.Op.or]: [
          {
            start_date: {
              [db.Sequelize.Op.between]: [start_date, end_date],
            },
          },
          {
            end_date: {
              [db.Sequelize.Op.between]: [start_date, end_date],
            },
          },
          {
            [db.Sequelize.Op.and]: [
              { start_date: { [db.Sequelize.Op.lte]: start_date } },
              { end_date: { [db.Sequelize.Op.gte]: end_date } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Trainer already has a booking at this time" });
    }

    // Create the booking
    const bookingData = {
      trainee_id,
      trainer_id,
      date,
      start_date,
      end_date,
      notes,
      status: "pending",
    };

    console.log("Creating booking with data:", bookingData);

    const booking = await Bookings.create(bookingData);

    // Debug logging to check created booking
    console.log("Booking created:", booking.toJSON());
    console.log("end_date in created booking:", booking.end_date);

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get bookings by trainee ID
exports.getBookingsByTrainee = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const bookings = await Bookings.findAll({
      where: { trainee_id: traineeId },
      include: [
        {
          model: User,
          as: "trainer",
          attributes: ["id", "user_name", "user_email"],
          include: [
            {
              model: TrainerInfo,
              as: "trainerInfo",
              attributes: ["specialization", "hourly_rate"],
            },
          ],
        },
      ],
      order: [
        ["date", "DESC"],
        ["start_date", "ASC"],
      ],
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting trainee bookings:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get bookings by trainer ID
exports.getBookingsByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const bookings = await Bookings.findAll({
      where: { trainer_id: trainerId },
      include: [
        {
          model: User,
          as: "trainee",
          attributes: ["id", "user_name", "user_email"],
        },
      ],
      order: [
        ["date", "DESC"],
        ["start_date", "ASC"],
      ],
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting trainer bookings:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Store the old status to check if it's actually changing
    const oldStatus = booking.status;

    // Update booking
    booking.status = status;
    await booking.save();

    // If status has changed, manage the partnership
    if (oldStatus !== status) {
      await partnershipController.managePartnershipFromBookingStatus(
        bookingId,
        status
      );
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.destroy();
    return res.status(200).json({ message: "Booking successfully deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get Booking Analytics for Admin Dashboard
exports.getBookingStats = async (req, res) => {
  try {
    // Get total number of bookings
    const totalBookings = await getBookingCount();
    
    // Get pending bookings
    const pendingBookings = await getBookingCountByStatus('pending');
    
    // Get completed bookings
    const completedBookings = await getBookingCountByStatus('completed');
    
    // Get booking trends for last 6 months
    const bookingTrend = await getBookingTrend();
    
    return res.status(200).json({
      success: true,
      message: "Booking statistics retrieved successfully",
      data: {
        totalBookings,
        pendingBookings,
        completedBookings,
        bookingTrend
      }
    });
  } catch (error) {
    console.error("Error retrieving booking stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve booking statistics",
      error: error.message
    });
  }
};

// Helper function to count bookings
const getBookingCount = async () => {
  try {
    const count = await Bookings.count();
    return count;
  } catch (error) {
    console.error("Error counting bookings:", error);
    return 0;
  }
};

// Helper function to count bookings by status
const getBookingCountByStatus = async (status) => {
  try {
    const count = await Bookings.count({
      where: { status }
    });
    return count;
  } catch (error) {
    console.error(`Error counting ${status} bookings:`, error);
    return 0;
  }
};

// Helper function to get booking trend
const getBookingTrend = async () => {
  try {
    const { Sequelize } = require('../models/database');
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Simplified approach using JS date processing
    const bookings = await Bookings.findAll({
      where: {
        created_at: {
          [Sequelize.Op.gte]: sixMonthsAgo
        }
      },
      attributes: ['created_at'],
      order: [['created_at', 'ASC']]
    });
    
    // Process bookings into monthly buckets
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    bookings.forEach(booking => {
      const date = new Date(booking.created_at);
      const monthName = months[date.getMonth()];
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0;
      }
      monthlyData[monthName]++;
    });
    
    // Convert to array format
    const trend = Object.keys(monthlyData).map(month => ({
      date: month,
      count: monthlyData[month]
    }));
    
    return trend;
  } catch (error) {
    console.error("Error getting booking trend:", error);
    return [];
  }
};
// Debug endpoint to directly check bookings in database
exports.debugTrainerBookings = async (req, res) => {
  try {
    const { trainerId } = req.params;

    console.log(
      `[BookingsController DEBUG] Checking bookings for trainer ID: ${trainerId}`
    );

    // Convert ID to number
    const trainerIdNum = parseInt(trainerId, 10);

    if (isNaN(trainerIdNum)) {
      return res.status(400).json({
        message: "Invalid trainer ID format",
        success: false,
      });
    }

    // First check if the trainer exists
    const trainerExists = await User.findOne({
      where: { id: trainerIdNum, user_role: "trainer" },
    });

    if (!trainerExists) {
      return res.status(404).json({
        message: "Trainer not found",
        success: false,
      });
    }

    // Debug output about the trainer
    console.log("[BookingsController DEBUG] Found trainer:", {
      id: trainerExists.id,
      name: trainerExists.user_name,
      email: trainerExists.user_email,
      role: trainerExists.user_role,
    });

    // Check for bookings using direct SQL query
    const rawBookings = await db.sequelize.query(
      "SELECT * FROM Bookings WHERE trainer_id = :trainerId",
      {
        replacements: { trainerId: trainerIdNum },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Check for bookings using string comparison
    const stringComparisonBookings = await db.sequelize.query(
      "SELECT * FROM Bookings WHERE CAST(trainer_id AS CHAR) = CAST(:trainerId AS CHAR)",
      {
        replacements: { trainerId: trainerIdNum },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Check all bookings
    const allBookings = await db.sequelize.query(
      "SELECT * FROM Bookings LIMIT 10",
      {
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Return comprehensive debug data
    return res.status(200).json({
      message: "Debug information",
      success: true,
      trainer: {
        id: trainerExists.id,
        name: trainerExists.user_name,
        email: trainerExists.user_email,
        role: trainerExists.user_role,
      },
      bookings: {
        exactMatch: {
          count: rawBookings.length,
          results: rawBookings,
        },
        stringComparison: {
          count: stringComparisonBookings.length,
          results: stringComparisonBookings,
        },
        allBookings: {
          count: allBookings.length,
          results: allBookings,
        },
      },
    });
  } catch (error) {
    console.error("[BookingsController DEBUG] Error:", error);
    return res.status(500).json({
      message: "Server error during debug",
      error: error.message,
      success: false,
    });
  }
}
