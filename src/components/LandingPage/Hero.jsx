import React from "react";
import { ShieldCheck, Zap, Repeat } from "lucide-react"; // Import Lucide icons
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="trust-badge">⭐ Trusted by Over 1 Million Users Worldwide</div>
      <h1 className="hero-title">
        Revolutionize Your <span className="gradient-text">Payments Experience</span>
      </h1>
      <p className="hero-description">
        Unlock seamless, secure, and instant financial transactions. Manage, send, and receive
        money effortlessly, with the ability to scale and integrate multiple financial services.
      </p>
      <div className="hero-buttons">
        <button className="start-now">Start Now</button>
      </div>

      <div className="features">
        <div className="feature-card1">
          <ShieldCheck size={32} className="feature-icon1" />
          <h3 className="feature-title1">Secure Transfer</h3>
          <p className="feature-description1">
            FitForge ensures that your monthly membership payments are processed instantly with top-notch security, keeping your financial data safe at all times.
          </p>
        </div>

        <div className="feature-card1">
          <Zap size={32} className="feature-icon1" />
          <h3 className="feature-title1">Seamless Integration</h3>
          <p className="feature-description1">
            Whether you're at home, at the gym, or traveling, your fitness data is available across multiple devices. Stay on top of your goals with cross-platform accessibility.
          </p>
        </div>

        <div className="feature-card1">
          <Repeat size={32} className="feature-icon1" />
          <h3 className="feature-title1">Multi-Currency Support</h3>
          <p className="feature-description1">
            Effortlessly transact in multiple currencies. ZenPay simplifies international payments.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
