import PropTypes from "prop-types"; // Import PropTypes
import "./Workout.css";

const WorkoutComplete = ({ workout, onFinish }) => {
  return (
    <div className="workout-complete">
      <div className="completion-icon">✓</div>
      <h2>Workout Complete!</h2>
      <div className="completion-details">
        <div>
          You completed: <strong>{workout.workout_name}</strong>
        </div>
        <div>{workout.exercises.length} exercises</div>
        <div>{workout.workout_calories} calories burned</div>
      </div>
      <button className="btn-finish" onClick={onFinish}>
        Back to Dashboard
      </button>
    </div>
  );
};

// Define PropTypes for validation
WorkoutComplete.propTypes = {
  workout: PropTypes.shape({
    workout_name: PropTypes.string.isRequired,
    exercises: PropTypes.arrayOf(PropTypes.object).isRequired, // Assuming each exercise is an object
    workout_calories: PropTypes.number.isRequired,
  }).isRequired,
  onFinish: PropTypes.func.isRequired, // Function that must be provided
};

export default WorkoutComplete;
