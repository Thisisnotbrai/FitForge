import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ExerciseScreen from "./ExerciseScreen";
import RestTimer from "./RestTimer";
import WorkoutComplete from "./WorkoutComplete";
import "./Workout.css";
import "./ActiveWorkout.css";

const ActiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/workouts/workouts/${id}`
        );
        setWorkout(response.data);
        setLoading(false);
        setWorkoutStartTime(new Date());
      } catch (error) {
        console.error("Error fetching workout details:", error);
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [id]);

  // Update workout duration every minute
  useEffect(() => {
    if (!workoutStartTime || workoutComplete) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date() - workoutStartTime) / 60000);
      setWorkoutDuration(elapsed);
    }, 60000);

    return () => clearInterval(interval);
  }, [workoutStartTime, workoutComplete]);

  const handleExerciseComplete = () => {
    const nextExerciseIndex = currentExerciseIndex + 1;

    if (nextExerciseIndex < workout.exercises.length) {
      // Get rest time from the current exercise
      const currentExercise = workout.exercises[currentExerciseIndex];
      const restSeconds = currentExercise.rest_between || 60;

      setRestTime(restSeconds);
      setIsResting(true);
    } else {
      // All exercises completed
      const completionTime = new Date() - workoutStartTime;
      const minutes = Math.floor(completionTime / 60000);

      // Record workout completed if needed
      try {
        axios
          .post("http://localhost:3000/workouts/workout-history", {
            workoutId: workout.id,
            completionTime: minutes || workoutDuration, // Use tracked duration as fallback
            date: new Date().toISOString(),
          })
          .catch((error) =>
            console.error("Error saving workout history:", error)
          );
      } catch (error) {
        console.error("Error saving workout history:", error);
      }

      setWorkoutComplete(true);
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
  };

  const handleFinishWorkout = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading-container">Loading workout...</div>;
  }

  if (!workout) {
    return <div className="error-container">Workout not found</div>;
  }

  if (workoutComplete) {
    return (
      <WorkoutComplete
        workout={{
          ...workout,
          workout_duration: workoutDuration, // Pass tracked duration to completion screen
        }}
        onFinish={handleFinishWorkout}
      />
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = (
    (currentExerciseIndex / workout.exercises.length) *
    100
  ).toFixed(0);

  return (
    <div className="active-workout-container">
      <div className="workout-progress">
        <h3>{workout.workout_name}</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {currentExerciseIndex + 1} of {workout.exercises.length} exercises (
          {progress}% complete)
          {workoutDuration > 0 && (
            <span className="workout-time">{workoutDuration} min</span>
          )}
        </div>
      </div>

      {isResting ? (
        <RestTimer
          seconds={restTime}
          nextExercise={
            workout.exercises[currentExerciseIndex + 1].exercise_name
          }
          onComplete={handleRestComplete}
        />
      ) : (
        <ExerciseScreen
          exercise={currentExercise}
          onComplete={handleExerciseComplete}
          exerciseNumber={currentExerciseIndex + 1}
          totalExercises={workout.exercises.length}
        />
      )}
    </div>
  );
};

export default ActiveWorkout;
