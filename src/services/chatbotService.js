/**
 * Chatbot Service for Timbur - FitForge's Fitness Assistant
 * 
 * This service handles the logic for processing user messages and generating appropriate responses
 * by calling the OpenRouter API.
 */

// Fallback responses in case the API fails
const fallbackResponses = [
  "I'm having trouble connecting to my knowledge base. Could you try again in a moment?",
  "Sorry, I seem to be experiencing a temporary issue. Please try again shortly.",
  "My connection to the fitness database is intermittent. Let me try to reconnect."
];

/**
 * Process a user message and generate a response using OpenRouter API
 * @param {string} message - The user's message
 * @returns {Promise<string>} The chatbot's response
 */
export const processMessage = async (message) => {
  try {
    // Make API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://www.webstylepress.com',
        'X-Title': 'WebStylePress',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: 'You are Timbur, a helpful fitness assistant. Provide concise, accurate advice about workouts, nutrition, and fitness goals. Keep responses brief and focused on health and fitness topics.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Error fetching response from OpenRouter:', error);
    // Return a random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

export default {
  processMessage
}; 