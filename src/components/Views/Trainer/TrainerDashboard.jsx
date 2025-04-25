import React, { useState, useEffect } from "react";
import "./TrainerDashboard.css";
import axios from "axios";

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrainer, setCurrentTrainer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated");
        }

        // Get user from localStorage
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User data not found");
        }

        const user = JSON.parse(userString);

        // Verify user is a trainer
        const userRole = user.role || user.user_role;
        if (userRole !== "trainer") {
          throw new Error(
            "Access denied. Only trainers can access this dashboard."
          );
        }

        setCurrentTrainer(user);

        // Fetch bookings for this trainer
        const response = await axios.get(
          `http://localhost:3000/booking/trainer/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ensure bookings is always an array
        const bookingsData = Array.isArray(response.data) ? response.data : [];
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load dashboard");
        // Ensure bookings is set to empty array even on error
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle booking status update
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Fix: Use the correct API endpoint URL that matches your backend routes
      await axios.put(
        `http://localhost:3000/booking/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert(
        `Failed to update booking: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        try {
          const bookingDate = new Date(booking.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          bookingDate.setHours(0, 0, 0, 0);

          const isPast = bookingDate < today;
          const isToday = bookingDate.getTime() === today.getTime();

          switch (activeTab) {
            case "upcoming":
              return (
                (bookingDate >= today && booking.status !== "cancelled") ||
                (isToday && booking.status === "pending") ||
                booking.status === "confirmed"
              );
            case "pending":
              return booking.status === "pending";
            case "completed":
              return (
                booking.status === "completed" ||
                (isPast && booking.status === "confirmed")
              );
            case "cancelled":
              return booking.status === "cancelled";
            default:
              return true;
          }
        } catch (e) {
          console.error("Error filtering booking:", booking, e);
          return false;
        }
      })
    : [];

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        {currentTrainer && (
          <div className="trainer-welcome">
            <p>Welcome, {currentTrainer.user_name}!</p>
            <p className="sub-text">Manage your bookings and schedule below</p>
          </div>
        )}
      </div>

      <div className="bookings-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`booking-card status-${booking.status}`}
              >
                <div className="booking-header">
                  <div className="booking-date">
                    <h3>{formatDate(booking.date)}</h3>
                    <p>
                      {booking.start_time?.substring(0, 5) ||
                        booking.start_time}{" "}
                      - {booking.end_time?.substring(0, 5) || booking.end_time}
                    </p>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status?.charAt(0).toUpperCase() +
                        booking.status?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <h4>Client</h4>
                  <p>
                    <strong>Name:</strong>{" "}
                    {booking.trainee?.user_name || "Anonymous"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {booking.trainee?.user_email || "N/A"}
                  </p>

                  {booking.notes && (
                    <div className="booking-notes">
                      <h4>Notes</h4>
                      <p>{booking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status === "pending" && (
                    <>
                      <button
                        className="confirm-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" && (
                    <>
                      <button
                        className="complete-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id, "completed")
                        }
                      >
                        Mark as Completed
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {(booking.status === "completed" ||
                    booking.status === "cancelled") && (
                    <p className="no-actions">No actions available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <p>No {activeTab} bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
