import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTrophy,
  faQuoteLeft,
  faCheckCircle,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./YourTrainer.css";

const YourTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const [partnership, setPartnership] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data, partnership, and trainer data
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true);

        // Get authentication token and user from localStorage (matching your auth pattern)
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

        // Verify user is a trainee
        const userRole = user.role || user.user_role;
        if (userRole !== "trainee") {
          throw new Error("This page is for trainees only");
        }

        // Fetch partnerships for this trainee using API with authentication
        const partnershipResponse = await axios.get(
          `http://localhost:3000/partnership/trainee/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Find active partnership (if any)
        const activePartnership = partnershipResponse.data.find(
          (p) => p.status === "active"
        );

        if (activePartnership) {
          setPartnership(activePartnership);

          // If we have an active partnership, get trainer info from the partnership
          const trainerInfo = activePartnership.trainer;

          // Fetch upcoming bookings with this trainer
          const bookingsResponse = await axios.get(
            `http://localhost:3000/booking/trainee/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Filter to only include bookings with this trainer and with future dates
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcomingBookings = bookingsResponse.data.filter((booking) => {
            const bookingDate = new Date(booking.date);
            bookingDate.setHours(0, 0, 0, 0);
            return (
              booking.trainer_id === trainerInfo.id &&
              bookingDate >= today &&
              (booking.status === "confirmed" || booking.status === "pending")
            );
          });

          setBookings(upcomingBookings);

          // Set mock achievements for now (this would come from a real endpoint in production)
          setAchievements([
            {
              id: 1,
              title: "Completed 4 weeks of strength training",
              date: new Date(
                today.getTime() - 15 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              id: 2,
              title: "Reached target weight goal",
              date: new Date(
                today.getTime() - 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ]);

          // Convert trainer data to match the format your component expects
          setTrainer({
            id: trainerInfo.id,
            name: trainerInfo.user_name,
            credentials: trainerInfo.trainerInfo
              ? `${trainerInfo.trainerInfo.specialization} Specialist`
              : "Certified Personal Trainer",
            specialties: trainerInfo.trainerInfo
              ? [trainerInfo.trainerInfo.specialization]
              : ["Strength Training", "Cardio", "Nutrition"],
            testimonials: [
              {
                id: 1,
                text: "An excellent trainer who really understands how to motivate clients and design effective workout plans.",
                author: "Michael P.",
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching trainer data:", err);
        setError(
          "Failed to load your trainer information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  // Handle partnership status change
  const handlePartnershipStatusChange = async (newStatus) => {
    try {
      // Get authentication token (same as used in useEffect)
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      console.log(
        `Updating partnership ${partnership.id} to status: ${newStatus}`
      );

      // Make the API call to update partnership status
      await axios.put(
        `http://localhost:3000/partnership/${partnership.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`Successfully updated partnership to ${newStatus}`);

      // If partnership is terminated, remove the trainer
      if (newStatus === "terminated") {
        setTrainer(null);
        setPartnership(null);
      } else if (newStatus === "paused" || newStatus === "active") {
        // Update partnership status locally for both pause and resume cases
        setPartnership({
          ...partnership,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error("Error updating partnership status:", err);
      console.error(
        "Error details:",
        err.response ? err.response.data : "No response data"
      );
      console.error(
        "Request URL:",
        err.config ? err.config.url : "Unknown URL"
      );
      setError(
        "Failed to update trainer relationship status. Please try again."
      );
    }
  };

  // Format session date and time from start_date and end_date
  const formatSessionDate = (dateString, startDateString, endDateString) => {
    const date = new Date(dateString);
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: `${startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };
  };

  if (loading) {
    return (
      <div className="trainer-page">
        <div className="trainer-page-header">
          <h1>Your Trainer</h1>
          <p>Loading trainer information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainer-page">
        <div className="trainer-page-header">
          <h1>Your Trainer</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-page">
      <div className="trainer-page-header">
        <h1>Your Trainer</h1>
        <p>View your assigned trainer&apos;s profile and upcoming sessions</p>
      </div>

      {trainer && partnership && partnership.status === "active" ? (
        <>
          <div className="trainer-profile-card">
            <div className="trainer-info">
              <h2 className="trainer-name">{trainer.name}</h2>
              <p className="trainer-credentials">{trainer.credentials}</p>

              <div className="trainer-specialties">
                <h3 className="specialties-title">Specialties</h3>
                <div className="specialty-tags">
                  {trainer.specialties.map((specialty, index) => (
                    <span key={index} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="trainer-buttons">
                <button
                  className="pause-partnership-btn"
                  onClick={() => handlePartnershipStatusChange("paused")}
                >
                  Pause Partnership
                </button>
                <button
                  className="terminate-partnership-btn"
                  onClick={() => handlePartnershipStatusChange("terminated")}
                >
                  End Partnership
                </button>
              </div>
            </div>
          </div>

          <div className="trainer-sections">
            <div className="trainer-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarAlt} /> Upcoming Sessions
              </h3>

              {bookings && bookings.length > 0 ? (
                bookings.map((session) => {
                  const { day, time } = formatSessionDate(
                    session.date,
                    session.start_date,
                    session.end_date
                  );
                  return (
                    <div key={session.id} className="upcoming-session">
                      <div>
                        <div className="session-time">
                          {day} at {time}
                        </div>
                        <div className="session-detail">
                          {session.type || "Training Session"} (
                          {Math.round(
                            (new Date(session.end_date) -
                              new Date(session.start_date)) /
                              60000
                          )}{" "}
                          min)
                        </div>
                      </div>
                      <button className="session-action">Join</button>
                    </div>
                  );
                })
              ) : (
                <p>
                  No upcoming sessions scheduled. Contact your trainer to set up
                  your next workout.
                </p>
              )}

              <div className="trainer-section">
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faDumbbell} /> Recommended Workouts
                </h3>
                <div className="upcoming-session">
                  <div>
                    <div className="session-time">Full Body Strength</div>
                    <div className="session-detail">45 min • Intermediate</div>
                  </div>
                  <button className="session-action">Start</button>
                </div>
                <div className="upcoming-session">
                  <div>
                    <div className="session-time">HIIT Cardio Blast</div>
                    <div className="session-detail">
                      30 min • Beginner-Friendly
                    </div>
                  </div>
                  <button className="session-action">Start</button>
                </div>
              </div>
            </div>

            <div className="trainer-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faTrophy} /> Your Achievements
              </h3>

              {achievements && achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement">
                    <div className="achievement-icon">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <div className="achievement-text">
                        {achievement.title}
                      </div>
                      <div className="achievement-date">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  No achievements recorded yet. Keep working with your trainer!
                </p>
              )}

              <h3 className="section-title" style={{ marginTop: "30px" }}>
                <FontAwesomeIcon icon={faQuoteLeft} /> Client Testimonials
              </h3>

              {trainer.testimonials && trainer.testimonials.length > 0 ? (
                trainer.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial">
                    <p className="testimonial-text">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <p className="testimonial-author">— {testimonial.author}</p>
                  </div>
                ))
              ) : (
                <p>No testimonials available yet.</p>
              )}
            </div>
          </div>
        </>
      ) : partnership && partnership.status === "paused" ? (
        <div className="paused-partnership">
          <h2>Partnership Paused</h2>
          <p>
            Your partnership with {trainer ? trainer.name : "your trainer"} is
            currently paused.
          </p>
          <button
            className="resume-partnership-btn"
            onClick={() => handlePartnershipStatusChange("active")}
          >
            Resume Partnership
          </button>
        </div>
      ) : (
        <div className="placeholder-page">
          <h1>No Trainer Assigned</h1>
          <p>You don&apos;t have a trainer assigned to your account yet.</p>
          <button className="contact-trainer-btn">Find a Trainer</button>
        </div>
      )}
    </div>
  );
};

export default YourTrainer;
