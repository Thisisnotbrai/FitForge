import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDumbbell, 
  faRunning, 
  faHeartbeat, 
  faFire, 
  faClock, 
  faCalendarAlt, 
  faCheckCircle, 
  faChevronRight, 
  faFilter,
  faPlus,
  faHistory,
  faStar,
  faUser,
  faChartLine,
  faSignal
} from "@fortawesome/free-solid-svg-icons";
import "./Workout.css";

const Workout = () => {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const workoutCategories = [
    { id: "strength", name: "Strength", icon: faDumbbell, color: "#e74c3c" },
    { id: "cardio", name: "Cardio", icon: faRunning, color: "#3498db" },
    { id: "hiit", name: "HIIT", icon: faHeartbeat, color: "#9b59b6" },
    { id: "flexibility", name: "Flexibility", icon: faFire, color: "#2ecc71" }
  ];

  const recommendedWorkouts = [
    {
      id: 1,
      title: "Full Body Strength",
      category: "strength",
      duration: "45 min",
      calories: "320",
      level: "Intermediate",
      trainer: "Alex Rodriguez",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      exercises: [
        { name: "Barbell Squats", sets: 4, reps: "10-12", rest: "60s" },
        { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
        { name: "Deadlifts", sets: 3, reps: "8", rest: "120s" },
        { name: "Pull-ups", sets: 3, reps: "8-10", rest: "60s" },
        { name: "Shoulder Press", sets: 3, reps: "10", rest: "60s" }
      ]
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      category: "hiit",
      duration: "30 min",
      calories: "450",
      level: "Advanced",
      trainer: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      exercises: [
        { name: "Burpees", sets: 1, reps: "45s work / 15s rest" },
        { name: "Mountain Climbers", sets: 1, reps: "45s work / 15s rest" },
        { name: "Jump Squats", sets: 1, reps: "45s work / 15s rest" },
        { name: "Push-up to Side Plank", sets: 1, reps: "45s work / 15s rest" },
        { name: "Jumping Lunges", sets: 1, reps: "45s work / 15s rest" }
      ]
    },
    {
      id: 3,
      title: "Morning Yoga Flow",
      category: "flexibility",
      duration: "20 min",
      calories: "150",
      level: "Beginner",
      trainer: "Maya Patel",
      image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      exercises: [
        { name: "Sun Salutation", sets: 1, reps: "5 cycles" },
        { name: "Warrior Poses", sets: 1, reps: "30s each side" },
        { name: "Triangle Pose", sets: 1, reps: "30s each side" },
        { name: "Child's Pose", sets: 1, reps: "60s" },
        { name: "Corpse Pose", sets: 1, reps: "120s" }
      ]
    }
  ];

  const myWorkouts = [
    {
      id: 4,
      title: "Upper Body Focus",
      category: "strength",
      duration: "40 min",
      calories: "280",
      level: "Intermediate",
      scheduled: "Mon, Wed, Fri",
      completed: 7,
      totalSessions: 12,
      progress: 58,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 5,
      title: "5K Training Plan",
      category: "cardio",
      duration: "30-60 min",
      calories: "350-500",
      level: "Intermediate",
      scheduled: "Tue, Thu, Sat",
      completed: 4,
      totalSessions: 16,
      progress: 25,
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const historyWorkouts = [
    {
      id: 6,
      title: "Morning HIIT",
      category: "hiit",
      duration: "25 min",
      calories: "380",
      completedOn: "Today, 6:30 AM",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 7,
      title: "Leg Day",
      category: "strength",
      duration: "55 min",
      calories: "420",
      completedOn: "Yesterday, 5:45 PM",
      image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const filteredWorkouts = selectedCategory 
    ? recommendedWorkouts.filter(workout => workout.category === selectedCategory)
    : recommendedWorkouts;

  const renderWorkoutCard = (workout) => (
    <div className="workout-card" key={workout.id}>
      <div 
        className="workout-card-image" 
        style={{ backgroundImage: `url(${workout.image})` }}
        aria-label={`${workout.title} workout image`}
      >
        <span className="workout-category">
          {workoutCategories.find(cat => cat.id === workout.category)?.name || workout.category}
        </span>
        {workout.completedOn && <div className="workout-completed-badge">Completed</div>}
      </div>
      <div className="workout-card-content">
        <h3>{workout.title}</h3>
        <div className="workout-meta">
          <span><FontAwesomeIcon icon={faClock} /> {workout.duration}</span>
          <span><FontAwesomeIcon icon={faFire} /> {workout.calories} cal</span>
          <span><FontAwesomeIcon icon={faSignal} /> {workout.level}</span>
        </div>
        {workout.trainer && (
          <div className="workout-trainer">
            <FontAwesomeIcon icon={faUser} /> <span>Trainer: {workout.trainer}</span>
          </div>
        )}
        {workout.scheduled && (
          <div className="workout-schedule">
            <FontAwesomeIcon icon={faCalendarAlt} /> <span>{workout.scheduled}</span>
          </div>
        )}
        {workout.completedOn && (
          <div className="workout-completed-on">
            <FontAwesomeIcon icon={faHistory} /> <span>{workout.completedOn}</span>
          </div>
        )}
        {workout.progress !== undefined && (
          <div className="workout-progress">
            <div className="progress-label">
              <span>Progress</span>
              <span>{workout.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${workout.progress}%` }}></div>
            </div>
            <span className="progress-text">
              <FontAwesomeIcon icon={faCheckCircle} /> {workout.completed}/{workout.totalSessions} completed
            </span>
          </div>
        )}
        <button className="workout-action-btn" aria-label={`${workout.exercises ? 'Start' : 'Continue'} ${workout.title} workout`}>
          {workout.exercises ? "Start Workout" : "Continue Plan"} <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );

  const renderWorkoutDetails = (workout) => (
    <div className="workout-details">
      <h4>Exercises <span className="exercise-count">{workout.exercises.length}</span></h4>
      <div className="exercise-list">
        {workout.exercises.map((exercise, index) => (
          <div className="exercise-item" key={index}>
            <span className="exercise-number">{index + 1}</span>
            <div className="exercise-info">
              <h5>{exercise.name}</h5>
              <div className="exercise-meta">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps}</span>
                {exercise.rest && <span>Rest: {exercise.rest}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="workout-container">
      <div className="workout-header">
        <h1>Your Workouts</h1>
        <div className="workout-actions">
          <button className="filter-btn" aria-label="Filter workouts">
            <FontAwesomeIcon icon={faFilter} /> Filter
          </button>
          <button className="create-btn" aria-label="Create new workout">
            <FontAwesomeIcon icon={faPlus} /> Create Workout
          </button>
        </div>
      </div>

      <div className="workout-categories" role="group" aria-label="Workout Categories">
        <div 
          className={`category-item all-categories ${selectedCategory === null ? 'active' : ''}`} 
          onClick={() => setSelectedCategory(null)}
          role="button"
          aria-pressed={selectedCategory === null}
          tabIndex="0"
          onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(null)}
        >
          <FontAwesomeIcon icon={faStar} />
          <span>All</span>
        </div>
        {workoutCategories.map(category => (
          <div 
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`} 
            key={category.id} 
            style={{ backgroundColor: category.color }}
            onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
            role="button"
            aria-pressed={selectedCategory === category.id}
            tabIndex="0"
            onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(category.id === selectedCategory ? null : category.id)}
          >
            <FontAwesomeIcon icon={category.icon} />
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      <div className="workout-tabs" role="tablist">
        <button 
          className={`tab-btn ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
          role="tab"
          aria-selected={activeTab === 'recommended'}
          id="tab-recommended"
          aria-controls="panel-recommended"
        >
          <FontAwesomeIcon icon={faStar} /> Recommended
        </button>
        <button 
          className={`tab-btn ${activeTab === 'my-workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-workouts')}
          role="tab"
          aria-selected={activeTab === 'my-workouts'}
          id="tab-my-workouts"
          aria-controls="panel-my-workouts"
        >
          <FontAwesomeIcon icon={faChartLine} /> My Workouts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          role="tab"
          aria-selected={activeTab === 'history'}
          id="tab-history"
          aria-controls="panel-history"
        >
          <FontAwesomeIcon icon={faHistory} /> History
        </button>
      </div>

      <div className="workout-content">
        {activeTab === 'recommended' && (
          <div 
            className="recommended-workouts"
            role="tabpanel"
            id="panel-recommended"
            aria-labelledby="tab-recommended"
          >
            <h2>Recommended for You <span className="workout-count">{filteredWorkouts.length}</span></h2>
            {filteredWorkouts.length > 0 ? (
              <div className="workout-grid">
                {filteredWorkouts.map(workout => (
                  <div className="workout-item" key={workout.id}>
                    {renderWorkoutCard(workout)}
                    {renderWorkoutDetails(workout)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No workouts found in this category.</p>
                <button className="action-btn" onClick={() => setSelectedCategory(null)}>Show All Workouts</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-workouts' && (
          <div 
            className="my-workouts"
            role="tabpanel"
            id="panel-my-workouts"
            aria-labelledby="tab-my-workouts"
          >
            <h2>Your Active Workout Plans <span className="workout-count">{myWorkouts.length}</span></h2>
            {myWorkouts.length > 0 ? (
              <div className="workout-grid">
                {myWorkouts.map(workout => (
                  <div className="workout-item" key={workout.id}>
                    {renderWorkoutCard(workout)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You don't have any active workout plans.</p>
                <button className="action-btn" onClick={() => setActiveTab('recommended')}>Explore Recommended Workouts</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div 
            className="workout-history"
            role="tabpanel"
            id="panel-history"
            aria-labelledby="tab-history"
          >
            <h2>Recent Workouts <span className="workout-count">{historyWorkouts.length}</span></h2>
            {historyWorkouts.length > 0 ? (
              <div className="workout-grid">
                {historyWorkouts.map(workout => (
                  <div className="workout-item" key={workout.id}>
                    {renderWorkoutCard(workout)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="history-empty">
                <p>You haven't completed any workouts yet.</p>
                <p>Start with one of our recommended workouts today!</p>
                <button className="start-btn" onClick={() => setActiveTab('recommended')}>
                  Browse Workouts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout; 