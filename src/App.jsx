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
import DashboardLayout from "./components/Views/DashboardLayout"; // Import the layout
import Signup from "./components/Signup/Signup"; // Import Signup component
import VerificationTab from "./components/Signup/VerificationTab"; // Import VerificationTab component
import Signin from "./components/Signin/Signin"; // Import Signin component
import UserOnboarding from "./components/Onboarding/UserOnboarding"; // Import the UserOnboarding component
// Import the actual component files
import YourTrainer from "./components/Views/Trainee/YourTrainer";
import Hire from "./components/Views/Trainee/Hire";
import Progress from "./components/Views/Trainee/Progress";
import Workout from "./components/Views/Trainee/Workout"; // Import the new Workout component
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

// Component to check if user needs onboarding
const OnboardingCheck = () => {
  try {
    // First check if user is logged in at all
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.log("User not logged in, showing regular Dashboard");
      return <Dashboard />;
    }
    
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const user = JSON.parse(userString || "{}");
    
    console.log("Dashboard route - checking onboarding status from userProfile:", userProfile);
    console.log("Dashboard route - checking onboarding status from user:", user);
    
    // Check both locations for onboardingCompleted flag
    const isOnboardingCompleted = userProfile.onboardingCompleted === true || user.onboardingCompleted === true;
    
    // If onboarding is not completed, redirect to onboarding
    if (!isOnboardingCompleted) {
      console.log("Onboarding not completed, redirecting to onboarding");
      return <Navigate to="/onboarding" replace />;
    }
    
    // Otherwise, render the Dashboard
    console.log("Onboarding completed, showing Dashboard");
    return <Dashboard />;
  } catch (error) {
    console.error("Error in OnboardingCheck:", error);
    // If there's an error, just show the Dashboard
    return <Dashboard />;
  }
};

// Component to prevent already onboarded users from accessing the onboarding route
const OnboardingGuard = () => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    console.log("Onboarding route - checking completion status from userProfile:", userProfile);
    console.log("Onboarding route - checking completion status from user:", user);
    
    // Check both locations for onboardingCompleted flag
    const isOnboardingCompleted = userProfile.onboardingCompleted === true || user.onboardingCompleted === true;
    
    // If onboarding is already completed, redirect to dashboard
    if (isOnboardingCompleted) {
      console.log("Onboarding already completed, redirecting to Dashboard");
      return <Navigate to="/Dashboard" replace />;
    }
    
    // Otherwise, render the Onboarding component
    console.log("Onboarding not completed, showing Onboarding component");
    return <UserOnboarding />;
  } catch (error) {
    console.error("Error in OnboardingGuard:", error);
    // If there's an error, let's still show the onboarding
    return <UserOnboarding />;
  }
};

// Reset onboarding status for debugging - access via /reset-onboarding
const ResetOnboarding = () => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    userProfile.onboardingCompleted = false;
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    console.log("Onboarding status reset to false");
    return <Navigate to="/onboarding" replace />;
  } catch (error) {
    console.error("Error resetting onboarding status:", error);
    return <div>Error resetting onboarding status</div>;
  }
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

      {/* Debug utility */}
      <Route path="/reset-onboarding" element={<ResetOnboarding />} />

      {/* Onboarding Route with Guard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingGuard />} />
      </Route>

      {/* Protected Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<OnboardingCheck />} />
          <Route path="/TrainerDashboard" element={<TrainerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* New navigation routes */}
          <Route path="/your-trainer" element={<YourTrainer />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
