import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTrophy,
  faQuoteLeft,
  faStar,
  faUsers,
  faCheckCircle,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import "./YourTrainer.css";

// Sample trainer data (in a real app, this would come from an API)
const trainerData = {
  id: 1,
  name: "Alex Johnson",
  avatar:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  credentials: "Certified Personal Trainer, Nutrition Specialist",
  yearsExperience: 8,
  clientsHelped: 120,
  rating: 4.9,
  bio: "As a dedicated fitness professional with over 8 years of experience, I specialize in strength training, weight management, and sports-specific conditioning. My approach combines scientific principles with practical, sustainable fitness strategies tailored to your unique goals and lifestyle.",
  specialties: [
    "Strength Training",
    "Weight Loss",
    "Nutrition Planning",
    "HIIT",
    "Functional Training",
    "Sports Conditioning",
  ],
  upcomingSessions: [
    {
      id: 1,
      date: "2023-09-15T10:00:00",
      type: "Strength Training",
      duration: 60,
    },
    {
      id: 2,
      date: "2023-09-18T14:30:00",
      type: "Cardio & Mobility",
      duration: 45,
    },
  ],
  achievements: [
    {
      id: 1,
      title: "Completed 4 weeks of strength training",
      date: "2023-08-30",
    },
    {
      id: 2,
      title: "Reached target weight goal",
      date: "2023-08-15",
    },
    {
      id: 3,
      title: "Improved mile run time by 15%",
      date: "2023-07-28",
    },
  ],
  testimonials: [
    {
      id: 1,
      text: "Alex has been instrumental in helping me achieve my fitness goals. His personalized approach and constant motivation kept me going even when I wanted to give up.",
      author: "Michael P.",
    },
    {
      id: 2,
      text: "I've tried many trainers before, but Alex truly understands how to balance pushing you while keeping workouts enjoyable. I've seen amazing results in just 3 months!",
      author: "Sarah T.",
    },
  ],
};

const YourTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setTrainer(trainerData);
      setLoading(false);
    }, 500);
  }, []);

  // Format date for upcoming sessions
  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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

  return (
    <div className="trainer-page">
      <div className="trainer-page-header">
        <h1>Your Trainer</h1>
        <p>View your assigned trainer's profile and upcoming sessions</p>
      </div>

      {trainer ? (
        <>
          <div className="trainer-profile-card">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="trainer-avatar"
            />
            <div className="trainer-info">
              <h2 className="trainer-name">{trainer.name}</h2>
              <p className="trainer-credentials">{trainer.credentials}</p>

              <div className="trainer-stats">
                <div className="stat">
                  <span className="stat-value">{trainer.yearsExperience}</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{trainer.clientsHelped}+</span>
                  <span className="stat-label">Clients</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{trainer.rating}</span>
                  <span className="stat-label">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD700" }}
                    />
                  </span>
                </div>
              </div>

              <p className="trainer-bio">{trainer.bio}</p>

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
                <button className="contact-trainer-btn">Message Trainer</button>
                <button className="view-schedule-btn">
                  View Full Schedule
                </button>
              </div>
            </div>
          </div>

          <div className="trainer-sections">
            <div className="trainer-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarAlt} /> Upcoming Sessions
              </h3>

              {trainer.upcomingSessions.length > 0 ? (
                trainer.upcomingSessions.map((session) => {
                  const { day, time } = formatSessionDate(session.date);
                  return (
                    <div key={session.id} className="upcoming-session">
                      <div>
                        <div className="session-time">
                          {day} at {time}
                        </div>
                        <div className="session-detail">
                          {session.type} ({session.duration} min)
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

              {trainer.achievements.map((achievement) => (
                <div key={achievement.id} className="achievement">
                  <div className="achievement-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <div className="achievement-text">{achievement.title}</div>
                    <div className="achievement-date">
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              <h3 className="section-title" style={{ marginTop: "30px" }}>
                <FontAwesomeIcon icon={faQuoteLeft} /> Client Testimonials
              </h3>

              {trainer.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <p className="testimonial-author">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="placeholder-page">
          <h1>No Trainer Assigned</h1>
          <p>You don't have a trainer assigned to your account yet.</p>
          <button className="contact-trainer-btn">Find a Trainer</button>
        </div>
      )}
    </div>
  );
};

export default YourTrainer;
