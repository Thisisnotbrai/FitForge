import React from 'react';
import './ChatHistory.css';

const ChatHistory = () => {
  const recentChats = [
    {
      title: "Previous 7 Days",
      chats: [
        "Workout Plan Discussion",
        "Nutrition Goals Setup",
        "Progress Tracking",
        "Exercise Form Check",
        "Meal Plan Adjustments",
        "Recovery Strategies",
        "Weekly Goals Review"
      ]
    },
    {
      title: "Previous 30 Days",
      chats: [
        "Monthly Progress Review",
        "Fitness Assessment",
        "Diet Plan Update",
        "Training Program Adjustment",
        "Supplement Discussion",
        "Weight Goals Check-in"
      ]
    }
  ];

  return (
    <div className="chat-history">
      {recentChats.map((section, index) => (
        <div key={index} className="history-section">
          <h3 className="section-title">{section.title}</h3>
          <ul className="chat-list">
            {section.chats.map((chat, chatIndex) => (
              <li key={chatIndex} className="chat-item">
                {chat}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 