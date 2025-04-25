/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./BookingModal.css";
import axios from "axios";

const BookingModal = ({ trainer, traineeId, onClose }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Safely convert available_days to array
  const parseAvailableDays = (days) => {
    if (!days) return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(days);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // If not JSON, split by comma
      if (typeof days === "string") {
        return days
          .split(",")
          .map((day) => day.trim())
          .filter((day) => day);
      }
    }

    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const availableDays = parseAvailableDays(trainer.availableDays);

  // Get the next 14 days as date options
  const getDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleString("en-us", { weekday: "long" });

      // Only include days when the trainer is available
      if (availableDays.includes(dayName)) {
        const formattedDate = date.toISOString().split("T")[0];
        const displayDate = `${dayName}, ${date.toLocaleDateString()}`;

        options.push({ value: formattedDate, label: displayDate });
      }
    }

    return options;
  };

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTimeDisplay = (time) => {
    if (!time) return "";
    return time.slice(0, 5); // Takes "09:00:00" -> "09:00"
  };

  // Generate time slots based on trainer availability
  const getTimeOptions = () => {
    const options = [];
    const fromTime = trainer.availableHoursFrom || "09:00:00";
    const toTime = trainer.availableHoursTo || "17:00:00";

    // Convert to hours and minutes
    const fromHour = parseInt(fromTime.split(":")[0]);
    const fromMinute = parseInt(fromTime.split(":")[1]);
    const toHour = parseInt(toTime.split(":")[0]);
    const toMinute = parseInt(toTime.split(":")[1]);

    // Generate 30-minute slots
    for (let h = fromHour; h <= toHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Skip times before from time
        if (h === fromHour && m < fromMinute) continue;

        // Skip times after to time
        if (h === toHour && m > toMinute) continue;

        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        const timeValue = `${hour}:${minute}:00`;
        const displayTime = `${hour}:${minute}`;

        options.push({ value: timeValue, label: displayTime });
      }
    }

    return options;
  };

  const dateOptions = getDateOptions();
  const timeOptions = getTimeOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      if (!date || !startTime || !endTime) {
        throw new Error("Please select date and time for your booking");
      }

      if (startTime >= endTime) {
        throw new Error("End time must be after start time");
      }

      // Create booking
      await axios.post("http://localhost:3000/booking/createbook", {
        trainee_id: traineeId,
        trainer_id: trainer.id,
        date,
        start_time: startTime,
        end_time: endTime,
        notes,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate session duration when start and end times are selected
  const calculateDuration = () => {
    if (!startTime || !endTime) return null;

    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);

    return durationHours;
  };

  // Calculate estimated price based on hourly rate and duration
  const calculatePrice = () => {
    const duration = calculateDuration();
    if (duration === null) return null;

    const hourlyRate = parseFloat(
      trainer.price.replace("$", "").replace("/hour", "")
    );
    return (hourlyRate * duration).toFixed(2);
  };

  const duration = calculateDuration();
  const estimatedPrice = calculatePrice();

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Book a Session with {trainer.name}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="success-message">
              <h3>Booking Successful!</h3>
              <p>Your booking request has been sent to {trainer.name}.</p>
              <p>
                You&apos;ll receive a notification once it&apos;s confirmed.
              </p>
            </div>
          ) : (
            <>
              <div className="trainer-details">
                <div className="trainer-info">
                  <h3>{trainer.name}</h3>
                  <p>
                    <strong>Specialty:</strong> {trainer.specialty}
                  </p>
                  <p>
                    <strong>Experience:</strong> {trainer.experience}
                  </p>
                  <p>
                    <strong>Rate:</strong> {trainer.price}
                  </p>
                  <p>
                    <strong>Available days:</strong> {availableDays.join(", ")}
                  </p>
                  <p>
                    <strong>Available hours:</strong>{" "}
                    {formatTimeDisplay(trainer.availableHoursFrom)} -{" "}
                    {formatTimeDisplay(trainer.availableHoursTo)}
                  </p>
                  {trainer.qualifications && (
                    <p>
                      <strong>Qualifications:</strong> {trainer.qualifications}
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="booking-date">Select Date</label>
                  <select
                    id="booking-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  >
                    <option value="">-- Select Date --</option>
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group time-group">
                  <div>
                    <label htmlFor="start-time">Start Time</label>
                    <select
                      id="start-time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    >
                      <option value="">-- Select --</option>
                      {timeOptions.map((option) => (
                        <option
                          key={`start-${option.value}`}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="end-time">End Time</label>
                    <select
                      id="end-time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    >
                      <option value="">-- Select --</option>
                      {timeOptions.map((option) => (
                        <option
                          key={`end-${option.value}`}
                          value={option.value}
                          disabled={option.value <= startTime}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {duration !== null && estimatedPrice !== null && (
                  <div className="booking-summary">
                    <p>
                      <strong>Duration:</strong> {duration} hours
                    </p>
                    <p>
                      <strong>Estimated Price:</strong> ${estimatedPrice}
                    </p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="notes">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information the trainer should know"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Book Session"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  trainer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    specialty: PropTypes.string,
    experience: PropTypes.string,
    price: PropTypes.string,
    availableDays: PropTypes.arrayOf(PropTypes.string),
    availableHoursFrom: PropTypes.string,
    availableHoursTo: PropTypes.string,
    qualifications: PropTypes.string,
  }).isRequired,
  traineeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookingModal;
