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
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Load user profile data from localStorage when component mounts
  useEffect(() => {
    loadUserProfileData();
  }, []);

  // Helper function to get the current user's unique profile storage key
  const getUserProfileKey = (email) => {
    return `userProfile_${email}`;
  };

  // Function to load user profile data from localStorage
  const loadUserProfileData = () => {
    try {
      // Get current user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Ensure we have a user email for identifying this user's profile
      if (!userData.email) {
        console.error("No user email found, cannot load profile data");
        return;
      }
      
      setCurrentUserEmail(userData.email);
      
      // Get user-specific profile data using the user's email as a unique identifier
      const userProfileKey = getUserProfileKey(userData.email);
      const userProfileData = JSON.parse(localStorage.getItem(userProfileKey) || "{}");
      
      console.log(`Loading profile data for user: ${userData.email}`);
      console.log("User data from auth:", userData);
      console.log("User profile data:", userProfileData);
      
      // Combine data, with profile-specific data taking precedence
      const combinedProfile = {
        ...userData,
        ...userProfileData,
      };
      
      // Load previously saved profile image if it exists
      if (userProfileData.profileImageData) {
        setProfileImagePreview(userProfileData.profileImageData);
      }
      
      console.log("Loaded combined profile data:", combinedProfile);
      
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
      if (!currentUserEmail) {
        console.error("No user email found, cannot save profile data");
        return;
      }
      
      // Get the user-specific profile key
      const userProfileKey = getUserProfileKey(currentUserEmail);
      
      // Create a profile data object with all the fields to persist
      const profileData = {
        ...editableProfile,
        profileImageData: profileImagePreview,
        lastUpdated: new Date().toISOString(),
        email: currentUserEmail, // Ensure email is always part of the profile
      };
      
      // Save this user's profile to their unique localStorage key
      localStorage.setItem(userProfileKey, JSON.stringify(profileData));
      
      console.log(`Profile data saved for user ${currentUserEmail}:`, profileData);
      
      // Update the current profile state
      setProfile(profileData);
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
                  value={currentUserEmail}
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
                <span className="info-value">{currentUserEmail}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">
                  {profile.phone || "Not set"}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">
                  {profile.address || "Not set"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>Fitness Information</h3>
          
          {isEditing ? (
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={editableProfile.height || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your height"
                  />
                </div>
                
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={editableProfile.weight || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your weight"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Fitness Goals</label>
                <textarea
                  name="fitnessGoals"
                  value={editableProfile.fitnessGoals || ""}
                  onChange={handleInputChange}
                  placeholder="Describe your fitness goals"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Health Conditions</label>
                <textarea
                  name="healthConditions"
                  value={editableProfile.healthConditions || ""}
                  onChange={handleInputChange}
                  placeholder="List any health conditions or limitations"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">
                  {profile.height ? `${profile.height} cm` : "Not set"}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">
                  {profile.weight ? `${profile.weight} kg` : "Not set"}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Fitness Goals</span>
                <span className="info-value">
                  {profile.fitnessGoals || "Not set"}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Health Conditions</span>
                <span className="info-value">
                  {profile.healthConditions || "Not set"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
