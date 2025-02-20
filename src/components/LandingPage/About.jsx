import React from "react";
import "./About.css";
import HeroCarousel from "./HeroCarousel";

const About = () => {
  return (
    <div id="about" className="about"> {/* Add the id="about" */}
      <HeroCarousel /> {/* Integrating the HeroCarousel component */}
      <div className="overlay">
        <div className="about-content">
          <h1>
            Experience <br /> <span className="elevated">Elevated</span> Living
          </h1>
          <p>
          State-of-the-art equipment, expert guidance, personalized workouts, and premium facilities for a high-performance fitness experience.
          </p>
          <button className="learn-more">Learn more</button>
        </div>
        <div className="nav-controls">
        </div>
      </div>
    </div>
  );
};

export default About;
