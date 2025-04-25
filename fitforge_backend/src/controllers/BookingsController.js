const db = require("../models/database");
const { Bookings, User, TrainerInfo } = db;

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { trainee_id, trainer_id, date, start_time, end_time, notes } =
      req.body;

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

    // Check if the requested time is within trainer's available hours
    const trainerStartTime = trainer.trainerInfo.available_hours_from;
    const trainerEndTime = trainer.trainerInfo.available_hours_to;

    if (start_time < trainerStartTime || end_time > trainerEndTime) {
      return res.status(400).json({
        message: `Trainer is only available from ${trainerStartTime} to ${trainerEndTime}`,
      });
    }

    // Check for existing bookings in the same time slot
    const existingBooking = await Bookings.findOne({
      where: {
        trainer_id,
        date,
        status: ["pending", "confirmed"],
        // Either starts or ends during the requested time slot
        [db.Sequelize.Op.or]: [
          {
            start_time: { [db.Sequelize.Op.between]: [start_time, end_time] },
          },
          {
            end_time: { [db.Sequelize.Op.between]: [start_time, end_time] },
          },
          {
            [db.Sequelize.Op.and]: [
              { start_time: { [db.Sequelize.Op.lte]: start_time } },
              { end_time: { [db.Sequelize.Op.gte]: end_time } },
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
    const booking = await Bookings.create({
      trainee_id,
      trainer_id,
      date,
      start_time,
      end_time,
      notes,
      status: "pending",
    });

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
        ["start_time", "ASC"],
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
        ["start_time", "ASC"],
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

    // Update status
    booking.status = status;
    await booking.save();

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
