import "./SideNav.css";
import logo from "../../assets/FitForge Logo.jpg"; // Importing the logo

const SideNav = () => {
  return (
    <header className="sidenav">
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
    </header>
  );
};

export default SideNav;
