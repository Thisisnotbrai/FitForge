import { Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/Views/ProtectedRoute";
import DashboardLayout from "./components/Views/DashboardLayout"; // Import the layout
import Signup from "./components/Signup/Signup"; // Import Signup component
import VerificationTab from "./components/Signup/VerificationTab"; // Import VerificationTab component
import "./App.css";

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

      {/* Signup and Verification Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerificationTab />} />

      {/* Protected Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/TrainerDashboard" element={<TrainerDashboard />} />{" "}
          {/* Add TrainerDashboard route */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
