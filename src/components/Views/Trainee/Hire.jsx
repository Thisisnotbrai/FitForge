import React, { useState } from "react";
import "./Hire.css";

const Hire = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample trainer data - in a real app, this would come from an API
  const trainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Strength Training",
      experience: "5 years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      description:
        "Certified personal trainer specializing in strength training and body transformation. Helping clients achieve their fitness goals through personalized workout plans.",
      price: "$50/hour",
      categories: ["strength", "weight-loss"],
    },
    {
      id: 2,
      name: "Mike Chen",
      specialty: "Yoga & Flexibility",
      experience: "8 years",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
      description:
        "Experienced yoga instructor with a focus on flexibility and mindfulness. Offers both group and private sessions for all skill levels.",
      price: "$45/hour",
      categories: ["yoga", "flexibility"],
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialty: "HIIT & Cardio",
      experience: "4 years",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
      description:
        "High-intensity interval training specialist with a passion for helping clients improve their cardiovascular health and endurance.",
      price: "$55/hour",
      categories: ["hiit", "cardio"],
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "Sports Performance",
      experience: "6 years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
      description:
        "Former professional athlete turned trainer, specializing in sports-specific training and performance enhancement.",
      price: "$60/hour",
      categories: ["sports", "performance"],
    },
  ];

  const categories = [
    { id: "all", name: "All Trainers" },
    { id: "strength", name: "Strength Training" },
    { id: "yoga", name: "Yoga" },
    { id: "hiit", name: "HIIT" },
    { id: "cardio", name: "Cardio" },
    { id: "flexibility", name: "Flexibility" },
    { id: "sports", name: "Sports Performance" },
  ];

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesCategory =
      selectedCategory === "all" ||
      trainer.categories.includes(selectedCategory);
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="hire-page">
      <div className="hire-header">
        <h1>Find Your Perfect Trainer</h1>
        <p>
          Browse through our certified trainers and find the one that matches
          your fitness goals
        </p>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="trainers-grid">
        {filteredTrainers.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div className="trainer-image">
              <img src={trainer.image} alt={trainer.name} />
              <div className="trainer-rating">⭐ {trainer.rating}</div>
            </div>
            <div className="trainer-info">
              <h3>{trainer.name}</h3>
              <p className="specialty">{trainer.specialty}</p>
              <p className="experience">Experience: {trainer.experience}</p>
              <p className="description">{trainer.description}</p>
              <div className="trainer-footer">
                <span className="price">{trainer.price}</span>
                <button className="hire-btn">Hire Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hire;
