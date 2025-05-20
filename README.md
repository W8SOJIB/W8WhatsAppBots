# WhatsApp Bot with ChatGPT Integration

A WhatsApp bot that uses OpenRouter API to provide AI-powered responses.

## Features
- Real-time message responses
- Sentiment analysis with emojis
- Automatic retry mechanism
- Friendly and engaging responses
- Group chat support
- Bot control commands

## Free Hosting Instructions

### 1. Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a free account
3. Verify your email

### 2. Deploy the Bot
1. Click "New +" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: whatsapp-bot
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

### 3. Set Environment Variables
In Render dashboard, add these environment variables:
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `NODE_ENV`: production

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Check the logs for the QR code
4. Scan the QR code with WhatsApp

## Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with your API keys
4. Run the bot:
   ```bash
   npm start
   ```

## Bot Commands
- `sahil bot stop`: Deactivate the bot
- `sahil bot start done`: Reactivate the bot

## Notes
- The free tier of Render may have some limitations
- The bot will need to be reconnected if the service restarts
- Keep your API keys secure 