# Ikigai Compass

A local Vite app that helps you discover your ikigai through an interactive assessment and AI-powered analysis using your own Claude API key.

## What is Ikigai?

Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." It lies at the intersection of:
- What you love (your passion)
- What you're good at (your profession)
- What the world needs (your mission)
- What you can be paid for (your vocation)

## Features

- **Interactive Assessment**: Select from comprehensive categories across all four ikigai quadrants, plus add your own custom entries
- **Life Context**: Tailor analysis to your journey stage (exploring, transitioning, established, reinventing, retiring)
- **Priority Weighting**: Adjust importance of each quadrant to reflect your values
- **Model Selection**: Choose between Haiku 3.5 (fast), Sonnet 4 (balanced), or Opus 4 (deep analysis)
- **Cultural Nuance**: Analysis incorporates authentic Japanese ikigai principles, not just the Western Venn diagram
- **Beautiful Reports**: Export as PDF or copy as Markdown
- **100% Private**: Your API key, your data - everything stays local
- **History Tracking**: Save and review past ikigai analyses

## Quick Start

```bash
# Clone the repository
git clone https://github.com/davettt/ikigai-compass.git
cd ikigai-compass

# Install dependencies
npm install

# Setup your API key
cp .env.example .env
# Edit .env and add your Anthropic API key:
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# Run locally
npm run dev
```

## Getting an API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Go to Settings → API Keys
4. Create a new key
5. Copy the key to your `.env` file

**Cost**: Each assessment costs approximately $0.01-0.05 depending on model choice (Haiku is cheapest, Opus most expensive).

## How It Works

The app uses a local backend server to proxy Claude API requests, avoiding CORS issues with browser-based API calls. When you run `npm run dev`, both servers start automatically:

- **Backend server**: Starts on port 3010 (or next available port up to 3020)
- **Frontend**: Starts on port 5173 and auto-discovers the backend

## Project Structure

```
ikigai-compass/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and storage services
│   ├── data/           # Ikigai category data
│   ├── types/          # TypeScript types
│   └── lib/            # Utility functions
├── server/             # Backend API proxy server
├── public/             # Static assets
├── .env                # API key (gitignored)
└── .env.example        # Template for .env
```

## Development

```bash
# Run both frontend and backend servers
npm run dev

# Run only the Vite frontend
npm run dev:vite

# Run only the backend server
npm run server

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment with PM2

For a more robust setup, use PM2 to manage the backend server:

```bash
# Install PM2 globally
npm install -g pm2

# Build the frontend
npm run build

# Start the backend server with PM2
pm2 start server/index.js --name ikigai-compass-api

# Serve the frontend (using serve or your preferred static server)
pm2 start npx --name ikigai-compass-web -- serve dist -l 5173

# Save PM2 process list (survives reboots)
pm2 save

# Enable PM2 startup on system boot
pm2 startup
```

### PM2 Management Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs ikigai-compass-api

# Restart server
pm2 restart ikigai-compass-api

# Stop server
pm2 stop ikigai-compass-api

# Delete from PM2
pm2 delete ikigai-compass-api
```

### PM2 Ecosystem File (Optional)

Create `ecosystem.config.cjs` for easier management:

```javascript
module.exports = {
  apps: [
    {
      name: 'ikigai-compass-api',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'ikigai-compass-web',
      script: 'npx',
      args: 'serve dist -l 5173',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

Then run: `pm2 start ecosystem.config.cjs`

## Privacy & Security

- Your API key is stored in `.env` (never committed to git)
- All assessment data is stored in browser localStorage
- API calls go through your local server to Claude API only
- PDFs and reports are generated client-side

## Personal Project Notice

This is a personal project maintained for my own use. You're welcome to:

- Fork and customize for your own needs
- Report bugs via GitHub Issues
- Reference the code for learning

I'm not actively reviewing pull requests or feature requests, as this keeps the project focused on my personal workflow.

## License

**MIT License with Commons Clause**

You are free to use, modify, and distribute this software for personal and non-commercial purposes. However, you may not sell, sublicense, or provide commercial hosting or services based on this software without explicit written permission from the copyright holder.

See [LICENSE](LICENSE) for full terms.
