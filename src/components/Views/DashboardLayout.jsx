// components/Views/DashboardLayout.jsx
import { Outlet, useNavigate, Link } from "react-router-dom";
import "./DashboardLayout.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Dashboard from "./Trainee/Dashboard"; // Import the Dashboard component
import ChatbotWidget from "../Chatbot/ChatbotWidget"; // Import the ChatbotWidget

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the landing page
    navigate("/");
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="FitForge Logo" className="logo-icon" />
          <span>
            <span className="fit">Fit</span>
            <span className="forge">Forge</span>
          </span>
        </div>

        <nav className="nav">
          <a href="#">Products</a>
          <a href="#about">Get Started</a>
          <a href="#FAQ">FAQs</a>
          <a href="#features">Our Team</a>
          <a href="#contact-us">Contact Us</a>
          <Link to="/profile" className="profile-link">
            <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
          <button onClick={handleLogout}>Logout</button>
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
