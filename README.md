# Voice Agent Interface with n8n Integration

A lightweight web app that integrates an ElevenLabs voice agent and connects with n8n.

## Setup Instructions

### 1. Start the Proxy Server

The proxy server helps bypass CORS issues when communicating with n8n.

```bash
# Install dependencies
npm install

# Start the proxy server
npm start
```

The proxy server will run on http://localhost:3000.

### 2. Start the Web App

In a separate terminal, start the web app using Python's HTTP server:

```bash
python -m http.server 8000
```

The web app will be available at http://localhost:8000.

### 3. Configure n8n

Make sure your n8n workflow is active and the webhook node is properly configured.

## Features

- ElevenLabs voice agent integration
- Pulsing indicator for voice activity
- n8n webhook integration
- Clean, modern UI

## Troubleshooting

If you encounter issues with the n8n webhook:

1. Check that your n8n workflow is active
2. Verify the webhook URL in script.js matches your n8n webhook URL
3. Check the console for error messages
4. Make sure both the proxy server and web app are running 