import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../../WorkoutModal";
import "./Workout.css";

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/workouts/workouts/${id}`
        );
        setWorkout(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workout details:", error);
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [id]);

  const handleStartWorkout = () => {
    setShowModal(true);
  };

  const confirmStartWorkout = () => {
    setShowModal(false);
    navigate(`/workout/${id}/active`);
  };

  if (loading)
    return <div className="loading-container">Loading workout details...</div>;
  if (!workout) return <div className="error-container">Workout not found</div>;

  return (
    <div className="workout-detail">
      <div className="workout-header">
        <div className="workout-tag">{workout.workout_type}</div>
        <h2>{workout.workout_name}</h2>
        <div className="workout-specs">
          <span>{workout.workout_duration} min</span>
          <span>{workout.workout_calories} cal</span>
          <span>{workout.workout_level}</span>
        </div>
      </div>

      <div className="exercises-section">
        <h3>Exercises ({workout.exercises.length})</h3>
        <div className="exercise-list">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="exercise-item">
              <div className="exercise-number">{index + 1}</div>
              <div className="exercise-info">
                <h4>{exercise.exercise_name}</h4>
                <div className="exercise-details">
                  <span>{exercise.sets} sets</span>
                  <span>
                    {exercise.reps ||
                      `${exercise.work_time} work / ${exercise.rest_time} rest`}
                  </span>
                  {exercise.restBetween && (
                    <span>Rest: {exercise.restBetween}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-start-workout" onClick={handleStartWorkout}>
        Start Workout
      </button>

      {showModal && (
        <Modal
          message={`Are you ready to start this workout?`}
          confirmText="START WORKOUT"
          cancelText="Cancel"
          onConfirm={confirmStartWorkout}
          onCancel={() => setShowModal(false)}
          workout={workout}
        />
      )}
    </div>
  );
};

export default WorkoutDetail;
