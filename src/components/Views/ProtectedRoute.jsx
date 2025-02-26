import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  console.log("Token in ProtectedRoute:", token); // Debugging
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
