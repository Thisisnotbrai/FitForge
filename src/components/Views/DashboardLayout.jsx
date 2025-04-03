// components/Views/DashboardLayout.jsx
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import "./DashboardLayout.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome, faUserTie, faHandshake, faChartLine, faSignOutAlt, faDumbbell, faAppleAlt } from "@fortawesome/free-solid-svg-icons";
import Dashboard from "./Trainee/Dashboard"; // Import the Dashboard component
import ChatbotWidget from "../Chatbot/ChatbotWidget"; // Import the ChatbotWidget

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");

    // Redirect to the landing page
    navigate("/");
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo" onClick={() => navigate("/Dashboard")}>
          <img src={logo} alt="FitForge Logo" className="logo-icon" />
          <span>
            <span className="fit">Fit</span>
            <span className="forge">Forge</span>
          </span>
        </div>

        <nav className="nav">
          <Link 
            to="/Dashboard" 
            className={`nav-link ${isActive('/Dashboard') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faHome} /> <span>Home</span>
          </Link>
          <Link 
            to="/your-trainer" 
            className={`nav-link ${isActive('/your-trainer') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faUserTie} /> <span>Your Trainer</span>
          </Link>
          <Link 
            to="/hire" 
            className={`nav-link ${isActive('/hire') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faHandshake} /> <span>Hire</span>
          </Link>
          <Link 
            to="/workout" 
            className={`nav-link ${isActive('/workout') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faDumbbell} /> <span>Workout</span>
          </Link>
          <Link 
            to="/nutrition" 
            className={`nav-link ${isActive('/nutrition') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faAppleAlt} /> <span>Nutrition</span>
          </Link>
          <Link 
            to="/progress" 
            className={`nav-link ${isActive('/progress') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faChartLine} /> <span>Progress</span>
          </Link>
          <Link 
            to="/profile" 
            className={`profile-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faUser} /> <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </button>
        </nav>
      </header>
      <div className="dashboard-content">
        <Outlet /> {/* This allows nested routes to render their content here */}
      </div>
      <ChatbotWidget /> {/* Add the ChatbotWidget component */}
    </div>
  );
};

export default DashboardLayout;
