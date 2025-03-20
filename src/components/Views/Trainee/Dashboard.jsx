// components/Views/Trainee/Dashboard.jsx
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Your FitForge Dashboard</h1>
      <p>Track your fitness journey, access workouts, and monitor your progress.</p>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Your Profile</h3>
          <p>View and edit your personal information</p>
          <Link to="/profile" className="dashboard-link">Go to Profile</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>Workouts</h3>
          <p>Access your workout plans and exercises</p>
          <a href="#" className="dashboard-link">View Workouts</a>
        </div>
        
        <div className="dashboard-card">
          <h3>Progress</h3>
          <p>Track your fitness achievements and goals</p>
          <a href="#" className="dashboard-link">Check Progress</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;