import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/LandingPage/Header";
import Hero from "./components/LandingPage/Hero";
import About from "./components/LandingPage/About";
import Services from "./components/LandingPage/Services";
import FAQ from "./components/LandingPage/FAQ";
import Features from "./components/LandingPage/Features";
import Footer from "./components/LandingPage/Footer";
import BackToTopButton from "./components/LandingPage/BackToTopButton";
import Dashboard from "./components/Views/Trainee/Dashboard";
import TrainerDashboard from "./components/Views/Trainer/TrainerDashboard"; // Import the TrainerDashboard
import UserProfile from "./components/Views/Trainee/UserProfile"; // Import the UserProfile component
import ProtectedRoute from "./components/Views/ProtectedRoute";
import AdminProtectedRoute from "./components/Views/AdminProtectedRoute"; // Import the AdminProtectedRoute
import AdminSignin from "./components/Views/Admin/AdminSignin"; // Import the AdminSignin component
import AdminDashboard from "./components/Views/Admin/AdminDashboard"; // Import the AdminDashboard component
import DashboardLayout from "./components/Views/DashboardLayout"; // Import the layout
import Signup from "./components/Signup/Signup"; // Import Signup component
import VerificationTab from "./components/Signup/VerificationTab"; // Import VerificationTab component
import Signin from "./components/Signin/Signin"; // Import Signin component
// Import the actual component files
import YourTrainer from "./components/Views/Trainee/YourTrainer";
import Hire from "./components/Views/Trainee/Hire";
import Progress from "./components/Views/Trainee/Progress";
import Workout from "./components/Views/Trainee/Workout"; // Import the new Workout component
import Nutrition from "./components/Views/Trainee/Nutrition/Nutrition"; // Import the Nutrition component
import "./App.css";

// Component to check if user is already verified and redirect accordingly
const VerificationRoute = () => {
  const userString = localStorage.getItem("user");
  
  if (userString) {
    const user = JSON.parse(userString);
    console.log("User verification status in VerificationRoute:", user.is_verified);
    
    // If user is already logged in and verified, redirect to dashboard
    // Only check if explicitly true (not undefined, empty, etc.)
    if (user.is_verified === true) {
      if (user.role === "trainee") {
        return <Navigate to="/Dashboard" replace />;
      } else if (user.role === "trainer") {
        return <Navigate to="/TrainerDashboard" replace />;
      }
    }
  }
  
  return <VerificationTab />;
};

function App() {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route
        path="/"
        element={
          <div className="App">
            <Header />
            <Hero />
            <About />
            <Services />
            <FAQ />
            <Features />
            <Footer />
            <BackToTopButton />
          </div>
        }
      />

      {/* Authentication Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/verify" element={<VerificationRoute />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminSignin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Redirect any onboarding attempts to Dashboard */}
      <Route path="/onboarding" element={<Navigate to="/Dashboard" replace />} />

      {/* Protected Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/TrainerDashboard" element={<TrainerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* New navigation routes */}
          <Route path="/your-trainer" element={<YourTrainer />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
