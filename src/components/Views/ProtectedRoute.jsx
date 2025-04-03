import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const location = useLocation();
  console.log("Current path in ProtectedRoute:", location.pathname);
  console.log("Token in ProtectedRoute:", token);
  
  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  // Check if user data exists and is valid
  if (!userString) {
    console.log("No user data found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
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
  
  // If we have a token and user is either verified or no user data exists, render the route
  return <Outlet />;
};

export default ProtectedRoute;
