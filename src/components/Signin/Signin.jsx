import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import login from "../../assets/Loginlogo.jpg";
import logo from "../../assets/FitForge Logo.jpg";
import "./Signin.css";

const Signin = () => {
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        user_email,
        user_password,
      });

      console.log("Backend response:", response.data); // Debugging

      if (response.data.data) {
        // Correctly extract the token and user info
        const token = response.data.data; // This is the actual token
        const user = response.data.message.User; // This is the user object

        // Debugging: Log the user object to verify its structure
        console.log("User object:", user);

        // Save token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Token and user info saved:", token, user); // Debugging

        alert("Login successful!");

        // Check user role and navigate accordingly
        if (user?.role === "trainee") {
          console.log("Navigating to /Dashboard");
          navigate("/Dashboard", { replace: true }); // Ensure navigation
        } else if (user?.role === "trainer") {
          console.log("Navigating to /TrainerDashboard");
          navigate("/TrainerDashboard", { replace: true });
        } else {
          setError("Unknown user role");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      <img className="login-hero" src={login} alt="" />

      <div className="login-section">
        <div className="form-container">
          <div className="Logo-container">
            <img className="Logo" src={logo} alt="Logo" />
            <h2>
              <span className="fit-text">Fit</span>
              <span className="forge-text">Forge</span>
            </h2>
          </div>
          <h1 className="form-title">Sign in</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="Enter your email"
                value={user_email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter your password"
                value={user_password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
          <p className="signup-text">Don&apos;t have an account? Sign Up</p>
        </div>
      </div>
    </>
  );
};

export default Signin;
