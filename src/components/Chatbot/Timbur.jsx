import React, { useState, useEffect, useRef } from 'react';
import './Timbur.css';
import chatbotService from '../../services/chatbotService';

// Import Timburr image
const timburImage = "https://img.pokemondb.net/sprites/black-white/anim/normal/timburr.gif";

const Timbur = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: 'bot', time: getCurrentTime() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Process user message and generate a bot response using the chatbot service
  const processMessage = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Get response from chatbot service (now async)
      const botResponse = await chatbotService.processMessage(userMessage);
      
      // Add the bot's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botResponse, sender: 'bot', time: getCurrentTime() }
      ]);
    } catch (error) {
      console.error('Error in processMessage:', error);
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot', time: getCurrentTime() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: inputValue, sender: 'user', time: getCurrentTime() }
    ]);
    
    // Process the message to get a response
    processMessage(inputValue);
    
    // Clear input field
    setInputValue('');
  };

  return (
    <div className="timbur-container">
      <div className="timbur-header">
        <div className="avatar">
          <img src={timburImage} alt="Timburr" className="avatar-image" />
        </div>
        <div className="header-text">
          <h2>Timburr</h2>
          <p className="status">Online</p>
        </div>
        <button className="timbur-close-button" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="timbur-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message-wrapper ${message.sender}-wrapper`}
          >
            {message.sender === 'bot' && (
              <div className="message-icon">
                <img src={timburImage} alt="Timburr" className="message-avatar" />
              </div>
            )}
            <div className="message-content">
              <div className={`message ${message.sender}`}>
                <p>{message.text}</p>
              </div>
              <div className="message-time">{message.time}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon">
              <img src={timburImage} alt="Timburr" className="message-avatar" />
            </div>
            <div className="message-content">
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="timbur-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="timbur-input"
        />
        <button type="submit" className="timbur-send-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="white" stroke="white" strokeWidth="1" />
            <path d="M1 12H23" stroke="#f44336" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="white" stroke="#f44336" strokeWidth="1.5" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Timbur; 