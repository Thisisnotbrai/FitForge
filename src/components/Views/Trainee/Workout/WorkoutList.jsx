import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Workout.css";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/workouts/workouts"
        );
        setWorkouts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading)
    return <div className="loading-container">Loading workouts...</div>;

  return (
    <div className="workout-list">
      <h2>Available Workouts</h2>
      <div className="workout-grid">
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <div className="workout-tag">{workout.workout_type}</div>
            <h3>{workout.workout_name}</h3>
            <div className="workout-details">
              <span>{workout.workout_duration} min</span>
              <span>{workout.workout_calories} cal</span>
              <span>{workout.workout_level}</span>
            </div>

            <Link to={`/workout/${workout.id}`} className="btn-primary">
              View Workout
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;
