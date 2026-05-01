<div align="center">

# 🎨 SWARM OS — Frontend

### Real-Time Multi-Agent Dashboard with AI-Native Dark Theme

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Live](https://img.shields.io/badge/Live-Vercel-000?style=for-the-badge&logo=vercel)](https://frontend-six-steel-45.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](../LICENSE)

</div>

---

## Overview

The SWARM OS frontend is a **React 18 + TypeScript** single-page application built with **Vite 5**. It provides a rich, real-time dashboard for interacting with the multi-agent deliberation pipeline, monitoring agent performance, breeding agents, running tournaments, and visualizing cross-chain activity.

**Live at:** [frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app)

> **Demo Mode:** The frontend ships with a built-in demo simulation layer. If the backend is unreachable (e.g., on the Vercel deployment), all 8 tabs automatically fall back to realistic demo data. No backend required to explore the UI.

---

## Features

| Tab | Component | Description |
|-----|-----------|-------------|
| **Overview** | `LandingPage` | Business narrative, market data, architecture visualization |
| **Deliberate** | `DeliberationPanel` | Submit prompts, watch 5-stage pipeline in real-time |
| **Agents** | `AgentMonitor` | Live agent performance cards with success rates |
| **Gallery** | `Gallery` | Agent iNFTs with 6 genetic traits and breeding UI |
| **Arena** | `ArenaPanel` | Competitive elimination tournaments |
| **Cross-Chain** | `CrossChainDashboard` | Multi-chain visualization, bridge status, global leaderboard |
| **History** | `SessionHistory` | Past deliberation sessions with replay |
| **Statistics** | `SystemStats` | System-wide health metrics and analytics |

### Additional UI Components

| Component | Purpose |
|-----------|---------|
| `VerificationBadge` | Displays 0G Compute TEE proof, confidence scores, explorer links |
| `VerdictPanel` | Critic scoring breakdown (feasibility, safety, legality, cost) |
| `ExecutorPanel` | Execution result with tx hash, gas cost, proof hash |
| `BreedingModal` | Genetic crossover UI with trait preview |
| `TraitsDisplay` | Animated trait bar visualization |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        VITE DEV SERVER (port 3000)                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  App.tsx                                                      │  │
│  │  ├── Tab Router (8 tabs)                                      │  │
│  │  ├── State management (React hooks)                           │  │
│  │  └── WebSocket listener (real-time events)                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ components/  │  │ services/    │  │ styles/                  │ │
│  │ ──────────── │  │ ──────────── │  │ ────────────────────────  │ │
│  │ 13 React     │  │ api.ts       │  │ Tailwind CSS +           │ │
│  │ components   │  │ websocket.ts │  │ Custom glassmorphism     │ │
│  │ (TSX)        │  │ demo-mode.ts │  │ design system            │ │
│  │              │  │ blockchain.ts│  │                          │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Vite Proxy → Backend at localhost:5000                       │  │
│  │  /api/*  → REST API                                           │  │
│  │  /socket.io/* → WebSocket                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | ≥ 18.0.0 |
| **npm** | ≥ 8.x |

---

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

The app starts at `http://localhost:3000` with hot-module replacement.

> **Note:** In development, the Vite proxy forwards all `/api/*` requests to `localhost:5000`, so no explicit API URL is needed unless connecting to a remote backend.

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
# For local dev: leave unset (Vite proxy handles it)
# For production: set to your deployed backend URL
VITE_API_URL=http://localhost:5000

# WebSocket URL (auto-derived from VITE_API_URL if not set)
# VITE_WS_URL=ws://localhost:5000
```

> **Security:** All `.env` files are listed in `.gitignore`. Only `.env.example` is committed.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR (port 3000) |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check on `src/` |

---

## Component Reference

### LandingPage

The overview tab with business narrative, market data, and architecture visualization. Serves as the entry point for judges and new users.

### DeliberationPanel

The primary interaction surface. Users submit prompts and watch the 5-stage pipeline execute in real-time:

1. **Planner** — plan decomposition
2. **Researcher** — evidence gathering
3. **Critic** — multi-dimensional scoring
4. **0G Verify** — TEE computation proof
5. **Executor** — final result

Each stage updates via WebSocket events with animated transitions powered by Framer Motion.

### VerificationBadge

Displays 0G Compute verification results with:

- Confidence percentage (0–100%)
- TEE verification status badge
- SHA-256 cryptographic proof hash (with copy button)
- 4-dimension verification scores (Feasibility, Safety, Legality, Cost)
- Clickable links to 0G Galileo block explorer
- Verification source indicator (`0G Router API (TEE)`)

### VerdictPanel

Critic evaluation breakdown:

| Dimension | Score Range |
|-----------|-------------|
| Feasibility | 0–100 |
| Safety | 0–100 |
| Legality | 0–100 |
| Cost Efficiency | 0–100 |
| **Overall** | Weighted composite |

Includes decision recommendation and detailed feedback text.

### ExecutorPanel

Execution result display:

- Transaction hash (clickable to explorer)
- Gas used
- Cost in USD
- Block number
- Verification proof hash

### AgentMonitor

Real-time agent performance cards showing:

- Success rate (percentage)
- Total tasks processed
- Average response time
- Current status (idle / working / error)

### Gallery

Agent iNFT gallery with 6 genetic traits per agent:

- Intelligence, Creativity, Speed, Accuracy, Resilience, Adaptability
- Visual trait bar charts via `TraitsDisplay`
- Breeding compatibility preview
- Triggers `BreedingModal` for crossover operations

### BreedingModal

Interactive breeding interface:

- Parent selection (two agents)
- Compatibility score display
- Predicted offspring traits (via `/api/breeding/predict`)
- Breed action with animated result

### ArenaPanel

Tournament control panel:

- Start standard or custom-prompt tournaments
- Real-time elimination bracket visualization
- Leaderboard with sortable rankings
- Tournament history with detailed round-by-round results

### CrossChainDashboard

Multi-chain coordination visualization:

- Chain status indicators (0G, Ethereum Sepolia, Polygon Mumbai)
- Bridge message feed
- Cross-chain agent activity
- Global leaderboard with per-chain scores

### SessionHistory

Paginated list of past deliberation sessions with:

- Prompt preview
- Timestamp
- Verification status
- Click-to-expand full session details

### SystemStats

System-wide analytics dashboard:

- Total deliberations
- Agent uptime
- Average confidence scores
- Verification success rate
- Storage usage metrics

---

## Services

### `api.ts` — REST Client

Axios-based HTTP client for all backend REST endpoints.

```typescript
import { createDeliberation, getSession, getAgents } from './services/api';

// Start a deliberation
const response = await createDeliberation("Create governance proposal", "simulation");
// response.session_id

// Fetch session state
const session = await getSession(sessionId);
// session.plan, session.evidence, session.verdict, session.verification, session.execution
```

### `websocket.ts` — WebSocket Manager

Singleton WebSocket client with automatic reconnection.

```typescript
import WebSocketManager from './services/websocket';

const ws = WebSocketManager.getInstance();
ws.connect();

ws.on('compute_verified', (data) => {
  // data.confidence: 0–100
  // data.proof: SHA-256 hash string
  // data.verified: boolean
});

ws.on('executor_complete', (data) => {
  // data.tx_hash, data.gas_used, data.cost_usd
});
```

### `demo-mode.ts` — Offline Simulation

Automatic fallback when the backend is unreachable. Generates realistic mock data for all 8 tabs including:

- Simulated deliberation pipelines with timed agent responses
- Pre-populated agent stats and trait distributions
- Mock tournament results
- Fake cross-chain bridge messages
- Demo verification proofs

This ensures the app is fully interactive for demo purposes (e.g., Vercel deployment, hackathon judging) without a running backend.

### `blockchain.ts` — Chain Integration

Client-side utilities for blockchain interaction (explorer link generation, address formatting, chain metadata).

---

## Design System

### Theme

Ultra-dark AI-native aesthetic with glassmorphism effects:

```
Background:        Dark gradient (#0a0a0f → #1a1a2e)
Cards:             Glass panels with backdrop-blur
Primary accent:    #3B82F6 (blue)
Secondary accent:  #8B5CF6 (purple)
Success:           #10B981 (green)
Warning:           #F59E0B (amber)
Error:             #EF4444 (red)
```

### Typography

System font stack optimized for readability on dark backgrounds.

### Animations

All transitions are powered by **Framer Motion**:

- Page tab transitions (slide + fade)
- Card entrance animations (staggered)
- Deliberation pipeline progress (sequential reveal)
- Trait bar charts (spring-based width animations)
- Hover micro-interactions (scale + glow)

### Icons

[Lucide React](https://lucide.dev) icon set for consistent, lightweight iconography.

---

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx                          # Main app shell with 8-tab router
│   ├── main.tsx                         # ReactDOM entry point
│   ├── index.css                        # Global styles + design tokens
│   ├── vite-env.d.ts                    # Vite TypeScript declarations
│   ├── components/
│   │   ├── LandingPage.tsx              # Overview / business narrative
│   │   ├── DeliberationPanel.tsx        # 5-stage pipeline UI
│   │   ├── AgentMonitor.tsx             # Agent performance cards
│   │   ├── Gallery.tsx                  # Agent iNFT gallery
│   │   ├── ArenaPanel.tsx               # Tournament system
│   │   ├── CrossChainDashboard.tsx      # Multi-chain visualization
│   │   ├── BreedingModal.tsx            # Genetic crossover modal
│   │   ├── VerdictPanel.tsx             # Critic score breakdown
│   │   ├── VerificationBadge.tsx        # 0G proof display
│   │   ├── ExecutorPanel.tsx            # Execution results
│   │   ├── SessionHistory.tsx           # Past sessions
│   │   ├── SystemStats.tsx              # System metrics
│   │   └── TraitsDisplay.tsx            # Trait bar charts
│   ├── services/
│   │   ├── api.ts                       # Axios REST client
│   │   ├── websocket.ts                 # WebSocket manager (singleton)
│   │   ├── demo-mode.ts                 # Offline demo data generator
│   │   └── blockchain.ts               # Chain utilities
│   └── styles/
│       └── ...                          # Additional style modules
├── dist/                                # Production build output
├── index.html                           # HTML shell
├── vite.config.ts                       # Vite config + dev proxy
├── tsconfig.json                        # TypeScript config
├── tsconfig.node.json                   # Node-specific TS config
├── tailwind.config.js                   # Tailwind CSS config
├── postcss.config.js                    # PostCSS config
├── .eslintrc.json                       # ESLint rules
├── vercel.json                          # Vercel deployment config
├── package.json                         # Dependencies and scripts
├── .env.example                         # Environment template
└── .gitignore
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18.2 |
| **Language** | TypeScript | 5.3 |
| **Build Tool** | Vite | 5.x |
| **Styling** | Tailwind CSS | 3.3 |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Lucide React | 0.294 |
| **HTTP** | Axios | 1.6 |
| **Date Utils** | date-fns | 2.30 |
| **Linting** | ESLint + TypeScript parser | 8.x |

---

## Production Deployment

### Build

```bash
npm run build
```

Produces an optimized static bundle in `dist/`.

### Deploy to Vercel

The project includes a [`vercel.json`](vercel.json) configuration:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Deploy via the Vercel CLI or GitHub integration:

```bash
npx vercel --prod
```

> **Important:** Set `VITE_API_URL` in your Vercel environment variables to point at your production backend. If no backend is available, the app will automatically activate demo mode.

### Deploy to Other Platforms

The `dist/` folder is a static site. Deploy to any static host:

```bash
# Netlify
npx netlify deploy --dir=dist --prod

# Cloudflare Pages
npx wrangler pages publish dist

# Nginx
cp -r dist/* /var/www/html/
```

---

## Vite Dev Proxy

The development server proxies API requests to avoid CORS issues:

| Path | Target |
|------|--------|
| `/api/*` | `http://localhost:5000` |
| `/socket.io/*` | `ws://localhost:5000` (WebSocket) |

This is configured in [`vite.config.ts`](vite.config.ts) and only applies during `npm run dev`.

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ 90+ |
| Firefox | ✅ 90+ |
| Safari | ✅ 15+ |
| Mobile Chrome / Safari | ✅ Responsive layout |

---

## Troubleshooting

### Blank page after build

- Open DevTools (`F12`) → Console for errors
- Verify `VITE_API_URL` is set correctly
- Check that `index.html` references the correct asset paths

### WebSocket connection failed

- Verify the backend is running on port 5000
- Check CORS headers on the backend
- The frontend will automatically switch to demo mode

### Slow HMR / Dev server

- Clear `node_modules/.vite` cache: `rm -rf node_modules/.vite`
- Restart the dev server

### TypeScript errors on build

```bash
# Check for type errors without building
npx tsc --noEmit
```

### Demo mode activating unexpectedly

Demo mode activates when `/api/health` returns an error. Verify:

```bash
curl http://localhost:5000/api/health
```

---

## License

MIT — see [LICENSE](../LICENSE) for details.

---

<div align="center">

Part of the [SWARM OS](../README.md) ecosystem · Deployed on [Vercel](https://vercel.com) · Powered by [0G Network](https://0g.ai)

</div>
