import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  console.log("Token in ProtectedRoute:", token); // Debugging
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is verified
  if (userString) {
    const user = JSON.parse(userString);
    console.log("User verification status in ProtectedRoute:", user.is_verified);
    // Only redirect if explicitly false (not undefined, null, etc.)
    if (user.is_verified === false) {
      // Store email for verification page
      localStorage.setItem("pendingVerificationEmail", user.email);
      return <Navigate to="/verify" state={{ email: user.email }} />;
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
