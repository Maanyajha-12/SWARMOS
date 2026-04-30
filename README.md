<div align="center">

# 🤖 SWARM OS

### Trustless Multi-Agent AI Decision-Making for the Multi-Chain Future

[![Built on 0G](https://img.shields.io/badge/Built%20on-0G%20Network-10b981?style=for-the-badge)](https://0g.ai)
[![ETHGlobal](https://img.shields.io/badge/ETHGlobal-Hackathon-627eea?style=for-the-badge)](https://ethglobal.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**SWARM OS orchestrates autonomous AI agent swarms across multiple blockchains. Every decision is verified through 0G Compute TEE and recorded on-chain with cryptographic proof.**

[Try Live Demo](#quick-start) · [Demo Script](#4-minute-demo-script) · [Architecture](#architecture) · [API Reference](#api-reference)

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

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React)              │
│  Landing → Deliberation → Gallery → Arena → Cross-Chain     │
│  Framer Motion animations · Ultra-dark AI-native theme      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                     BACKEND (Node.js + Express)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Planner  │ │Researcher│ │  Critic  │ │ Executor │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴────────────┴─────────────┘            │
│  ┌─────────────┐ ┌───────────────┐ ┌──────────────────┐    │
│  │ Breeding    │ │ Cross-Chain   │ │ Proof-of-Intel.  │    │
│  │ Engine      │ │ Bridge        │ │ Consensus        │    │
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
    │  DeliberationINFT · AgentRegistry             │
    │  CrossChainBridge · TournamentArena           │
    │  ProofOfIntelligence · CrossChainBreeding     │
    └───────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Foundry for contracts

### 1. Clone and Setup

```bash
git clone https://github.com/Maanyajha-12/SWARMOS.git
cd SWARMOS
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

The backend starts at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000`.

### Environment Variables

#### Backend (`backend/.env`)
```env
# REQUIRED — only key you need
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# Server
PORT=5000
NODE_ENV=development

# 0G Storage (optional — uses in-memory fallback if unavailable)
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081

# 0G Compute (optional — uses simulation if unavailable)
OG_COMPUTE_ENDPOINT=https://serving-broker-testnet.0g.ai
OG_COMPUTE_MODEL=qwen/qwen-2.5-7b-instruct
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

> **Note**: All `.env` files are in `.gitignore`. Only `.env.example` files are committed.

---

## 📋 4-Minute Demo Script

> **For ETHGlobal judges** — Follow this script for a complete walkthrough.

### Minute 0:00–0:30 — Overview & Problem Statement

1. Open the app → **Overview** tab loads by default
2. Point out the hero: *"Trustless AI Decision-Making for the Multi-Chain Future"*
3. Show the stats bar: **12 agents deployed, 847 decisions verified, 3 chains connected, 91% confidence**
4. Scroll to **Problem/Solution** section:
   - *"AI agents make $2.3T in decisions — zero are verifiable"*
   - *"SWARM OS: Multi-agent consensus with cryptographic proof"*
5. Show the **6 Core Technology** feature cards
6. Scroll to **How It Works** pipeline: User → Planner → Researcher → Critic → 0G Verify → On-Chain

### Minute 0:30–2:00 — Live Deliberation

7. Click **"Try Live Demo"** button (or navigate to **Deliberate** tab)
8. Enter prompt: *"Should we launch a decentralized governance token with quadratic voting?"*
9. Select **Simulation** mode and click **Start Deliberation**
10. **Watch the real-time pipeline**:
    - 🟡 **Planner** → Creates step-by-step execution plan
    - 🟡 **Researcher** → Gathers evidence and risk analysis
    - 🟡 **Critic** → Scores feasibility, safety, legality, cost efficiency
    - 🟡 **Verifier** → 0G Compute TEE verification with SHA-256 proof hash
    - 🟡 **Executor** → Final execution report
11. Point out the **Verification Badge**: `0x...` proof hash, TEE status, per-dimension scores
12. Show the **APPROVE/REVISE** decision with overall score

### Minute 2:00–2:30 — Agent Gallery & Breeding

13. Navigate to **Gallery** tab → Show 4 seeded agents with colorful trait bars
14. **Click two agents** to select them as parents
15. Click **"Predict & Breed"** → Show the breeding modal:
    - Parent 1 vs Parent 2 traits side-by-side
    - Predicted offspring with blended traits
    - Compatibility score and genetic crossover animation
16. Click **Confirm Breeding** → New Gen 1 agent appears in gallery

### Minute 2:30–3:00 — Arena & Competition

17. Navigate to **Arena** tab
18. Click **"Start Standard Tournament"** → Watch 5 rounds of competition
19. Show the **Leaderboard** with win rates and breeding counts
20. Explain: *"Top performers breed, bottom are eliminated — survival of the fittest for AI"*

### Minute 3:00–3:30 — Cross-Chain & Proof-of-Intelligence

21. Navigate to **Cross-Chain** tab → Show the 3-chain visualization:
    - Ethereum Sepolia, Polygon Mumbai, 0G Newton Testnet
    - Bridge connections with message counts
    - Per-chain agent scores and global leaderboard
22. Explain the **Proof-of-Intelligence** consensus:
    - *"Agents independently commit hashed decisions before revealing"*
    - *"Commit-reveal prevents collusion — novel consensus mechanism"*

### Minute 3:30–4:00 — Revenue Model & Closing

23. Scroll down on **Overview** tab to show **Market Opportunity**:
    - TAM: $2.3T → SAM: $50B → Initial: $500M
24. Show **Revenue Model**: Tournament fees, breeding royalties, bridge fees, enterprise API
25. Point out the **6 smart contracts** deployed on 0G testnet
26. Close with: *"SWARM OS — trustless AI decisions, verified on-chain, evolving through competition"*

---

## 🔌 API Reference

### Deliberation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deliberate` | Start a deliberation session |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/session/:id` | Get session details |

### Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | Get all agent stats |
| GET | `/api/stats` | System statistics |
| GET | `/api/health` | Health check |

### Breeding & Gallery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery/agents` | List all agents with traits |
| POST | `/api/breeding/breed` | Breed two agents |
| GET | `/api/breeding/predict/:p1/:p2` | Preview offspring |
| GET | `/api/breeding/history` | Breeding log |

### Arena
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/arena/tournament` | Run tournament |
| POST | `/api/arena/custom-tournament` | Custom prompt tournament |
| GET | `/api/arena/leaderboard` | Agent leaderboard |
| GET | `/api/arena/history` | Tournament history |
| GET | `/api/arena/stats` | Arena statistics |

### Cross-Chain
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cross-chain/status` | Bridge status + chain info |
| GET | `/api/cross-chain/chains` | Supported chains |
| GET | `/api/cross-chain/messages` | Recent bridge messages |
| POST | `/api/cross-chain/send` | Send cross-chain message |
| GET | `/api/cross-chain/leaderboard` | Global rankings |

### Proof-of-Intelligence
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/poi/run` | Run PoI consensus |
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

## 🏆 Smart Contracts

| Contract | Purpose | File |
|----------|---------|------|
| **DeliberationINFT** | ERC721 iNFT with deliberation metadata | `contracts/src/DeliberationINFT.sol` |
| **AgentRegistry** | Global agent registry with cross-chain scoring | `contracts/src/AgentRegistry.sol` |
| **CrossChainBridge** | Multi-chain message passing | `contracts/src/CrossChainBridge.sol` |
| **TournamentArena** | Tournament with entry fees & prize distribution | `contracts/src/TournamentArena.sol` |
| **ProofOfIntelligence** | On-chain commit-reveal consensus | `contracts/src/ProofOfIntelligence.sol` |
| **CrossChainBreeding** | Cross-chain iNFT breeding with royalties | `contracts/src/CrossChainBreeding.sol` |

---

## 💰 Revenue Model

| Stream | Amount | Split |
|--------|--------|-------|
| Tournament Entry Fees | 0.1 ETH/entry | Winner 70% · Protocol 30% |
| iNFT Breeding Royalties | 5% secondary sales | Parents 2.5% · Protocol 2.5% |
| Bridge Transaction Fees | 0.5% per message | Relayers 60% · Protocol 40% |
| Enterprise API | $5K/month | Verifiable AI decision API |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Framer Motion |
| **Styling** | Tailwind CSS + Custom glassmorphism design system |
| **Backend** | Node.js + Express + WebSocket |
| **AI** | Anthropic Claude (via API) |
| **Verification** | 0G Compute TEE + SHA-256 proof hashes |
| **Storage** | 0G KV + 0G Log (with in-memory fallback) |
| **Contracts** | Solidity 0.8.20 + Foundry |
| **Chains** | 0G Newton Testnet · Ethereum Sepolia · Polygon Mumbai |

---

## 📁 Project Structure

```
SWARMOS/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express + WebSocket server
│   │   ├── agents.ts             # 4 AI agents + orchestrator
│   │   ├── breeding.ts           # Genetic crossover engine
│   │   ├── traits.ts             # Agent trait management
│   │   ├── compute-verifier.ts   # 0G Compute TEE verification
│   │   ├── og-storage.ts         # 0G KV/Log with fallback
│   │   ├── cross-chain/
│   │   │   ├── bridge.ts         # Cross-chain message bridge
│   │   │   └── leaderboard.ts    # Global multi-chain leaderboard
│   │   └── consensus/
│   │       └── proof-of-intelligence.ts  # PoI commit-reveal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app with 8 tabs
│   │   ├── components/
│   │   │   ├── LandingPage.tsx       # Business narrative landing
│   │   │   ├── DeliberationPanel.tsx # Real-time agent pipeline
│   │   │   ├── AgentMonitor.tsx      # Agent performance cards
│   │   │   ├── Gallery.tsx           # Agent breeding gallery
│   │   │   ├── ArenaPanel.tsx        # Tournament system
│   │   │   ├── CrossChainDashboard.tsx # Multi-chain visualization
│   │   │   ├── BreedingModal.tsx     # Genetic crossover UI
│   │   │   ├── VerdictPanel.tsx      # Critic scoring
│   │   │   ├── VerificationBadge.tsx # 0G proof display
│   │   │   ├── ExecutorPanel.tsx     # Execution results
│   │   │   ├── SessionHistory.tsx    # Past deliberations
│   │   │   ├── SystemStats.tsx       # System metrics
│   │   │   └── TraitsDisplay.tsx     # Trait bar visualization
│   │   └── services/
│   │       ├── websocket.ts          # WebSocket manager
│   │       ├── api.ts                # REST API client
│   │       └── demo-mode.ts          # Offline demo simulation
│   ├── vercel.json
│   └── package.json
├── contracts/
│   └── src/
│       ├── DeliberationINFT.sol
│       ├── AgentRegistry.sol
│       ├── CrossChainBridge.sol
│       ├── TournamentArena.sol
│       ├── ProofOfIntelligence.sol
│       └── CrossChainBreeding.sol
└── README.md
```

---

## 🔒 Security

- All `.env` files are in `.gitignore` — secrets are never committed
- 0G Compute verification uses SHA-256 proof hashes
- Commit-reveal consensus prevents agent collusion
- Smart contracts use access control with `onlyOwner` modifiers
- See [SECURITY.md](SECURITY.md) for vulnerability reporting

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for ETHGlobal Hackathon**

Powered by [0G Network](https://0g.ai) · [Anthropic Claude](https://anthropic.com)

</div>
