import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./RestTimer.css";

const RestTimer = ({ seconds, nextExercise, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  // Format time to display minutes and seconds if needed
  const formatTime = (time) => {
    if (time < 60) return `${time}`;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Calculate progress percentage for the circular progress
  const calculateProgress = () => {
    return ((seconds - timeLeft) / seconds) * 100;
  };

  return (
    <div className="rest-timer-container">
      <div className="rest-timer-header">
        <h2>REST TIME</h2>
        <p>
          Get ready for <strong>{nextExercise}</strong>
        </p>
      </div>

      <div className="rest-timer">
        <div
          className="rest-timer-progress"
          style={{
            background: `conic-gradient(
              #3498db ${calculateProgress()}%, 
              #ecf0f1 ${calculateProgress()}% 100%
            )`,
          }}
        >
          <div className="rest-timer-display">
            <div className="timer-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="#3498db"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className={`timer-text ${isAnimating ? "pulse" : ""}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-label">seconds</div>
          </div>
        </div>
      </div>

      <div className="next-exercise-preview">
        <div className="preview-label">COMING UP NEXT</div>
        <div className="preview-exercise">{nextExercise}</div>
      </div>

      <button onClick={onComplete} className="skip-rest-btn">
        <span>Skip Rest</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
};

// Define PropTypes for validation
RestTimer.propTypes = {
  seconds: PropTypes.number.isRequired, // Must be a number and required
  nextExercise: PropTypes.string.isRequired, // Must be a string and required
  onComplete: PropTypes.func.isRequired, // Must be a function and required
};

export default RestTimer;
