import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserOnboarding.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDumbbell, 
  faWeight, 
  faHeartPulse, 
  faPersonRunning, 
  faVenusMars, 
  faMars, 
  faVenus 
} from "@fortawesome/free-solid-svg-icons";

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // User data state
  const [userData, setUserData] = useState({
    goal: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    bmi: "",
    bmiCategory: "",
  });

  // Check if onboarding is already completed
  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        console.log("Onboarding check - userProfile:", userProfile);
        
        // If onboardingCompleted is explicitly true (not undefined, null, etc), redirect to dashboard
        if (userProfile.onboardingCompleted === true) {
          console.log("Onboarding already completed, redirecting to Dashboard");
          navigate("/Dashboard", { replace: true });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        return false;
      }
    };
    
    // Check immediately on component mount
    checkOnboardingStatus();
  }, [navigate]);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (userData.weight && userData.height) {
      const heightInMeters = userData.height / 100;
      const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      let bmiCategory = "";
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi >= 18.5 && bmi < 25) bmiCategory = "Normal weight";
      else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";

      setUserData({ ...userData, bmi, bmiCategory });
    }
  }, [userData.weight, userData.height]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleGoalSelect = (goal) => {
    setUserData({ ...userData, goal });
    nextStep();
  };

  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
    nextStep();
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    try {
      // Get existing user data from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Create user profile object with onboarding data
      const userProfile = {
        ...user,
        ...userData,
        onboardingCompleted: true,
        onboardingDate: new Date().toISOString()
      };
      
      console.log("Saving user profile with onboarding data:", userProfile);
      
      // VERY IMPORTANT: Make sure we're setting both locations
      // First set in userProfile
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      // Then update the user object to include onboardingCompleted flag as well
      // This ensures the flag exists in both places in case either is checked
      const updatedUser = { ...user, onboardingCompleted: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Force a reload to ensure all components react to the localStorage change
      window.location.href = "/Dashboard";
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("There was an error saving your data. Please try again.");
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="step-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="step-text">Step {step} of {totalSteps}</div>
        </div>

        {/* Step 1: Goal Selection */}
        {step === 1 && (
          <div className="onboarding-step">
            <h2>What's your primary fitness goal?</h2>
            <p>We'll customize your experience based on what you want to achieve.</p>
            
            <div className="goal-options">
              <button 
                className={`goal-button ${userData.goal === "lose" ? "selected" : ""}`}
                onClick={() => handleGoalSelect("lose")}
              >
                <FontAwesomeIcon icon={faWeight} className="goal-icon" />
                <span>Lose Weight</span>
              </button>
              
              <button 
                className={`goal-button ${userData.goal === "build" ? "selected" : ""}`}
                onClick={() => handleGoalSelect("build")}
              >
                <FontAwesomeIcon icon={faDumbbell} className="goal-icon" />
                <span>Build Muscle</span>
              </button>
              
              <button 
                className={`goal-button ${userData.goal === "health" ? "selected" : ""}`}
                onClick={() => handleGoalSelect("health")}
              >
                <FontAwesomeIcon icon={faHeartPulse} className="goal-icon" />
                <span>Improve Health</span>
              </button>
              
              <button 
                className={`goal-button ${userData.goal === "athletic" ? "selected" : ""}`}
                onClick={() => handleGoalSelect("athletic")}
              >
                <FontAwesomeIcon icon={faPersonRunning} className="goal-icon" />
                <span>Athletic Performance</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Gender Selection */}
        {step === 2 && (
          <div className="onboarding-step">
            <h2>What's your biological sex?</h2>
            <p>This helps us provide more accurate calorie and workout recommendations.</p>
            
            <div className="gender-options">
              <button 
                className={`gender-button ${userData.gender === "male" ? "selected" : ""}`}
                onClick={() => handleGenderSelect("male")}
              >
                <FontAwesomeIcon icon={faMars} className="gender-icon" />
                <span>Male</span>
              </button>
              
              <button 
                className={`gender-button ${userData.gender === "female" ? "selected" : ""}`}
                onClick={() => handleGenderSelect("female")}
              >
                <FontAwesomeIcon icon={faVenus} className="gender-icon" />
                <span>Female</span>
              </button>
              
              <button 
                className={`gender-button ${userData.gender === "other" ? "selected" : ""}`}
                onClick={() => handleGenderSelect("other")}
              >
                <FontAwesomeIcon icon={faVenusMars} className="gender-icon" />
                <span>Prefer not to say</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Age */}
        {step === 3 && (
          <div className="onboarding-step">
            <h2>What's your age?</h2>
            <p>We use this to customize your fitness plan appropriately.</p>
            
            <div className="input-container">
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="13"
                max="100"
              />
              <span className="input-unit">years</span>
            </div>
            
            <div className="nav-buttons">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button 
                className="continue-btn" 
                onClick={nextStep}
                disabled={!userData.age}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Height */}
        {step === 4 && (
          <div className="onboarding-step">
            <h2>What's your height?</h2>
            <p>This helps us calculate your BMI and provide better recommendations.</p>
            
            <div className="input-container">
              <input
                type="number"
                name="height"
                value={userData.height}
                onChange={handleInputChange}
                placeholder="Enter your height"
                min="100"
                max="250"
              />
              <span className="input-unit">cm</span>
            </div>
            
            <div className="nav-buttons">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button 
                className="continue-btn" 
                onClick={nextStep}
                disabled={!userData.height}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Current Weight */}
        {step === 5 && (
          <div className="onboarding-step">
            <h2>What's your current weight?</h2>
            <p>This will help us track your progress over time.</p>
            
            <div className="input-container">
              <input
                type="number"
                name="weight"
                value={userData.weight}
                onChange={handleInputChange}
                placeholder="Enter your weight"
                min="30"
                max="300"
              />
              <span className="input-unit">kg</span>
            </div>
            
            <div className="nav-buttons">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button 
                className="continue-btn" 
                onClick={nextStep}
                disabled={!userData.weight}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Target Weight */}
        {step === 6 && (
          <div className="onboarding-step">
            <h2>What's your target weight?</h2>
            <p>Having a goal helps you stay motivated!</p>
            
            <div className="input-container">
              <input
                type="number"
                name="targetWeight"
                value={userData.targetWeight}
                onChange={handleInputChange}
                placeholder="Enter your target weight"
                min="30"
                max="300"
              />
              <span className="input-unit">kg</span>
            </div>
            
            <div className="nav-buttons">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button 
                className="continue-btn" 
                onClick={nextStep}
                disabled={!userData.targetWeight}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Review and BMI */}
        {step === 7 && (
          <div className="onboarding-step">
            <h2>Here's your health summary</h2>
            
            <div className="summary-container">
              <div className="bmi-display">
                <div className="bmi-value">{userData.bmi}</div>
                <div className="bmi-label">Your BMI</div>
                <div className="bmi-category">{userData.bmiCategory}</div>
              </div>
              
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">Goal:</span>
                  <span className="summary-value">
                    {userData.goal === "lose" && "Lose Weight"}
                    {userData.goal === "build" && "Build Muscle"}
                    {userData.goal === "health" && "Improve Health"}
                    {userData.goal === "athletic" && "Athletic Performance"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Gender:</span>
                  <span className="summary-value">
                    {userData.gender === "male" && "Male"}
                    {userData.gender === "female" && "Female"}
                    {userData.gender === "other" && "Prefer not to say"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Age:</span>
                  <span className="summary-value">{userData.age} years</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Height:</span>
                  <span className="summary-value">{userData.height} cm</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Weight:</span>
                  <span className="summary-value">{userData.weight} kg</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Target:</span>
                  <span className="summary-value">{userData.targetWeight} kg</span>
                </div>
              </div>
            </div>
            
            <div className="nav-buttons">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button className="submit-btn" onClick={handleSubmit}>
                Finish & Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOnboarding; 