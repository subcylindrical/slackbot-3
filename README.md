# AI-Powered Slack Bot for Amazon Agency

This Slack bot acts as an AI-powered Amazon Agency account manager, monitoring channels and providing professional, diplomatic responses to messages.

## Features

- Monitors all channels the user is in
- Analyzes messages using ChatGPT
- Generates professional, diplomatic responses
- Real-time response display on web interface
- Hosted on Netlify

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build the frontend:
   ```bash
   npm run build
   ```

## Slack App Setup

1. Create a new Slack App at https://api.slack.com/apps
2. Enable Socket Mode
3. Add the following bot token scopes:
   - channels:history
   - chat:write
   - groups:history
   - im:history
   - mpim:history
4. Install the app to your workspace

## Deployment

The frontend is configured for Netlify deployment. The backend can be deployed to any Node.js hosting service.

## License

MIT 