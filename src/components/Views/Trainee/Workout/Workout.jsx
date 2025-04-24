import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Workout/Workout.css";

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

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

  // Get unique workout types for categories
  const categories =
    workouts.length > 0
      ? [
          "all",
          ...new Set(
            workouts.map((workout) => workout.workout_type.toLowerCase())
          ),
        ]
      : ["all"];

  // Filter workouts by active category
  const filteredWorkouts =
    activeCategory === "all"
      ? workouts
      : workouts.filter(
          (workout) => workout.workout_type.toLowerCase() === activeCategory
        );

  if (loading)
    return <div className="loading-container">Loading workouts...</div>;

  return (
    <div className="workout-dashboard">
      {/* Hero Section */}
      <div className="workout-hero">
        <div className="hero-content">
          <h1>Find Your Perfect Workout</h1>
          <p>
            Customized training programs to help you reach your fitness goals
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="workout-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Featured Workouts Section */}
      <section className="featured-workouts">
        <div className="section-header">
          <h2>Featured Workouts</h2>
          <Link to="/workouts" className="view-all-link">
            View All
          </Link>
        </div>

        {filteredWorkouts.length > 0 ? (
          <div className="workout-grid">
            {filteredWorkouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-card-header">
                  <div className="workout-tag">{workout.workout_type}</div>
                  <div className="workout-level">{workout.workout_level}</div>
                </div>
                <h3>{workout.workout_name}</h3>
                <div className="workout-stats">
                  <div className="stat">
                    <span className="stat-value">
                      {workout.workout_duration}
                    </span>
                    <span className="stat-label">minutes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {workout.workout_calories}
                    </span>
                    <span className="stat-label">calories</span>
                  </div>
                </div>
                <Link to={`/workout/${workout.id}`} className="btn-primary">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-workouts">
            <p>No workouts found in this category.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="btn-reset"
            >
              Show All Workouts
            </button>
          </div>
        )}
      </section>

      {/* Recent Workouts Section (if you have workout history) */}
      <section className="recent-workouts">
        <div className="section-header">
          <h2>Continue Your Progress</h2>
        </div>
        <div className="cta-card">
          <div className="cta-content">
            <h3>Ready for your next workout?</h3>
            <p>
              Track your progress and stay motivated with our personalized
              workout plans.
            </p>
          </div>
          <Link to="/workouts" className="btn-cta">
            Explore All Workouts
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Workout;
