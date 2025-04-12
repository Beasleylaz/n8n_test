const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    console.log(`Proxying request to: ${targetUrl}`);
    console.log('Request body:', req.body);
    
    // Add more detailed request logging
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'User-Agent': 'n8n-webhook-proxy'
    });
    
    const response = await axios.post(targetUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-webhook-proxy'
      },
      // Add timeout and validate status
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all responses to handle them properly
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Handle 404 errors specifically
    if (error.response && error.response.status === 404) {
      console.error('Webhook URL not found. Please check your n8n workflow configuration.');
      return res.status(404).send({ 
        error: 'Webhook URL not found', 
        message: 'The webhook URL does not exist or the n8n workflow is not active.',
        details: error.message
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

// Add a test endpoint
app.get('/test', (req, res) => {
  res.send('Proxy server is running correctly!');
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log(`Test the server at http://localhost:${port}/test`);
}); 