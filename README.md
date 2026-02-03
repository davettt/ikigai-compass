# Ikigai Compass

A self-hosted ikigai discovery tool that helps you find your purpose through an interactive assessment and AI-powered analysis. All data stays on your device - complete privacy, zero hosting costs.

## What is Ikigai?

Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." It lies at the intersection of:
- What you love (your passion)
- What you're good at (your profession)  
- What the world needs (your mission)
- What you can be paid for (your vocation)

## Features

- **Interactive Assessment**: Select from comprehensive categories across all four ikigai quadrants
- **AI-Powered Analysis**: Uses Claude AI to generate personalized, actionable insights
- **Beautiful Reports**: Export as PDF or Markdown
- **100% Private**: Your API key, your data - everything stays local
- **History Tracking**: Save and review past ikigai analyses
- **PWA Support**: Install as a browser app on desktop or mobile

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ikigai-compass.git
cd ikigai-compass

# Install dependencies
npm install

# Setup your API key
cp .env.example .env
# Edit .env and add your Anthropic API key:
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# Run locally
npm run dev

# Or build for production
npm run build
npx serve dist
```

## Getting an API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Go to Settings → API Keys
4. Create a new key
5. Copy the key to your `.env` file

**Cost**: Each assessment costs approximately $0.01-0.02 using Claude Haiku.

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
├── local_data/         # Saved reports (gitignored)
├── .env                # API key (gitignored)
└── .env.example        # Template for .env
```

## How It Works

The app uses a local backend server to proxy Claude API requests, avoiding CORS issues with browser-based API calls. When you run `npm run dev`, both the backend server and Vite frontend start automatically:

- **Backend server**: Starts on port 3001 (or next available port up to 3010)
- **Frontend**: Starts on port 5173 and auto-discovers the backend

## Privacy & Security

- Your API key is stored in `.env` (never committed to git)
- All assessment data is stored in browser localStorage
- API calls go through your local server to Claude API only
- PDFs and reports are generated client-side

## Development

```bash
# Run both frontend and backend servers
npm run dev

# Run only the Vite frontend (for testing)
npm run dev:vite

# Run only the backend server
npm run server

# Type check
npx tsc --noEmit

# Build
npm run build

# Preview build
npm run preview
```

## License

MIT

## Contributing

This is a personal project, but feel free to fork and modify for your own use.
