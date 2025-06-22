const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error('❌ API_KEY environment variable is required');
    process.exit(1);
}

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// GET
// Proxy route for the scheduler API
app.get('/api/scheduler/list', async (req, res) => {
    try {
        const response = await fetch('https://prod.0codekit.com/operator/scheduler/list', {
            method: 'POST',
            headers: {
                'auth': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('Proxy request to scheduler API:', response.status);

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `API request failed with status ${response.status}` 
            });
        }


        const data = await response.json();
        console.log('Received data from scheduler API:', data);
        res.json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔑 Using API key from environment`);
});

module.exports = app;