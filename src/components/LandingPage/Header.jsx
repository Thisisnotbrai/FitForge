import "./Header.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo
import Modal from "../Modal";
import { useState } from "react";
import Signin from "../Signin/Signin";
import Signup from "../Signup/Signup";

const Header = () => {
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSigninModal = () => setIsSigninOpen(true);
  const closeSigninModal = () => setIsSigninOpen(false);

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="FitForge Logo" className="logo-icon" />
        <span>
          <span className="fit">Fit</span>
          <span className="forge">Forge</span>
        </span>
      </div>

      <nav className="nav">
        <a href="#">Products</a>
        <a href="#about">Get Started</a>
        <a href="#FAQ">FAQs</a>
        <a href="#features">Our Team</a>
        <a href="#contact-us">Contact Us</a>
      </nav>
      <div className="auth-buttons">
        <button className="sign-in" onClick={openSigninModal}>
          Sign In
        </button>
        <button className="sign-up" onClick={openSignupModal}>
          Sign Up
        </button>

        <Modal isOpen={isSigninOpen} onClose={closeSigninModal}>
          <Signin />
        </Modal>

        {/* Signup Modal */}
        <Modal isOpen={isSignupOpen} onClose={closeSignupModal}>
          <Signup />
        </Modal>
      </div>
    </header>
  );
};

export default Header;
