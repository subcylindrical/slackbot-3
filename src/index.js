require('dotenv').config();
const { App } = require('@slack/bolt');
const { OpenAI } = require('openai');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Slack app
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to analyze message with ChatGPT
async function analyzeMessage(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a skilled Amazon Agency account manager. You are diplomatic, professional, and maintain a friendly tone. Your responses should be helpful, informative, and engaging while maintaining professionalism."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing message:', error);
    return "I apologize, but I'm having trouble processing that message right now.";
  }
}

// Listen for messages in all channels
slackApp.message(async ({ message, say }) => {
  try {
    // Ignore messages from bots to prevent loops
    if (message.subtype === 'bot_message') return;

    // Analyze the message
    const analysis = await analyzeMessage(message.text);

    // Send the response back to the channel
    await say({
      text: analysis,
      thread_ts: message.ts
    });

    // Emit the message and response to connected web clients
    io.emit('newMessage', {
      originalMessage: message.text,
      response: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start the Slack app
(async () => {
  await slackApp.start();
  console.log('⚡️ Bolt app is running!');
})(); 