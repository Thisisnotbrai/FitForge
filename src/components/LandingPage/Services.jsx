import React from "react";
import "./Services.css";

const Services = () => {
  const features = [
    {
      icon: "🌐", // Replace with an actual icon or image
      title: "Custom Domains",
      description: "Make your customers feel like they never left your website.",
    },
    {
      icon: "🔑", // Replace with an actual icon or image
      title: "Single Sign-On",
      description: "Let your users post feedback without having to authenticate.",
    },
    {
      icon: "🌓", // Replace with an actual icon or image
      title: "Dark & Light Mode",
      description: "Choose the theme that suits your eyes the best.",
    },
    {
      icon: "📝", // Replace with an actual icon or image
      title: "No Sign-Up Posting & Voting",
      description: "Let people join the conversation without having to sign in.",
    },
    {
      icon: "🔒", // Replace with an actual icon or image
      title: "Private Categories",
      description: "Keep feedback board public, but manage some tasks internally.",
    },
    {
      icon: "🏷️", // Replace with an actual icon or image
      title: "Custom Tags",
      description: "Categorize posts further with tags to give more context.",
    },
    {
      icon: "👍👎", // Replace with an actual icon or image
      title: "Upvoting & Downvoting",
      description: "Prioritize product development, see what your users want.",
    },
    {
      icon: "🔔", // Replace with an actual icon or image
      title: "Featurebase Notifications",
      description: "Featurebase notifies your users when there are changes.",
    },
  ];

  return (
    <section className="services">
      <div className="services-content">
        <h2>Powerful features to supercharge your product development</h2>
        <p className="subtitle">
          Some of our amazing features that will help you build a better product.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;