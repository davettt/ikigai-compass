# Ikigai Compass

A local Vite app that helps you discover your ikigai through an interactive assessment and AI-powered analysis using your own Claude API key.

## What is Ikigai?

Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." It lies at the intersection of:
- What you love (your passion)
- What you're good at (your profession)
- What the world needs (your mission)
- What you can be paid for (your vocation)

## Features

- **Comprehensive Assessment**: 190+ curated options across 30+ categories covering all four ikigai quadrants, plus custom entries
- **Guided Experience**: Detailed instructions on each assessment screen help you make thoughtful selections
- **Life Context**: Tailor analysis to your journey stage (exploring, transitioning, established, reinventing, retiring)
- **Priority Weighting**: Adjust importance of each quadrant to reflect your values
- **Model Selection**: Choose between Haiku 3.5 (fast), Sonnet 4 (balanced), or Opus 4 (deep analysis)
- **Cultural Nuance**: Analysis incorporates authentic Japanese ikigai principles, not just the Western Venn diagram
- **Beautiful Reports**: Export as PDF or copy as Markdown
- **History Management**: View, rename, and manage your saved analyses
- **100% Private**: Your API key, your data - everything stays local
- **Persistent History**: Reports saved to local files for reliable storage

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
│   ├── utils/          # Utility functions
│   └── lib/            # Helper functions
├── server/             # Backend API proxy server
├── public/             # Static assets and PWA icons
├── local_data/         # Persistent storage (gitignored)
│   └── reports/        # Saved ikigai reports
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

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality Scripts

```bash
# Run all checks (typecheck + lint + format)
npm run check

# Run all checks with auto-fix
npm run check:fix

# Individual commands
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier format
npm run format:check     # Prettier check only
npm run audit            # Security vulnerability scan
npm run audit:fix        # Auto-fix security issues
```

## Production Deployment with PM2

For a more robust setup, use PM2 to manage the server:

```bash
# Install PM2 globally
npm install -g pm2

# Build the frontend
npm run build

# Start with PM2 (serves both API and frontend)
NODE_ENV=production pm2 start server/index.js --name ikigai-compass

# Save PM2 process list (survives reboots)
pm2 save

# Enable PM2 startup on system boot
pm2 startup
```

In production mode (`NODE_ENV=production`), the server serves both the API and the built frontend from the `dist/` folder on a single port.

### PM2 Management Commands

```bash
pm2 list                    # View running processes
pm2 logs ikigai-compass     # View logs
pm2 restart ikigai-compass  # Restart server
pm2 stop ikigai-compass     # Stop server
pm2 delete ikigai-compass   # Remove from PM2
```

### PM2 Ecosystem File (Optional)

Create `ecosystem.config.cjs` for easier management:

```javascript
module.exports = {
  apps: [
    {
      name: 'ikigai-compass',
      script: 'server/index.js',
      cwd: './ikigai-compass',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
};
```

Then run: `pm2 start ecosystem.config.cjs`

## Privacy & Security

- Your API key is stored in `.env` (never committed to git)
- Reports are stored locally in `local_data/reports/` (gitignored)
- Current assessment progress stored in browser localStorage
- API calls go through your local server to Claude API only
- PDFs and reports are generated client-side
- Input sanitization prevents prompt injection attacks

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
