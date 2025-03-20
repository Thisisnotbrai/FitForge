import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCheckCircle,
  faEdit,
  faInfoCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [profile, setProfile] = useState({});

  // Load user profile data from localStorage when component mounts
  useEffect(() => {
    loadUserProfileData();
  }, []);

  // Function to load user profile data from localStorage
  const loadUserProfileData = () => {
    try {
      // Get user object from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Get userProfile object from localStorage (may contain additional data)
      const userProfileData = JSON.parse(localStorage.getItem("userProfile") || "{}");
      
      // Get persisted profile data that may have been saved separately
      const persistedProfileData = JSON.parse(localStorage.getItem("persistedProfileData") || "{}");
      
      // Combine all data sources, with persisted profile data taking precedence
      const combinedProfile = {
        ...userData,
        ...userProfileData,
        ...persistedProfileData
      };
      
      // Load previously saved profile image if it exists
      if (persistedProfileData.profileImageData) {
        setProfileImagePreview(persistedProfileData.profileImageData);
      }
      
      console.log("Loaded user profile data:", combinedProfile);
      
      // Set the profile state
      setProfile(combinedProfile);
      setEditableProfile(combinedProfile);
    } catch (error) {
      console.error("Error loading user profile data:", error);
      console.error("Failed to load profile data");
    }
  };

  // Function to save all profile changes to localStorage
  const saveProfileChanges = () => {
    try {
      // Create a profile data object with all the fields to persist
      const persistedData = {
        ...editableProfile,
        profileImageData: profileImagePreview,
        lastUpdated: new Date().toISOString()
      };
      
      // Save this as a separate object in localStorage
      localStorage.setItem("persistedProfileData", JSON.stringify(persistedData));
      
      // Update the userProfile object as well to ensure data is in both places
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      const updatedUserProfile = { ...userProfile, ...editableProfile };
      localStorage.setItem("userProfile", JSON.stringify(updatedUserProfile));
      
      console.log("Profile data saved successfully:", persistedData);
      
      // Update the current profile state
      setProfile(editableProfile);
      setIsEditing(false);
      
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile data:", error);
      console.error("Failed to save profile data");
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setProfileImage(selectedFile);
      
      // Create a FileReader to convert the image to data URL for preview and storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImagePreview(imageDataUrl);
        
        // Update editable profile with the image data
        setEditableProfile(prev => ({
          ...prev,
          profileImageData: imageDataUrl
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    // Reset editable profile to current profile
    setEditableProfile(profile);
    // Reset image preview to current image
    setProfileImagePreview(profile.profileImageData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        {!isEditing && (
          <button className="edit-profile-btn" onClick={startEditing}>
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-picture-section">
          <div className="profile-picture-container">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <FontAwesomeIcon icon={faUser} size="2x" />
              </div>
            )}
            {isEditing && (
              <div className="profile-picture-overlay">
                <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Change Photo</span>
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <h3 className="profile-name">{profile.name || profile.email || "User"}</h3>
          <p className="profile-role">{profile.role || "Trainee"}</p>
        </div>

        <div className="profile-details-section">
          <h3>Personal Information</h3>
          
          {isEditing ? (
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editableProfile.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editableProfile.email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editableProfile.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={editableProfile.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  rows={3}
                />
              </div>
              
              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="save-btn"
                  onClick={saveProfileChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{profile.name || "Not set"}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profile.email || "Not set"}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{profile.phone || "Not set"}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{profile.address || "Not set"}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Health Data Section */}
        {profile.onboardingCompleted && (
          <div className="profile-health-section">
            <h3>Health Information</h3>
            <div className="health-info">
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">{profile.height || "Not set"} cm</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{profile.weight || "Not set"} kg</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Target Weight</span>
                <span className="info-value">{profile.targetWeight || "Not set"} kg</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">BMI</span>
                <span className="info-value">{profile.bmi || "Not calculated"}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Fitness Goal</span>
                <span className="info-value">{profile.goal || "Not set"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 
