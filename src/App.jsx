import { Routes, Route } from "react-router-dom";
import Header from "./components/LandingPage/Header";
import Hero from "./components/LandingPage/Hero";
import About from "./components/LandingPage/About";
import Services from "./components/LandingPage/Services";
import FAQ from "./components/LandingPage/FAQ";
import Features from "./components/LandingPage/Features";
import Footer from "./components/LandingPage/Footer";
import BackToTopButton from "./components/LandingPage/BackToTopButton";
import Dashboard from "./components/Views/Dashboard";
import ProtectedRoute from "./components/Views/ProtectedRoute";
import DashboardLayout from "./components/Views/DashboardLayout"; // Import the layout
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

      {/* Protected Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
