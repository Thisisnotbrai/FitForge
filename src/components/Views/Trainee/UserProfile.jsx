import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faSave, faTimes, faUpload, faLock } from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";

const UserProfile = () => {
  // Default user data as fallback
  const defaultUserData = {
    fullName: "",
    email: "",
    profilePicture: null,
    bio: "",
    location: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
    },
  };

  // Get user data from localStorage
  const getUserFromStorage = () => {
    try {
      // Get basic user data
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      
      // Get extended profile data if it exists
      const profileString = localStorage.getItem("userProfile");
      const profileData = profileString ? JSON.parse(profileString) : null;
      
      const user = JSON.parse(userString);
      return {
        fullName: user.name || defaultUserData.fullName,
        email: user.email || defaultUserData.email,
        role: user.role || "trainee",
        profilePicture: profileData?.profilePicture || defaultUserData.profilePicture,
        bio: profileData?.bio || defaultUserData.bio,
        location: profileData?.location || defaultUserData.location,
        socialMedia: profileData?.socialMedia || defaultUserData.socialMedia,
      };
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUserData(storedUser);
      setEditData(storedUser);
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditData(userData);
      setPreviewImage(null);
      setErrors({});
    } else {
      // Start editing
      setEditData({ ...userData });
    }
    setIsEditing(!isEditing);
    setShowSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested objects (social media)
      const [parent, child] = name.split(".");
      setEditData({
        ...editData,
        [parent]: {
          ...editData[parent],
          [child]: value,
        },
      });
    } else {
      setEditData({
        ...editData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditData({
          ...editData,
          profilePicture: reader.result,
        });
      };
      reader.readAsDataURL(file);a
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate full name
    if (!editData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Preserve the original email when saving
      const updatedUserData = {
        ...editData,
        email: userData.email, // Ensure email doesn't change
      };
      
      setUserData(updatedUserData);
      setIsEditing(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      // In a real app, you would send this data to your API
      console.log("Saving user data:", updatedUserData);
      
      // Update the user's data in localStorage
      try {
        // Update name in the user object
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          user.name = updatedUserData.fullName;
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        // Save extended profile data
        const profileData = {
          profilePicture: updatedUserData.profilePicture,
          bio: updatedUserData.bio,
          location: updatedUserData.location,
          socialMedia: updatedUserData.socialMedia
        };
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      } catch (error) {
        console.error("Error updating user data in localStorage:", error);
      }
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <button 
          className={`profile-action-btn ${isEditing ? "cancel-btn" : "edit-btn"}`}
          onClick={handleEditToggle}
        >
          {isEditing ? (
            <>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </>
          )}
        </button>
      </div>

      {showSuccess && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}

      <div className="profile-content">
        <div className="profile-picture-section">
          {isEditing ? (
            <div className="profile-picture-upload">
              <div 
                className="profile-picture-preview" 
                style={{ 
                  backgroundImage: previewImage || editData.profilePicture 
                    ? `url(${previewImage || editData.profilePicture})` 
                    : "none" 
                }}
              >
                {!previewImage && !editData.profilePicture && (
                  <FontAwesomeIcon icon={faUser} className="default-user-icon" />
                )}
              </div>
              <label className="upload-button">
                <FontAwesomeIcon icon={faUpload} /> Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: "none" }} 
                />
              </label>
            </div>
          ) : (
            <div 
              className="profile-picture" 
              style={{ 
                backgroundImage: userData.profilePicture 
                  ? `url(${userData.profilePicture})` 
                  : "none" 
              }}
            >
              {!userData.profilePicture && (
                <FontAwesomeIcon icon={faUser} className="default-user-icon" />
              )}
            </div>
          )}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? "input-error" : ""}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="non-editable-field">
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="input-disabled"
                  />
                  <FontAwesomeIcon icon={faLock} className="lock-icon" />
                </div>
                <span className="field-note">Email cannot be changed</span>
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <div className="non-editable-field">
                  <input
                    type="text"
                    value={userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : ""}
                    disabled
                    className="input-disabled"
                  />
                  <FontAwesomeIcon icon={faLock} className="lock-icon" />
                </div>
                <span className="field-note">Account type cannot be changed</span>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="social-media-section">
                <h3>Social Media Links</h3>
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="text"
                    name="socialMedia.instagram"
                    value={editData.socialMedia.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram username"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="text"
                    name="socialMedia.twitter"
                    value={editData.socialMedia.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter username"
                  />
                </div>

                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="text"
                    name="socialMedia.facebook"
                    value={editData.socialMedia.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook username"
                  />
                </div>
              </div>

              <button 
                className="save-btn" 
                onClick={handleSave}
              >
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <h2>{userData.fullName}</h2>
                <p className="email">{userData.email}</p>
                <p className="role">Account Type: {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : ""}</p>
              </div>

              {userData.bio && (
                <div className="info-group">
                  <h3>About</h3>
                  <p>{userData.bio}</p>
                </div>
              )}

              {userData.location && (
                <div className="info-group">
                  <h3>Location</h3>
                  <p>{userData.location}</p>
                </div>
              )}

              {(userData.socialMedia.instagram || 
                userData.socialMedia.twitter ||
                userData.socialMedia.facebook) && (
                <div className="info-group">
                  <h3>Social Media</h3>
                  <div className="social-links">
                    {userData.socialMedia.instagram && (
                      <div className="social-link">
                        <span className="social-platform">Instagram:</span>
                        <span className="social-username">@{userData.socialMedia.instagram}</span>
                      </div>
                    )}
                    
                    {userData.socialMedia.twitter && (
                      <div className="social-link">
                        <span className="social-platform">Twitter:</span>
                        <span className="social-username">@{userData.socialMedia.twitter}</span>
                      </div>
                    )}
                    
                    {userData.socialMedia.facebook && (
                      <div className="social-link">
                        <span className="social-platform">Facebook:</span>
                        <span className="social-username">{userData.socialMedia.facebook}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 