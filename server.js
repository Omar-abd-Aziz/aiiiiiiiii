const express = require('express');
const ai = require('./index'); // Ensure this is the correct path to your module
const app = express();

const cors = require('cors');
// Allow all CORS requests
app.use(cors());


const models = [
  'gpt-4o-mini-free',
  'gpt-4o-mini',
  'gpt-4o-free',
  'gpt-4-turbo-2024-04-09',
  'gpt-4o-2024-08-06',
  'grok-2',
  'grok-2-mini',
  'claude-3-opus-20240229',
  'claude-3-opus-20240229-gcp',
  'claude-3-sonnet-20240229',
  'claude-3-5-sonnet-20240620',
  'claude-3-haiku-20240307',
  'claude-2.1',
  'gemini-1.5-flash-exp-0827',
  'gemini-1.5-pro-exp-0827'
];

app.use(express.json());

// Function to get a random model from the list
const getRandomModel = () => {
  const randomIndex = Math.floor(Math.random() * models.length);
  return models[randomIndex];
};

// Update the route to accept a message from the client
app.post('/generate', async (req, res) => {
  try {
    // Extract the user message from the request body
    const userMessage = req.body.message;

    // Check if the user message is provided
    if (!userMessage) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const messages = [
      { role: 'user', content: userMessage }, // Use the user's message here
      { role: 'system', content: '' }
    ];

    let aiResponse;
    const maxRetries = 5; // Set a maximum number of retries
    let attempts = 0;

    while (attempts < maxRetries) {
      const model = getRandomModel();
      console.log(`Attempting to generate response using model: ${model}`);
      
      try {
        // Generate AI response
        aiResponse = await ai.generate(model, messages);
        // If successful, break the loop
        break;
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        attempts += 1;
        // Optionally, you could log the model that failed
      }
    }

    if (aiResponse) {
      // Send response back to client
      res.json({ success: true, response: aiResponse });
    } else {
      res.status(500).json({ success: false, error: 'All models failed to generate a response' });
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
