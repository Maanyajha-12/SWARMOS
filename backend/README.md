<div align="center">

# 🧠 SWARM OS — Backend

### Multi-Agent Orchestration Server with 0G Compute Verification

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](../LICENSE)

</div>

---

## Overview

The SWARM OS backend is a **Node.js + Express + TypeScript** server that orchestrates four specialized AI agents through a structured deliberation pipeline. It integrates with **0G Compute** for TEE-verified inference, **0G Storage** (KV + Log) for persistent state, and broadcasts real-time progress over **WebSocket**.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER (port 5000)                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  SwarmOrchestrator                            │  │
│  │                                                              │  │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  │   │ Planner  │──│Researcher│──│  Critic  │──│ Executor │    │  │
│  │   │ (Claude) │  │ (Claude) │  │ (Claude) │  │ (Claude) │    │  │
│  │   └──────────┘  └──────────┘  └──────────┘  └──────────┘    │  │
│  │         │              │             │             │          │  │
│  │         └──────────────┴─────────────┴─────────────┘          │  │
│  │                        WebSocket Events                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │ Breeding       │  │ Cross-Chain   │  │ Proof-of-Intelligence│  │
│  │ Engine         │  │ Bridge +      │  │ Consensus Engine     │  │
│  │ (Genetic       │  │ Leaderboard   │  │ (Commit-Reveal)      │  │
│  │  Crossover)    │  │               │  │                      │  │
│  └────────────────┘  └───────────────┘  └──────────────────────┘  │
│                                                                    │
│  ┌────────────────┐  ┌───────────────┐                            │
│  │ ComputeVerifier│  │ OGStorage     │                            │
│  │ (0G TEE)       │  │ (KV + Log)    │                            │
│  └────────────────┘  └───────────────┘                            │
└────────────────────────────────────────────────────────────────────┘
```

### Deliberation Pipeline

Each deliberation flows through five sequential stages:

```
User Prompt → Planner → Researcher → Critic → 0G Compute Verify → Executor
     │            │           │          │            │              │
     │       WebSocket   WebSocket  WebSocket    WebSocket     WebSocket
     │       event       event      event        event         event
     └────────────────────────────────────────────────────────────────┘
                              ↓
                    Session stored in 0G KV
                    Audit log appended to 0G Log
```

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | ≥ 18.0.0 | Enforced in `package.json` `engines` |
| **npm** | ≥ 8.x | Comes with Node.js |
| **Anthropic API Key** | — | Required for Claude-based agent inference |

---

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables) below).

### 3. Start Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000` with auto-reload via `ts-node`.

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ─── REQUIRED ─────────────────────────────────────────────
# Anthropic API key for Claude-based agent inference
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# ─── SERVER ───────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── 0G COMPUTE (TEE-Verified Inference) ─────────────────
# Router API endpoint — OpenAI-compatible interface
OG_COMPUTE_ENDPOINT=https://router-api-testnet.integratenetwork.work/v1
OG_COMPUTE_ROUTER_API_KEY=your_router_api_key_here
OG_COMPUTE_MODEL=deepseek-chat-v3

# ─── 0G STORAGE (Optional — falls back to in-memory) ─────
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081

# ─── BLOCKCHAIN (Optional — for smart contract calls) ────
RPC_URL=https://evmrpc-testnet.0g.ai
PRIVATE_KEY=0x...
DELIBERATION_INFT_ADDRESS=0x...
```

> **Security:** All `.env` files are listed in `.gitignore`. Never commit real API keys.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with `ts-node` (auto-reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build from `dist/` |
| `npm test` | Run test suite with Jest |

---

## API Reference

All endpoints return JSON. Base URL: `http://localhost:5000`

### Core Deliberation

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/deliberate` | Start a new deliberation session | `{ prompt: string, mode?: "simulation" \| "execution" }` |
| `GET` | `/api/sessions` | List all deliberation sessions | — |
| `GET` | `/api/session/:id` | Get a specific session with full pipeline state | — |

### Agent Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | All agent performance statistics |
| `GET` | `/api/stats` | System-wide aggregate statistics |
| `GET` | `/api/health` | Health check (returns server status, uptime, version) |

### Gallery & Breeding

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `GET` | `/api/gallery/agents` | All agents with trait profiles | — |
| `POST` | `/api/breeding/breed` | Breed two agents | `{ parent1Id: string, parent2Id: string }` |
| `GET` | `/api/breeding/predict/:p1/:p2` | Preview offspring trait distribution | — |
| `GET` | `/api/breeding/history` | Full breeding log | — |

### Arena & Tournaments

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/arena/tournament` | Run a standard tournament | — |
| `POST` | `/api/arena/custom-tournament` | Tournament with custom prompt | `{ prompt: string }` |
| `GET` | `/api/arena/leaderboard` | Agent rankings by score | — |
| `GET` | `/api/arena/history` | Tournament history | — |
| `GET` | `/api/arena/stats` | Arena aggregate statistics | — |

### Cross-Chain

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `GET` | `/api/cross-chain/status` | Bridge status and chain info | — |
| `GET` | `/api/cross-chain/chains` | Supported chains list | — |
| `GET` | `/api/cross-chain/messages` | Recent bridge messages | — |
| `POST` | `/api/cross-chain/send` | Send a cross-chain message | `{ destChain: number, payload: object }` |
| `GET` | `/api/cross-chain/leaderboard` | Global multi-chain rankings | — |

### Proof-of-Intelligence

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/poi/run` | Execute a PoI consensus round | `{ prompt: string }` |
| `GET` | `/api/poi/history` | Consensus round history | — |
| `GET` | `/api/poi/stats` | PoI statistics | — |

### 0G Storage

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `GET` | `/api/0g/kv/:key` | Read from 0G KV store | — |
| `POST` | `/api/0g/kv/:key` | Write to 0G KV store | `{ value: any }` |
| `GET` | `/api/0g/log/:name` | Read from 0G Log | — |
| `POST` | `/api/0g/log/:name` | Append to 0G Log | `{ entry: any }` |

---

## WebSocket Events

Connect to `ws://localhost:5000` to receive real-time deliberation progress.

### Events Emitted

| Event | Payload | Trigger |
|-------|---------|---------|
| `planner_complete` | `{ plan: string, sessionId: string }` | Planner agent finishes |
| `researcher_complete` | `{ evidence: string, sessionId: string }` | Researcher agent finishes |
| `critic_complete` | `{ verdict: object, sessionId: string }` | Critic agent finishes |
| `compute_verified` | `{ confidence: number, proof: string, verified: boolean }` | 0G Compute verification completes |
| `executor_complete` | `{ result: string, tx_hash: string, gas_used: number }` | Executor agent finishes |
| `inft_minted` | `{ tokenId: number, sessionId: string }` | iNFT minted on-chain |

### Example Client

```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`[${data.type}]`, data);

  switch (data.type) {
    case 'planner_complete':
      console.log('Plan:', data.plan);
      break;
    case 'compute_verified':
      console.log(`Verified: ${data.verified}, Confidence: ${data.confidence}%`);
      console.log(`Proof: ${data.proof}`);
      break;
    case 'executor_complete':
      console.log('Execution complete:', data.result);
      break;
  }
};
```

---

## Core Modules

### `agents.ts` — SwarmOrchestrator

The central orchestrator that coordinates all four AI agents through the deliberation pipeline.

- **Planner**: Decomposes the user prompt into actionable steps
- **Researcher**: Validates feasibility and gathers supporting evidence
- **Critic**: Evaluates the plan across four dimensions (feasibility, safety, legality, cost efficiency)
- **Executor**: Produces the final execution result

Each agent calls the **Anthropic Claude API** independently. Responses are streamed to connected WebSocket clients.

### `compute-verifier.ts` — ComputeVerifier

Interfaces with the **0G Compute Router API** for TEE-verified inference.

| Method | Description |
|--------|-------------|
| `verifyDecision(deliberation)` | Send to 0G Compute for TEE verification |
| `verifyDecisionSimulated()` | Local fallback when 0G is unavailable |
| `healthCheck()` | Check 0G Compute endpoint status |

Generates **SHA-256 proof hashes** from the full deliberation payload, creating a tamper-evident record.

### `og-storage.ts` — OGStorage

Dual-mode storage interface — connects to **0G KV + Log** when available, transparently falls back to **in-memory maps** when endpoints are unreachable.

| Method | Description |
|--------|-------------|
| `kvGet(key)` | Read from KV store |
| `kvSet(key, value)` | Write to KV store |
| `logAppend(name, entry)` | Append to named log |
| `logRead(name)` | Read full log contents |

### `breeding.ts` — Breeding Engine

Genetic crossover system for agent evolution.

- **Trait inheritance**: Random weighted selection from parent trait pools
- **Mutation**: ±5 random variation per trait on each breeding event
- **Compatibility scoring**: Pre-calculated compatibility between agent pairs

### `cross-chain/bridge.ts` — Cross-Chain Bridge

Simulated multi-chain message relay supporting Ethereum Sepolia, Polygon Mumbai, and 0G Galileo.

### `cross-chain/leaderboard.ts` — Global Leaderboard

Multi-chain score aggregation with per-chain rankings and global composite scoring.

### `consensus/proof-of-intelligence.ts` — PoI Engine

Server-side implementation of the commit-reveal consensus protocol:

1. Agents independently generate decisions
2. Decisions are hashed and committed
3. After all commits, decisions are revealed
4. Consensus score calculated based on agreement
5. Divergence detection when agreement falls below threshold

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts                        # Express server, routes, WebSocket setup
│   ├── agents.ts                       # 4 AI agents + SwarmOrchestrator
│   ├── breeding.ts                     # Genetic crossover breeding engine
│   ├── traits.ts                       # Agent trait definitions and management
│   ├── compute-verifier.ts             # 0G Compute TEE verification client
│   ├── og-storage.ts                   # 0G KV/Log with in-memory fallback
│   ├── cross-chain/
│   │   ├── bridge.ts                   # Cross-chain message bridge
│   │   └── leaderboard.ts             # Global multi-chain leaderboard
│   └── consensus/
│       └── proof-of-intelligence.ts    # Commit-reveal PoI engine
├── dist/                               # Compiled JavaScript output
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── .env                                # Local environment (gitignored)
└── .gitignore
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | ≥ 18.0.0 |
| **Language** | TypeScript | 5.x |
| **Framework** | Express | 4.x |
| **WebSocket** | ws | 8.x |
| **AI Provider** | Anthropic Claude (`@anthropic-ai/sdk`) | 0.24.x |
| **AI Fallback** | OpenAI SDK (0G Compute) | 6.x |
| **HTTP Client** | Axios | 1.x |
| **Env Config** | dotenv | 16.x |

---

## Production Deployment

### Build

```bash
npm run build
```

Compiles TypeScript to `dist/` with target `ES2020` and `commonjs` modules.

### Run

```bash
# Direct
NODE_ENV=production npm start

# With PM2 (recommended)
pm2 start npm --name "swarmos-backend" -- start

# With PM2 ecosystem file
pm2 start ecosystem.config.js
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "uptime": 12345,
  "version": "1.0.0",
  "agents": 4,
  "sessions": 0
}
```

---

## CORS Configuration

The backend uses the `cors` package with permissive defaults for development. For production, configure allowed origins:

```typescript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
}));
```

---

## Troubleshooting

### Port already in use

```bash
lsof -i :5000
kill -9 <PID>
```

### 0G Compute not connecting

```bash
# Verify the endpoint is reachable
curl https://router-api-testnet.integratenetwork.work/v1/models \
  -H "Authorization: Bearer $OG_COMPUTE_ROUTER_API_KEY"
```

The system will automatically fall back to simulated verification if 0G Compute is unavailable.

### 0G Storage not connecting

The backend transparently falls back to in-memory storage. Check logs for:

```
[OGStorage] Falling back to in-memory storage
```

### Debug WebSocket

```javascript
// In browser console
const ws = new WebSocket('ws://localhost:5000');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onerror = (e) => console.error('WebSocket error:', e);
```

---

## License

MIT — see [LICENSE](../LICENSE) for details.

---

<div align="center">

Part of the [SWARM OS](../README.md) ecosystem · Powered by [Anthropic Claude](https://anthropic.com) & [0G Network](https://0g.ai)

</div>
