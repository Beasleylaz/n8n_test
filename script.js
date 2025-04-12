// ElevenLabs configuration
const ELEVENLABS_API_KEY = 'sk_c967f90fc1b4c5108e7b0be26e2b434be2c9b54f57dbeb2e';

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
document.addEventListener('DOMContentLoaded', function() {
    const widget = document.querySelector('elevenlabs-convai');
    const statusIndicator = document.getElementById('status-indicator');
    const pulseIndicator = document.getElementById('pulse-indicator');

    // Generate a unique session ID if not exists
    if (!localStorage.getItem('voiceAgentSessionId')) {
        localStorage.setItem('voiceAgentSessionId', 'session-' + Date.now());
    }

    // Update session ID
    widget.setAttribute('session-id', localStorage.getItem('voiceAgentSessionId'));

    // Widget event listeners
    widget.addEventListener('conversationStarted', () => {
        statusIndicator.textContent = 'Listening';
        statusIndicator.classList.add('listening');
        pulseIndicator.classList.add('active');
    });

    widget.addEventListener('conversationEnded', () => {
        statusIndicator.textContent = 'Ready';
        statusIndicator.classList.remove('listening');
        pulseIndicator.classList.remove('active');
    });

    widget.addEventListener('error', (event) => {
        console.error('Widget error:', event.detail);
        statusIndicator.textContent = 'Error';
        statusIndicator.classList.remove('listening');
        pulseIndicator.classList.remove('active');
    });
}); 