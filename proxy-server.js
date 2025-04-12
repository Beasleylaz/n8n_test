const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Add a test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ status: 'ok', message: 'Proxy server is running correctly!' });
});

// Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    console.log('=== Webhook Request Details ===');
    console.log(`Target URL: ${targetUrl}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    // Format the request body for n8n
    const webhookData = {
      json: req.body,
      headers: req.headers,
      query: req.query,
      timestamp: new Date().toISOString()
    };
    
    const response = await axios.post(targetUrl, webhookData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-webhook-proxy',
        'X-Webhook-Source': 'proxy-server'
      },
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    console.log('=== Webhook Response Details ===');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('=== Webhook Error Details ===');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    
    // Handle n8n specific errors
    if (error.response && error.response.status === 404) {
      console.error('n8n webhook not found or inactive');
      return res.status(404).send({ 
        error: 'Webhook not found', 
        message: 'The n8n webhook does not exist or the workflow is not active.',
        details: 'Please check if the webhook node is activated in your n8n workflow.'
      });
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. The n8n server might be slow or unreachable.');
      return res.status(504).send({
        error: 'Gateway Timeout',
        message: 'The request to n8n timed out. The server might be slow or unreachable.',
        details: error.message
      });
    }
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Network error. The n8n server might be down or unreachable.');
      return res.status(503).send({
        error: 'Service Unavailable',
        message: 'The n8n server is currently unreachable. Please try again later.',
        details: error.message
      });
    }
    
    res.status(500).send({ 
      error: error.message,
      details: error.response ? error.response.data : 'No response data available'
    });
  }
});

// Add a root endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Proxy server is running' });
});

app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`Proxy server running at http://localhost:${port}`);
    console.log(`Test the server at http://localhost:${port}/test`);
}); 