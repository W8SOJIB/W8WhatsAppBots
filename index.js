import 'dotenv/config';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import Sentiment from 'sentiment';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Bot state
let isBotActive = true;
let whatsappClient = null;

// Bot personality and responses
const botPersonality = {
    greetings: [
        "Hey there! 👋",
        "Hi! How can I help you today? 😊",
        "Hello! Nice to chat with you! 🌟",
        "Hey! What's on your mind? 💭"
    ],
    thinking: [
        "🤔 Let me think about that...",
        "💭 Processing your message...",
        "✨ Working on a response...",
        "🌟 Coming up with something interesting..."
    ],
    error: [
        "Oops! I'm having a small hiccup. Could you try again? 🙈",
        "Hmm, something's not quite right. Let's try that again! 🤔",
        "I'm a bit confused right now. Could you rephrase that? 😅",
        "Sorry about that! Let's try again in a moment! 🌟"
    ]
};

// Function to get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Initialize WhatsApp client
async function initializeWhatsApp() {
    if (whatsappClient) return whatsappClient;

    whatsappClient = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-extensions',
                '--disable-default-apps',
                '--disable-translate',
                '--disable-sync',
                '--disable-background-networking',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--safebrowsing-disable-auto-update'
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
            executablePath: puppeteer.executablePath()
        }
    });

    // Generate QR code
    whatsappClient.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('QR Code generated. Scan it with WhatsApp to login.');
    });

    // When client is ready
    whatsappClient.on('ready', () => {
        console.log('Client is ready!');
    });

    // Handle incoming messages
    whatsappClient.on('message', async (message) => {
        if (!isBotActive) return;

        const content = message.body.toLowerCase();
        
        // Check for bot control commands
        if (content === 'sahil bot stop') {
            isBotActive = false;
            await message.reply('👋 Bot is now inactive. Sahil will respond manually.');
            return;
        }
        
        if (content === 'sahil bot start done') {
            isBotActive = true;
            await message.reply('🌟 Bot is now active and ready to chat! How can I help you today?');
            return;
        }

        // Check if message is a mention in group
        const isGroup = message.from.endsWith('@g.us');
        const isMentioned = message.mentionedIds && message.mentionedIds.includes(whatsappClient.info.wid._serialized);

        if (isGroup && !isMentioned) return;

        let thinkingMsg = null;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                console.log('Received message:', message.body);
                
                // Send thinking message with random friendly text
                if (!thinkingMsg) {
                    thinkingMsg = await message.reply(getRandomResponse(botPersonality.thinking));
                    console.log('Sent thinking message');
                } else {
                    await thinkingMsg.edit(`🔄 Retrying... (Attempt ${retryCount + 1}/${maxRetries})`);
                }

                // Analyze sentiment
                const sentimentResult = sentiment.analyze(message.body);
                const emoji = isRomanticMessage(message.body) ? getRomanticEmoji() : getEmojiForSentiment(sentimentResult.score);
                console.log('Sentiment analysis complete:', { score: sentimentResult.score, emoji });

                // Get ChatGPT response with timeout
                console.log('Proceeding to get ChatGPT response...');
                const response = await Promise.race([
                    getChatGPTResponse(message.body),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Response timeout')), 15000)
                    )
                ]);

                console.log('Got response from ChatGPT:', response);

                if (!response || response.trim() === '') {
                    throw new Error('Empty response from ChatGPT');
                }

                // Edit the thinking message with the actual response
                const finalResponse = `${response}\n${emoji}`;
                console.log('Sending final response:', finalResponse);
                await thinkingMsg.edit(finalResponse);
                console.log('Response sent successfully');
                break; // Success, exit the retry loop

            } catch (error) {
                console.error(`Error in message handling (Attempt ${retryCount + 1}/${maxRetries}):`, error);
                retryCount++;

                if (retryCount >= maxRetries) {
                    const errorMessage = getRandomResponse(botPersonality.error);
                    if (thinkingMsg) {
                        await thinkingMsg.edit(errorMessage);
                    } else {
                        await message.reply(errorMessage);
                    }
                } else {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
    });

    // Handle connection status
    whatsappClient.on('disconnected', () => {
        console.log('Client disconnected');
    });

    // Initialize the client
    await whatsappClient.initialize();
    return whatsappClient;
}

// Function to get emoji based on sentiment
function getEmojiForSentiment(score) {
    if (score > 2) return '😊';
    if (score > 0) return '🙂';
    if (score === 0) return '😐';
    if (score > -2) return '😔';
    return '😢';
}

// Function to get romantic emoji
function getRomanticEmoji() {
    const romanticEmojis = ['❤️', '🥰', '😍', '💕', '💖'];
    return romanticEmojis[Math.floor(Math.random() * romanticEmojis.length)];
}

// Function to detect if message is romantic
function isRomanticMessage(message) {
    const romanticWords = ['love', 'heart', 'romantic', 'kiss', 'hug', 'sweet', 'darling', 'honey'];
    return romanticWords.some(word => message.toLowerCase().includes(word));
}

// Function to get ChatGPT response with retries
async function getChatGPTResponse(message, retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    try {
        console.log(`Attempt ${retryCount + 1} to get ChatGPT response...`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'WhatsApp Bot Local'
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [
                    {
                        "role": "system",
                        "content": "You are a friendly and helpful AI assistant. Always be polite, engaging, and conversational. Use emojis occasionally to make responses more friendly. Keep responses concise but warm."
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            
            if (retryCount < maxRetries) {
                console.log(`Retrying in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return getChatGPTResponse(message, retryCount + 1);
            }
            
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response data:', JSON.stringify(data, null, 2));
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            if (retryCount < maxRetries) {
                console.log(`Invalid response format, retrying in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return getChatGPTResponse(message, retryCount + 1);
            }
            throw new Error('Invalid API response format');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('API Error:', error);
        
        if (retryCount < maxRetries) {
            console.log(`Error occurred, retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return getChatGPTResponse(message, retryCount + 1);
        }
        
        throw error;
    }
}

// Export the initialization function for Vercel
export default async function handler(req, res) {
    try {
        const client = await initializeWhatsApp();
        res.status(200).json({ status: 'WhatsApp bot is running' });
    } catch (error) {
        console.error('Error initializing WhatsApp client:', error);
        res.status(500).json({ error: 'Failed to initialize WhatsApp client' });
    }
}