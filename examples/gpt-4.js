const express = require('express');
const ai = require('../index'); // Ensure this is the correct path to your module
const app = express();

app.use(express.json());

app.get('/generate', async (req, res) => {
  try {
    const model = 'gpt-4-turbo-2024-04-09';
    const messages = [
      { role: 'user', content: 'Hello!' },
      { role: 'system', content: '' }
    ];

    // Generate AI response
    const aiResponse = await ai.generate(model, messages);

    // Send response back to client
    res.json({ success: true, response: aiResponse });
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
