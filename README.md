<div align="center">

# 🐝 SWARM OS

### Autonomous Multi-Agent Deliberation System with 0G Compute Verification

[![Built with 0G](https://img.shields.io/badge/Built%20with-0G%20Network-blueviolet?style=for-the-badge)](https://0g.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Solidity](https://img.shields.io/badge/Solidity-0.8-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)

**Four autonomous AI agents deliberate, verify, and execute decisions — with on-chain proof.**

[Quick Start](#-quick-start) · [Architecture](#-architecture) · [Demo Guide](#-demo-guide) · [API Reference](#-api-reference)

</div>

---

## 🎯 What is SWARM OS?

SWARM OS is a **multi-agent orchestration system** where four specialized AI agents collaborate to deliberate on complex requests:

| Agent | Role | What It Does |
|-------|------|-------------|
| 🧠 **Planner** | Strategy | Breaks down prompts into actionable step-by-step plans |
| 🔍 **Researcher** | Verification | Fact-checks claims and gathers supporting evidence |
| ⚖️ **Critic** | Evaluation | Scores plans across feasibility, safety, legality, cost |
| ⚡ **Executor** | Action | Executes approved plans (simulation or on-chain) |

Every decision is **verified on 0G Compute** and results are stored in **0G Storage** — creating an auditable, decentralized record of AI reasoning.

---

## ✨ Key Features

### Phase 1: Multi-Agent Deliberation
- **4-agent pipeline** — Planner → Researcher → Critic → Executor
- **Real-time WebSocket streaming** — watch agents think live
- **0G Compute verification** — cryptographic proof of decision integrity
- **0G Storage** — all sessions, plans, and evidence stored on-chain (with in-memory fallback)
- **Revision loops** — Critic can reject plans, triggering automatic replanning
- **LLM fallback** — Anthropic (primary) → OpenAI (automatic fallback)

### Phase 2: Agent Breeding & Evolution
- **Genetic breeding system** — select two agents, breed offspring with combined traits
- **6-dimensional trait model** — reasoning, creativity, caution, speed, accuracy, adaptability
- **Crossover + mutation** — child traits = average of parents ± random mutation
- **Generation tracking** — Gen 0 → Gen 1 → Gen 2... with full heritage chain
- **Compatibility scoring** — measures genetic diversity between potential parents
- **Visual gallery** — browse, compare, and select agents for breeding

### Phase 3: Agent Arena (Tournament System)
- **Competitive tournaments** — 4 agents compete across 5 rounds
- **Natural selection** — top performers breed, improving subsequent generations
- **Custom prompts** — run tournaments with any deliberation scenario
- **Global leaderboard** — all-time rankings with win rates and scores
- **Tournament history** — track evolution of agent performance over time
- **Zero API cost** — tournament logic runs locally with mock scoring

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SWARM OS Frontend                     │
│  React 18 + Vite + TailwindCSS + Custom Dark Theme      │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │Deliberate│ │ Gallery  │ │  Arena   │ │  Agents    │ │
│  │  Panel   │ │& Breeding│ │Tournament│ │  Monitor   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
│       │            │            │              │        │
│       └────────────┴────────────┴──────────────┘        │
│                        │ WebSocket + REST                │
└────────────────────────┼────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│               SWARM OS Backend (Node.js)                 │
│                        │                                 │
│  ┌─────────┐  ┌────────┴────────┐  ┌─────────────────┐ │
│  │ Express │  │ Swarm           │  │ Breeding Engine │ │
│  │  + WS   │  │ Orchestrator    │  │ + Traits Mgr   │ │
│  └────┬────┘  └───┬──┬──┬──┬───┘  └────────┬────────┘ │
│       │          │  │  │  │                 │          │
│       │    ┌─────┘  │  │  └─────┐           │          │
│       │    ▼        ▼  ▼        ▼           │          │
│       │ Planner Researcher Critic Executor   │          │
│       │    │        │  │        │           │          │
│       │    └────────┴──┴────────┘           │          │
│       │              │                      │          │
│  ┌────┴──────────────┴──────────────────────┴────────┐ │
│  │              0G Integration Layer                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │ 0G KV    │  │ 0G Log   │  │ 0G Compute       │ │ │
│  │  │ Storage  │  │ Storage  │  │ Verification     │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│           Smart Contracts (Solidity/Foundry)             │
│  ┌────────────────────────────────────────────────────┐ │
│  │  DeliberationINFT.sol — On-chain agent NFTs        │ │
│  │  with trait storage, breeding, and heritage        │ │
│  └────────────────────────────────────────────────────┘ │
│  Deployed on: 0G Testnet (evmrpc-testnet.0g.ai)        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- An **Anthropic** or **OpenAI** API key (at least one required)

### 1. Clone & Install

```bash
git clone https://github.com/Maanyajha-12/SWARMOS.git
cd SWARMOS

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy the example and fill in your API key(s)
cp .env.example backend/.env
```

Edit `backend/.env` — you need **at least one** LLM key:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-proj-your-key-here    # automatic fallback
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 4. Open

Navigate to **http://localhost:5173** — you'll see the SWARM OS dashboard.

---

## 📖 Demo Guide

See **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** for a complete walkthrough with:
- Step-by-step demo script
- Talking points for each feature
- Suggested prompts to showcase
- Troubleshooting tips

---

## 🔌 API Reference

### Deliberation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/deliberate` | Start a new deliberation session |
| `GET`  | `/api/sessions` | List all completed sessions |
| `GET`  | `/api/session/:id` | Get session details |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/agents` | List all agents with stats |
| `GET`  | `/api/agent/:name/stats` | Get specific agent stats |
| `GET`  | `/api/health` | System health check |
| `GET`  | `/api/stats` | System-wide statistics |

### Gallery & Breeding

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/gallery/agents` | List all agent profiles |
| `POST` | `/api/breeding/breed` | Create offspring from two parents |
| `GET`  | `/api/breeding/predict/:p1/:p2` | Preview offspring traits |
| `GET`  | `/api/breeding/history` | Breeding event log |
| `GET`  | `/api/breeding/traits/:tokenId` | Get agent trait details |

### Arena (Tournaments)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/arena/tournament` | Run a standard tournament |
| `POST` | `/api/arena/custom-tournament` | Tournament with custom prompt |
| `GET`  | `/api/arena/leaderboard` | Global agent leaderboard |
| `GET`  | `/api/arena/history` | Past tournament results |
| `GET`  | `/api/arena/stats` | Arena-wide statistics |

### 0G Storage

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/0g/kv/:key` | Read from 0G KV store |
| `POST` | `/api/0g/kv/:key` | Write to 0G KV store |
| `GET`  | `/api/0g/log/:name` | Read from 0G Log |
| `POST` | `/api/0g/log/:name` | Append to 0G Log |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3, TypeScript, Lucide Icons |
| **Backend** | Node.js 18+, Express 4, WebSocket (ws), TypeScript |
| **AI/LLM** | Anthropic Claude (primary), OpenAI GPT-4 Turbo (fallback) |
| **Storage** | 0G KV + 0G Log (with in-memory fallback) |
| **Verification** | 0G Compute Network |
| **Contracts** | Solidity 0.8, Foundry, deployed on 0G Testnet |
| **Design** | Inter + JetBrains Mono fonts, glassmorphism dark theme |

---

## 📁 Project Structure

```
SWARMOS/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server + WebSocket + all API routes
│   │   ├── agents.ts             # 4 AI agents + orchestrator (Anthropic/OpenAI)
│   │   ├── breeding.ts           # Genetic crossover + mutation engine
│   │   ├── traits.ts             # Trait management + demo agent seeding
│   │   ├── og-storage.ts         # 0G KV/Log integration (+ in-memory fallback)
│   │   └── compute-verifier.ts   # 0G Compute verification layer
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app shell with 6-tab navigation
│   │   ├── index.css             # Premium design system (Inter, dark theme)
│   │   ├── components/
│   │   │   ├── DeliberationPanel.tsx   # Main deliberation interface
│   │   │   ├── ArenaPanel.tsx         # Tournament system (4 sub-tabs)
│   │   │   ├── Gallery.tsx            # Agent gallery + breeding selection
│   │   │   ├── BreedingModal.tsx      # Breeding preview + confirm modal
│   │   │   ├── AgentMonitor.tsx       # Real-time agent status cards
│   │   │   ├── VerdictPanel.tsx       # Critic scoring visualization
│   │   │   ├── VerificationBadge.tsx  # 0G compute verification display
│   │   │   ├── ExecutorPanel.tsx      # Execution result display
│   │   │   ├── TraitsDisplay.tsx      # 6-trait radar/bar visualization
│   │   │   ├── SessionHistory.tsx     # Past session timeline
│   │   │   └── SystemStats.tsx        # System-wide statistics dashboard
│   │   ├── services/
│   │   │   ├── websocket.ts      # WebSocket manager (auto-reconnect)
│   │   │   └── api.ts            # REST API client
│   │   └── styles/
│   │       └── Arena.css         # Arena-specific premium styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── contracts/
│   ├── src/
│   │   └── DeliberationINFT.sol  # Agent NFT with on-chain traits
│   ├── script/
│   │   └── Deploy.s.sol          # Foundry deployment script
│   ├── test/
│   │   └── DeliberationINFT.t.sol
│   └── foundry.toml
│
├── .env.example                  # Template (safe to commit)
├── .gitignore
├── DEMO_GUIDE.md                 # Step-by-step demo walkthrough
├── README.md                     # This file
└── setup-all.sh                  # One-command setup script
```

---

## 🔑 How It Works

### Deliberation Flow

```
User Prompt → Planner → Researcher → Critic → 0G Verify → Executor
                                        │
                                        ├─ Score ≥ 75 → APPROVE → Execute
                                        └─ Score < 75 → REVISE  → Re-plan (max 2 revisions)
```

### LLM Fallback Strategy

```
Request → Try Anthropic Claude
              │
              ├─ ✓ Success → return response
              └─ ✗ Failed → Try OpenAI GPT-4 Turbo
                                │
                                ├─ ✓ Success → return response
                                └─ ✗ Failed → return empty (graceful degradation)
```

### Breeding Algorithm

```
Parent A traits: [85, 72, 90, 68, 95, 78]
Parent B traits: [78, 88, 65, 92, 70, 85]
                      ↓
Child = average ± mutation(±5)
Child traits:    [83, 81, 76, 82, 84, 80]
```

---

## 🏆 Innovation Highlights

1. **0G Compute Verification** — Every agent decision is cryptographically verified before execution
2. **Dual LLM Architecture** — Seamless Anthropic → OpenAI fallback with zero downtime
3. **Agent Evolution** — Breeding system creates progressively better agents
4. **Decentralized Storage** — All deliberation data stored on 0G Network
5. **Real-time Collaboration** — WebSocket streaming shows agents thinking in real-time
6. **Tournament System** — Competitive arena drives natural selection

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built for theEthGlobal Hackathon** 🏗️

*Autonomous agents that think, verify, evolve, and compete.*

</div>
