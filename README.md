# PayBridge — AI Cross-Border Payment Agent

## Project Structure

```
paybridge/
├── frontend/          # React app (UI)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Helper functions
│   ├── package.json
│   └── index.html
│
├── backend/           # Node.js + Express API
│   ├── routes/           # API route handlers
│   ├── tools/            # Agent tool functions
│   ├── utils/            # Helpers
│   ├── server.js         # Entry point
│   └── package.json
│
└── agent/             # Claude AI agent logic
    ├── agent.js          # Main agent orchestrator
    ├── tools.js          # Tool definitions
    └── prompt.js         # System prompt
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # add your API keys
node server.js
# runs on http://localhost:3001
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
# runs on http://localhost:3000
```

## Environment Variables (backend/.env)
```
ANTHROPIC_API_KEY=your_claude_api_key
OPENEXCHANGE_APP_ID=your_free_app_id   # get free at openexchangerates.org
PORT=3001
```

## API Keys (free)
- Claude API: https://console.anthropic.com
- Exchange Rates: https://openexchangerates.org (free tier = 1000 req/month)

## Demo Flow
1. Open http://localhost:3000
2. Type: "I got a $10,000 invoice from a US client, I use HDFC Bank"
3. Agent fetches live rate → calculates savings → shows breakdown card
