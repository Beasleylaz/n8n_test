// ElevenLabs configuration
const ELEVENLABS_API_KEY = 'sk_c967f90fc1b4c5108e7b0be26e2b434be2c9b54f57dbeb2e';

// Session management
let sessionId = null;

// Generate a unique session ID
const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Initialize ElevenLabs widget
const initElevenLabs = () => {
    console.log('Initializing ElevenLabs widget...');
    const widget = document.getElementById('elevenlabs-widget');
    if (!widget) {
        console.error('ElevenLabs widget container not found');
        return;
    }

    // Generate new session ID when widget is initialized
    sessionId = generateSessionId();
    console.log('Generated session ID:', sessionId);

    // Listen for messages from the ElevenLabs widget
    window.addEventListener('message', (event) => {
        console.log('Received message from widget:', event.data);
        if (event.data.type === 'voice_started') {
            togglePulseIndicator(true);
            updateStatus('Listening');
        } else if (event.data.type === 'voice_ended') {
            togglePulseIndicator(false);
            updateStatus('Ready');
        }
    });
};

// Toggle pulse indicator
const togglePulseIndicator = (isActive) => {
    console.log('Toggling pulse indicator:', isActive);
    const indicator = document.getElementById('pulse-indicator');
    if (indicator) {
        if (isActive) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }
};

// Update status indicator
const updateStatus = (status) => {
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
        statusIndicator.textContent = status;
        if (status === 'Listening') {
            statusIndicator.classList.add('listening');
        } else {
            statusIndicator.classList.remove('listening');
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    initElevenLabs();
    // Set initial status
    updateStatus('Ready');
}); 