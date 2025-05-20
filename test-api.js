import fetch from 'node-fetch';

async function testOpenRouterAPI() {
    console.log('Testing OpenRouter API connection...');
    
    try {
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
                        "role": "user",
                        "content": "Hello, are you working?"
                    }
                ]
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', errorData);
            return;
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Message content:', data.choices[0].message.content);
        
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testOpenRouterAPI(); 