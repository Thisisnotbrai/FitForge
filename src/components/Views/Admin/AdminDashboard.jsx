import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPendingTrainers();
  }, []);

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

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      
      <div className="admin-section">
        <h2 className="admin-section-title">Pending Trainer Approvals</h2>
        
        {successMessage && (
          <div className="admin-success-message">{successMessage}</div>
        )}
        
        {error && <div className="admin-error-message">{error}</div>}
        
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : pendingTrainers.length === 0 ? (
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
      </div>
    </div>
  );
};

export default AdminDashboard;
