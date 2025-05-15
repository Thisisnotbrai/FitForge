/* eslint-disable no-undef */
const { User, Sequelize } = require("../models/database");

// Get System Health for Admin Dashboard
exports.getSystemHealth = async (req, res) => {
  try {
    // Get user activity stats
    const today = await getActiveUsersInPeriod(1);
    const thisWeek = await getActiveUsersInPeriod(7);
    const thisMonth = await getActiveUsersInPeriod(30);
    
    // For a real system, you would also check other metrics like:
    // - Server uptime
    // - Database connection status
    // - Error rates
    // - Response times
    // - Memory usage
    
    return res.status(200).json({
      success: true,
      message: "System health data retrieved successfully",
      data: {
        status: "Operational", // This would be dynamic in a real system
        userActivity: {
          today,
          thisWeek,
          thisMonth
        }
      }
    });
  } catch (error) {
    console.error("Error retrieving system health:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve system health data",
      error: error.message
    });
  }
};

// Helper function to get active users in a given period
const getActiveUsersInPeriod = async (days) => {
  try {
    // In a real system, this would track user logins or other activity indicators
    // For now, we'll count users created in the last X days as a proxy for activity
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const count = await User.count({
      where: {
        created_at: {
          [Sequelize.Op.gte]: daysAgo
        }
      }
    });
    
    return count;
  } catch (error) {
    console.error(`Error counting active users in last ${days} days:`, error);
    return 0;
  }
}; 