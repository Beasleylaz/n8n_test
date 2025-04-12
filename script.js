// ElevenLabs configuration
const ELEVENLABS_API_KEY = 'sk_c967f90fc1b4c5108e7b0be26e2b434be2c9b54f57dbeb2e';
const N8N_WEBHOOK_URL = 'https://beasleylaz.app.n8n.cloud/webhook/voice-agent-started';
const LOCAL_PROXY = 'http://localhost:3001/proxy';

// Test webhook connection
const testWebhookConnection = async () => {
    console.log('Testing webhook connection...');
    try {
        // First test if the proxy server is running
        const proxyTestResponse = await fetch(`${LOCAL_PROXY.replace('/proxy', '/test')}`);
        if (!proxyTestResponse.ok) {
            throw new Error('Proxy server is not running. Please start it with npm start');
        }
        console.log('Proxy server is running correctly');

        // Try with local proxy
        const proxyResponse = await fetch(`${LOCAL_PROXY}?url=${encodeURIComponent(N8N_WEBHOOK_URL)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                test: true,
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('Proxy webhook test response status:', proxyResponse.status);
        
        if (proxyResponse.status === 404) {
            const errorData = await proxyResponse.json();
            console.error('Webhook URL not found:', errorData);
            alert('Webhook URL not found. Please check your n8n workflow configuration.');
            return;
        }
        
        const responseText = await proxyResponse.text();
        console.log('Proxy webhook test response:', responseText);
    } catch (error) {
        console.error('Webhook test failed:', error);
        if (error.message.includes('Proxy server is not running')) {
            alert('Proxy server is not running. Please start it with npm start');
        } else {
            alert('Failed to connect to webhook: ' + error.message);
        }
    }
};

// Initialize ElevenLabs widget
const initElevenLabs = () => {
    console.log('Initializing ElevenLabs widget...');
    const widget = document.getElementById('elevenlabs-widget');
    if (!widget) {
        console.error('ElevenLabs widget container not found');
        return;
    }

    // Listen for messages from the ElevenLabs widget
    window.addEventListener('message', (event) => {
        console.log('Received message from widget:', event.data);
        if (event.data.type === 'voice_started') {
            togglePulseIndicator(true);
            notifyN8N('voice_started');
        } else if (event.data.type === 'voice_ended') {
            togglePulseIndicator(false);
            notifyN8N('voice_ended');
        }
    });
};

// Toggle pulse indicator
const togglePulseIndicator = (isActive) => {
    console.log('Toggling pulse indicator:', isActive);
    const indicator = document.getElementById('pulse-indicator');
    if (isActive) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
};

// Notify n8n webhook
const notifyN8N = async (event) => {
    console.log('Sending webhook notification:', event);
    try {
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            source: 'voice_agent'
        };
        console.log('Webhook payload:', payload);

        // Use local proxy
        const proxyResponse = await fetch(`${LOCAL_PROXY}?url=${encodeURIComponent(N8N_WEBHOOK_URL)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Proxy webhook response status:', proxyResponse.status);
        
        if (proxyResponse.status === 404) {
            const errorData = await proxyResponse.json();
            console.error('Webhook URL not found:', errorData);
            return;
        }
        
        const responseText = await proxyResponse.text();
        console.log('Proxy webhook response:', responseText);
    } catch (error) {
        console.error('Failed to notify n8n:', error);
    }
};

// Handle chat button click
const initChatButton = () => {
    console.log('Initializing chat button...');
    const chatButton = document.getElementById('chat-button');
    if (!chatButton) {
        console.error('Chat button not found');
        return;
    }

    chatButton.addEventListener('click', async () => {
        console.log('Chat button clicked');
        const event = chatButton.textContent === 'Start Chat' ? 'chat_started' : 'chat_ended';
        await notifyN8N(event);
        chatButton.textContent = chatButton.textContent === 'Start Chat' ? 'End Chat' : 'Start Chat';
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    initElevenLabs();
    initChatButton();
    // Test webhook connection on load
    testWebhookConnection();
}); 