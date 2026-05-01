<div align="center">

# 🤖 SWARMOS

### Trustless Multi-Agent AI Decision-Making for the Multi-Chain Future

[![Built on 0G](https://img.shields.io/badge/Built%20on-0G%20Network-10b981?style=for-the-badge)](https://0g.ai)
[![Live Demo](https://img.shields.io/badge/Live-Vercel-000?style=for-the-badge&logo=vercel)](https://frontend-six-steel-45.vercel.app)
[![Contracts](https://img.shields.io/badge/Contracts-5%20on%20Galileo-blue?style=for-the-badge)](DEPLOYMENT_PROOF.md)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**SWARM OS orchestrates autonomous AI agent swarms across multiple blockchains. Every decision is verified through 0G Compute TEE and recorded on-chain with cryptographic proof.**

🌐 **Live Demo**: [frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app) · 🔗 **On-Chain Proof**: [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md) · 🎬 **Demo Guide**: [DEMO_GUIDE.md](DEMO_GUIDE.md)

</div>

---

## 🌟 What is SWARM OS?

SWARM OS is a **multi-agent deliberation system** where four specialized AI agents independently analyze decisions through a structured pipeline, verify results through **0G Compute TEE**, and record outcomes as **on-chain iNFTs** with cryptographic proofs.

### The Problem
AI agents make **$2.3 trillion** in automated decisions annually. **Zero are independently verifiable.**

### Our Solution
Multi-agent consensus with cryptographic proof — 4 agents analyze independently, commit-reveal prevents collusion, 0G TEE provides verification, and everything goes on-chain.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Multi-Agent Deliberation** | 4 specialized agents (Planner → Researcher → Critic → Executor) analyze every decision |
| 🛡️ **Proof-of-Intelligence** | Novel commit-reveal consensus — agents commit hashed decisions before revealing |
| 🔐 **0G Compute Verification** | TEE-verified inference with SHA-256 proof hashes |
| 💾 **0G Storage** | KV + Log storage for persistent state (with in-memory fallback) |
| 🧬 **Agent Evolution** | Top agents breed offspring with genetic crossover and ±5 mutation |
| ⚔️ **Arena Tournaments** | Competitive elimination where agents evolve through competition |
| 🌐 **Cross-Chain Swarms** | Agents operate across Ethereum, Polygon, and 0G Chain |
| 📊 **Global Leaderboard** | Multi-chain score aggregation with per-chain rankings |
| 🎭 **Demo Mode** | Full offline simulation — works without backend for judges |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vite + React)                 │
│  Overview → Deliberate → Agents → Gallery → Arena           │
│  Cross-Chain → History → Statistics                         │
│  Framer Motion animations · Ultra-dark AI-native theme      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                   BACKEND (Node.js + Express)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Planner  │ │Researcher│ │  Critic  │ │ Executor │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴────────────┴─────────────┘            │
│  ┌─────────────┐ ┌───────────────┐ ┌──────────────────┐    │
│  │  Breeding   │ │  Cross-Chain  │ │ Proof-of-Intel.  │    │
│  │  Engine     │ │  Bridge       │ │ Consensus        │    │
│  └─────────────┘ └───────────────┘ └──────────────────┘    │
└────────────┬──────────────┬──────────────┬──────────────────┘
             │              │              │
    ┌────────┴──────┐  ┌────┴────┐  ┌──────┴──────┐
    │  0G Compute   │  │ 0G KV   │  │  0G Log     │
    │  TEE Verify   │  │ Storage │  │  Append     │
    └───────────────┘  └─────────┘  └─────────────┘
             │
    ┌────────┴──────────────────────────────────────┐
    │              SMART CONTRACTS (Solidity)        │
    │  AgentRegistry · CrossChainBridge             │
    │  TournamentArena · ProofOfIntelligence        │
    │  CrossChainBreeding                           │
    └───────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Foundry (optional, for contracts)

### 1. Clone

```bash
git clone https://github.com/Maanyajha-12/SWARMOS.git
cd SWARMOS
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit .env and add your ANTHROPIC_API_KEY
npm run dev
```

Backend starts at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:3000`.

> **Note:** The frontend has a built-in **demo mode** — if the backend is unreachable (e.g., on Vercel), all tabs automatically fall back to realistic demo data. No backend required to explore the UI.We can connect the backend to platforms like render in future.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# REQUIRED
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# Server
PORT=5000
NODE_ENV=development

# 0G Storage — optional, uses in-memory fallback if not set
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081

# 0G Compute — Router API (TEE-verified inference)
OG_COMPUTE_ENDPOINT=https://router-api-testnet.integratenetwork.work/v1
OG_COMPUTE_ROUTER_API_KEY=your_router_api_key_here
OG_COMPUTE_MODEL=deepseek-chat-v3
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

> **Security:** All `.env` files are listed in `.gitignore`. Only `.env.example` files are committed. Never commit real API keys.

---

## 🔌 API Reference

### Deliberation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deliberate` | Start a deliberation session |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/session/:id` | Get session details |

### Agents & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | Agent performance stats |
| GET | `/api/stats` | System-wide statistics |
| GET | `/api/health` | Health check |

### Gallery & Breeding

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery/agents` | All agents with trait data |
| POST | `/api/breeding/breed` | Breed two agents |
| GET | `/api/breeding/predict/:p1/:p2` | Preview offspring traits |
| GET | `/api/breeding/history` | Breeding log |

### Arena

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/arena/tournament` | Run a standard tournament |
| POST | `/api/arena/custom-tournament` | Tournament with custom prompt |
| GET | `/api/arena/leaderboard` | Agent rankings |
| GET | `/api/arena/history` | Tournament history |
| GET | `/api/arena/stats` | Arena statistics |

### Cross-Chain

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cross-chain/status` | Bridge status + chain info |
| GET | `/api/cross-chain/chains` | Supported chains |
| GET | `/api/cross-chain/messages` | Recent bridge messages |
| POST | `/api/cross-chain/send` | Send a cross-chain message |
| GET | `/api/cross-chain/leaderboard` | Global multi-chain rankings |

### Proof-of-Intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/poi/run` | Run a PoI consensus round |
| GET | `/api/poi/history` | Consensus history |
| GET | `/api/poi/stats` | PoI statistics |

### 0G Storage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/0g/kv/:key` | Read from 0G KV |
| POST | `/api/0g/kv/:key` | Write to 0G KV |
| GET | `/api/0g/log/:name` | Read from 0G Log |
| POST | `/api/0g/log/:name` | Append to 0G Log |

---

## ⛓️ Smart Contracts

| Contract | Purpose |
|----------|---------|
| **AgentRegistry** | Global agent registry with cross-chain scoring |
| **CrossChainBridge** | Multi-chain message passing with relayer auth |
| **TournamentArena** | On-chain tournaments with entry fees & prizes |
| **ProofOfIntelligence** | On-chain commit-reveal consensus (novel PoI) |
| **CrossChainBreeding** | Cross-chain iNFT breeding with royalty distribution |

All contracts are in `contracts/src/` and compile with Foundry (`forge build`).

**Deployed to 0G Galileo Testnet (Chain ID: 16602)** — see [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md) for all contract addresses and transaction hashes.

---

## 💰 Revenue Model

| Stream | Rate | Split |
|--------|------|-------|
| Tournament Entry Fees | 0.1 ETH / entry | Winner 70% · Protocol 30% |
| iNFT Breeding Royalties | 5% of secondary sales | Parents 2.5% each · Protocol 2.5% |
| Bridge Transaction Fees | 0.5% per message | Relayers 60% · Protocol 40% |
| Enterprise API | $5K / month | Verifiable AI decision API |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite 5 + Framer Motion |
| **Styling** | Tailwind CSS + custom glassmorphism design system |
| **Backend** | Node.js + Express + WebSocket (`ws`) |
| **AI** | Anthropic Claude via API |
| **Verification** | 0G Compute TEE + SHA-256 proof hashes |
| **Storage** | 0G KV + 0G Log (in-memory fallback included) |
| **Contracts** | Solidity 0.8.20 + Foundry |
| **Deployment** | Vercel (frontend) · Railway or self-hosted (backend) |
| **Chains** | 0G Galileo Testnet · Ethereum Sepolia · Polygon Mumbai |

---

## 📁 Project Structure

```
SWARMOS/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express + WebSocket server
│   │   ├── agents.ts                   # 4 AI agents + orchestrator
│   │   ├── breeding.ts                 # Genetic crossover engine
│   │   ├── traits.ts                   # Agent trait management
│   │   ├── compute-verifier.ts         # 0G Compute TEE verification
│   │   ├── og-storage.ts              # 0G KV/Log with fallback
│   │   ├── cross-chain/
│   │   │   ├── bridge.ts              # Cross-chain message bridge
│   │   │   └── leaderboard.ts         # Global multi-chain leaderboard
│   │   └── consensus/
│   │       └── proof-of-intelligence.ts  # PoI commit-reveal engine
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Main app with 8 tabs
│   │   ├── components/
│   │   │   ├── LandingPage.tsx         # Business narrative overview
│   │   │   ├── DeliberationPanel.tsx   # Real-time agent pipeline
│   │   │   ├── AgentMonitor.tsx        # Agent performance cards
│   │   │   ├── Gallery.tsx             # Agent breeding gallery
│   │   │   ├── ArenaPanel.tsx          # Tournament system
│   │   │   ├── CrossChainDashboard.tsx # Multi-chain visualization
│   │   │   ├── BreedingModal.tsx       # Genetic crossover UI
│   │   │   ├── VerdictPanel.tsx        # Critic scoring display
│   │   │   ├── VerificationBadge.tsx   # 0G proof hash display
│   │   │   ├── ExecutorPanel.tsx       # Execution results
│   │   │   ├── SessionHistory.tsx      # Past deliberations
│   │   │   ├── SystemStats.tsx         # System metrics
│   │   │   └── TraitsDisplay.tsx       # Trait bar visualization
│   │   └── services/
│   │       ├── websocket.ts            # WebSocket manager
│   │       ├── api.ts                  # REST API client
│   │       └── demo-mode.ts            # Offline demo simulation
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
├── contracts/
│   └── src/
│       ├── AgentRegistry.sol
│       ├── CrossChainBridge.sol
│       ├── TournamentArena.sol
│       ├── ProofOfIntelligence.sol
│       └── CrossChainBreeding.sol
├── DEMO_GUIDE.md                       # 4-minute demo walkthrough
├── DEPLOYMENT_PROOF.md                  # On-chain proof (contract addresses, tx hashes)
├── SECURITY.md
└── README.md
```

---

## ✅ Build & Verify

```bash
# Frontend production build — must succeed with zero errors
cd frontend && npm run build

# Backend TypeScript check
cd backend && npx tsc --noEmit

# Contract compilation (requires Foundry)
cd contracts && forge build

# API health check (backend running)
curl http://localhost:5000/api/health
```

---

## 🔒 Security

- All `.env` files are excluded via `.gitignore` — no secrets are ever committed
- 0G Compute verification uses SHA-256 proof hashes for tamper-evidence
- Commit-reveal consensus prevents agent collusion
- Smart contracts use `onlyOwner` access control modifiers
- See [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Powered by [0G Network](https://0g.ai) · [Anthropic Claude](https://anthropic.com)

</div>
