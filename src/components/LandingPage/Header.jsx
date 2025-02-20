import React from "react";
import "./Header.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo

const Header = () => {
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
        <a href="#services">Services</a>
        <a href="#FAQ">FAQs</a>
        <a href="#contact-us">Contact Us</a>
      </nav>
      <div className="auth-buttons">
        <button className="sign-in">Sign In</button>
        <button className="sign-up">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
