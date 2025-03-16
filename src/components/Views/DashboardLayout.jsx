// components/Views/DashboardLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo
import Dashboard from "./Dashboard"; // Import the Dashboard component
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
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      
      <Dashboard /> {/* Render the Dashboard component here */}
      <ChatbotWidget /> {/* Add the ChatbotWidget component */}
    </div>
  );
};

export default DashboardLayout;
