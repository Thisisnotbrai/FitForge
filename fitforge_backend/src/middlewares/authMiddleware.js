/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const send = require('../utils/response');
require('dotenv').config();

// Middleware to authenticate JWT token
exports.authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return send.sendResponseMessage(res, 401, null, "Access denied. No token provided.");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Add the user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return send.sendResponseMessage(res, 403, null, "Invalid token");
  }
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return send.sendResponseMessage(res, 401, null, "Access denied. Not authenticated.");
  }

  if (req.user.role !== 'admin') {
    return send.sendResponseMessage(res, 403, null, "Access denied. Admin privileges required.");
  }

  next();
}; 