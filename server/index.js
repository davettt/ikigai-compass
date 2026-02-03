import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from parent directory
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
// Start at 3010 to avoid common dev ports (3000-3009)
const DEFAULT_PORT = 3010;

// Enable CORS for all origins (safe for local development)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check - includes app identifier for auto-discovery
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'ikigai-compass' });
});

// Proxy Claude API calls - THIS IS THE IMPORTANT ROUTE
app.post('/api/claude', async (req, res) => {
  console.log('Received request to /api/claude');
  
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    console.log('API key not configured');
    return res.status(400).json({ 
      error: 'API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file' 
    });
  }

  try {
    const { prompt, model } = req.body;
    const selectedModel = model || 'claude-3-5-haiku-20241022';
    console.log(`Calling Claude API with model: ${selectedModel}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Claude API error:', response.status, errorText);
      let errorMessage = `API Error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    console.log('Claude API success');
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Catch-all for debugging 404s
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

const MAX_PORT = 3020;
const HOST = '0.0.0.0'; // Bind to all IPv4 interfaces for proper port conflict detection

// Try to start server, recursively trying next port if busy
const tryStartServer = (port) => {
  if (port > MAX_PORT) {
    console.error(`Failed to start server: No available ports between ${DEFAULT_PORT} and ${MAX_PORT}`);
    process.exit(1);
  }

  const server = app.listen(port, HOST);

  server.on('listening', () => {
    console.log(`✓ Ikigai Compass server running on http://localhost:${port}`);
    console.log(`✓ API proxy ready at http://localhost:${port}/api/claude`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      tryStartServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

tryStartServer(DEFAULT_PORT);
