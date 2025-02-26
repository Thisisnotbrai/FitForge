// components/Views/DashboardLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the landing page
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard Sidebar</h2>
        <ul>
          <li>Home</li>
          <li>Profile</li>
          <li>Settings</li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet /> {/* This will render the nested route (e.g., Dashboard) */}
      </div>
    </div>
  );
};

export default DashboardLayout;
