import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingTrainers();
    fetchTrainers();
    fetchTrainees();
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Navigate to admin login page
    navigate("/admin/login");
  };

  const fetchPendingTrainers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        "http://localhost:3000/users/pending-trainers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setPendingTrainers(response.data.data);
      } else {
        setPendingTrainers([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending trainers:", err);
      setError(
        err.response?.data?.message || "Failed to fetch pending trainers"
      );
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await axios.get(
        "http://localhost:3000/users/trainers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setTrainers(response.data.data);
      } else {
        setTrainers([]);
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  const fetchTrainees = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await axios.get(
        "http://localhost:3000/users/trainees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setTrainees(response.data.data);
      } else {
        setTrainees([]);
      }
    } catch (err) {
      console.error("Error fetching trainees:", err);
    }
  };

  const approveTrainer = async (trainerId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await axios.put(
        `http://localhost:3000/users/approve/${trainerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setSuccessMessage(`Trainer ${response.data.data.user_name} approved successfully!`);
        // Remove the approved trainer from the list
        setPendingTrainers(
          pendingTrainers.filter((trainer) => trainer.id !== trainerId)
        );
        
        // Refresh the trainers list
        fetchTrainers();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error approving trainer:", err);
      setError(
        err.response?.data?.message || "Failed to approve trainer"
      );
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (loading && activeTab === "pending") {
      return <div className="admin-loading">Loading...</div>;
    }

    switch(activeTab) {
      case "pending":
        return (
          <>
            {pendingTrainers.length === 0 ? (
              <div className="admin-no-data">No pending trainer approvals</div>
            ) : (
              <div className="admin-trainer-list">
                {pendingTrainers.map((trainer) => (
                  <div key={trainer.id} className="admin-trainer-card">
                    <div className="admin-trainer-details">
                      <h3>{trainer.user_name}</h3>
                      <p>{trainer.user_email}</p>
                    </div>
                    <button
                      className="admin-approve-button"
                      onClick={() => approveTrainer(trainer.id)}
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case "trainers":
        return (
          <>
            {trainers.length === 0 ? (
              <div className="admin-no-data">No approved trainers found</div>
            ) : (
              <div className="admin-user-list">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="admin-user-card">
                    <div className="admin-user-details">
                      <h3>{trainer.user_name}</h3>
                      <p>Email: {trainer.user_email}</p>
                      <p className="admin-status-verified">
                        Verification: {trainer.is_verified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case "trainees":
        return (
          <>
            {trainees.length === 0 ? (
              <div className="admin-no-data">No trainees found</div>
            ) : (
              <div className="admin-user-list">
                {trainees.map((trainee) => (
                  <div key={trainee.id} className="admin-user-card">
                    <div className="admin-user-details">
                      <h3>{trainee.user_name}</h3>
                      <p>Email: {trainee.user_email}</p>
                      <p className="admin-status-verified">
                        Verification: {trainee.is_verified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <button className="admin-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {successMessage && (
        <div className="admin-success-message">{successMessage}</div>
      )}
      
      {error && <div className="admin-error-message">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approvals
        </button>
        <button 
          className={`admin-tab-button ${activeTab === "trainers" ? "active" : ""}`}
          onClick={() => setActiveTab("trainers")}
        >
          Trainers
        </button>
        <button 
          className={`admin-tab-button ${activeTab === "trainees" ? "active" : ""}`}
          onClick={() => setActiveTab("trainees")}
        >
          Trainees
        </button>
      </div>
      
      <div className="admin-section">
        <h2 className="admin-section-title">
          {activeTab === "pending" && "Pending Trainer Approvals"}
          {activeTab === "trainers" && "Approved Trainers"}
          {activeTab === "trainees" && "Registered Trainees"}
        </h2>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
