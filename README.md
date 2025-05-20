# WhatsApp Bot with ChatGPT Integration

A WhatsApp bot that uses OpenRouter's API to provide ChatGPT-like responses, with features like sentiment analysis, emoji reactions, and automatic retries.

## Features

- 🤖 Real-time WhatsApp messaging
- 💬 ChatGPT-like responses using OpenRouter API
- 😊 Sentiment analysis with emoji reactions
- 🔄 Automatic retry mechanism
- 👥 Group chat support
- 🎯 Bot control commands
- 🌟 Friendly and engaging responses

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- WhatsApp account
- OpenRouter API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-bot.git
cd whatsapp-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Usage

### Local Development

1. Start the bot:
```bash
npm start
```

2. Scan the QR code with WhatsApp:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap on "Link a Device"
   - Scan the QR code shown in your terminal

### Bot Commands

- `sahil bot stop` - Deactivate the bot
- `sahil bot start done` - Reactivate the bot

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel deploy --prod
```

4. Add environment variables in Vercel dashboard:
   - OPENROUTER_API_KEY

## Project Structure

```
whatsapp-bot/
├── index.js           # Main bot code
├── package.json       # Project dependencies
├── vercel.json        # Vercel configuration
├── .env              # Environment variables
└── README.md         # Project documentation
```

## Features in Detail

### Sentiment Analysis
The bot analyzes message sentiment and responds with appropriate emojis:
- Positive messages: 😊
- Neutral messages: 😐
- Negative messages: 😔

### Group Chat Support
- Works in both private and group chats
- In groups, only responds when mentioned

### Error Handling
- Automatic retry mechanism (3 attempts)
- Friendly error messages
- Detailed logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [OpenRouter API](https://openrouter.ai/)
- [Sentiment](https://github.com/thisandagain/sentiment) 