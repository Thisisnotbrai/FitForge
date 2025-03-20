import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  console.log("Token in ProtectedRoute:", token); // Debugging
  
  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  // Check if user is verified, but only if we have user data
  if (userString) {
    try {
      const user = JSON.parse(userString);
      console.log("User verification status in ProtectedRoute:", user.is_verified);
      
      // Only redirect if explicitly false (not undefined, null, etc.)
      if (user.is_verified === false) {
        // Store email for verification page
        localStorage.setItem("pendingVerificationEmail", user.email);
        console.log("User not verified, redirecting to verify page");
        return <Navigate to="/verify" state={{ email: user.email }} />;
      }
    } catch (error) {
      console.error("Error parsing user data in ProtectedRoute:", error);
      // In case of error, continue to render the protected route
    }
  }
  
  // If we have a token and user is either verified or no user data exists, render the route
  return <Outlet />;
};

export default ProtectedRoute;
