<div align="center">

# 🐝 SWARM OS

### Autonomous Multi-Agent Deliberation System on 0G Network

[![Built on 0G](https://img.shields.io/badge/Built%20on-0G%20Network-blueviolet?style=for-the-badge)](https://0g.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Solidity](https://img.shields.io/badge/Solidity-0.8-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)

**Four autonomous AI agents deliberate, verify on 0G Compute, and store results on 0G Storage — with on-chain proof.**

[Quick Start](#-quick-start) · [0G Integration](#-0g-network-integration) · [Architecture](#-architecture) · [Demo Guide](#-demo-guide) · [API Reference](#-api-reference)

</div>

---

## 🎯 What is SWARM OS?

SWARM OS is a **multi-agent orchestration system** built on the **0G Network** where four AI agents collaborate to deliberate on complex requests. Every decision is **verified via 0G Compute** (using TEE-based trustless inference), every record is stored in **0G KV + 0G Log** storage, and agent NFTs live on the **0G EVM chain**.

| Agent | Role | What It Does |
|-------|------|-------------|
| 🧠 **Planner** | Strategy | Breaks down prompts into actionable step-by-step plans |
| 🔍 **Researcher** | Verification | Fact-checks claims and gathers supporting evidence |
| ⚖️ **Critic** | Evaluation | Scores plans across feasibility, safety, legality, cost |
| ⚡ **Executor** | Action | Executes approved plans (simulation or on-chain) |

---

## 🔗 0G Network Integration

SWARM OS uses **three pillars** of the 0G Network:

### 1. 0G Compute — Trustless AI Verification

Every deliberation decision is independently verified through the **0G Compute Network**, which runs inference inside **Trusted Execution Environments (TEEs)** for cryptographic proof of computation.

```
Deliberation Result → 0G Serving Broker → TEE Inference → Verification Proof
```

| Config | Value |
|--------|-------|
| **Testnet Endpoint** | `https://serving-broker-testnet.0g.ai` |
| **Mainnet Endpoint** | `https://serving-broker.0g.ai` |
| **Default Model** | `qwen/qwen-2.5-7b-instruct` |
| **Verification Type** | TeeML (Trusted Execution Environment) |
| **Fallback** | Local simulation when 0G Compute is unreachable |

**Available Testnet Models:**

| Model | Provider Address | Type |
|-------|-----------------|------|
| `qwen/qwen-2.5-7b-instruct` | `0xa48f01287233509FD694a22Bf840225062E67836` | Chat |
| `openai/gpt-oss-20b` | `0x8e60d466FD16798Bec4868aa4CE38586D5590049` | Chat |
| `google/gemma-3-27b-it` | `0x69Eb5a0BD7d0f4bF39eD5CE9Bd3376c61863aE08` | Chat |

**How to get the endpoint:**
1. Visit [docs.0g.ai](https://docs.0g.ai) → Compute Network
2. Get testnet tokens from [faucet.0g.ai](https://faucet.0g.ai)
3. Use the [0G Compute Starter Kit](https://github.com/0gfoundation/0g-compute-ts-starter-kit)

**Implementation:** [`backend/src/compute-verifier.ts`](./backend/src/compute-verifier.ts)
- Uses the OpenAI-compatible `/v1/chat/completions` API exposed by 0G Serving Broker
- Sends plan + evidence + verdict for independent AI verification
- Returns cryptographic proof hash + per-dimension verification scores
- 3 retries with exponential backoff
- Tracks whether TEE verification was used (`teeVerified: true/false`)

### 2. 0G Storage — KV Store + Log Store

All agent profiles, session data, and deliberation history are stored on 0G Storage:

| Service | Purpose | What We Store |
|---------|---------|---------------|
| **0G KV Store** | Key-value storage | Agent profiles, session metadata, breeding records, trait data |
| **0G Log Store** | Append-only log | Deliberation logs, verification proofs, breeding history, audit trail |

```
Agent Profile → 0G KV SET (key: agent:profile:1001)
Verification  → 0G Log APPEND (key: agent:compute:verification:session_123)
Breeding      → 0G Log APPEND (key: agent:breeding:history)
```

| Config | Value |
|--------|-------|
| **KV Endpoint** | `http://localhost:8080` (self-hosted [0g-storage-kv](https://github.com/0gfoundation/0g-storage-kv)) |
| **Log Endpoint** | `http://localhost:8081` (self-hosted [0g-storage-node](https://github.com/0gfoundation/0g-storage-node)) |
| **Fallback** | In-memory storage when 0G nodes are unavailable |

**Implementation:** [`backend/src/og-storage.ts`](./backend/src/og-storage.ts)
- `setKV(key, value)` / `getKV(key)` — agent profiles, session data
- `appendLog(logName, entry)` / `getLog(logName)` — verification proofs, history
- `listKeys(prefix)` / `getAllByPrefix(prefix)` — query all agents, sessions
- Automatic fallback to in-memory with zero code changes
- Metrics tracking: reads, writes, fallback count

### 3. 0G Chain — EVM Smart Contracts

Agent NFTs with on-chain trait storage, breeding logic, and heritage tracking:

| Config | Value |
|--------|-------|
| **RPC** | `https://evmrpc-testnet.0g.ai` |
| **Chain ID** | 16600 (Galileo Testnet) |
| **Contract** | `DeliberationINFT.sol` — agent NFT with 6 traits |
| **Faucet** | [faucet.0g.ai](https://faucet.0g.ai) |

**Implementation:** [`contracts/src/DeliberationINFT.sol`](./contracts/src/DeliberationINFT.sol)

---

## ✨ Features

### Phase 1: Multi-Agent Deliberation
- **4-agent pipeline** — Planner → Researcher → Critic → 0G Verify → Executor
- **Real-time WebSocket streaming** — watch agents think live
- **0G Compute verification** — cryptographic proof of decision integrity via TEE
- **0G KV + Log storage** — all sessions stored on-chain (in-memory fallback)
- **Revision loops** — Critic can reject plans, triggering replanning (max 2 revisions)
- **Dual LLM** — Anthropic Claude (primary) → OpenAI GPT-4 Turbo (automatic fallback)

### Phase 2: Agent Breeding & Evolution
- **Genetic breeding system** — select two agents, breed offspring with combined traits
- **6-dimensional trait model** — reasoning, creativity, caution, speed, accuracy, adaptability
- **Crossover + mutation** — child = average of parents ± random mutation (±5)
- **Generation tracking** — Gen 0 → Gen 1 → Gen 2... with full heritage chain
- **Compatibility scoring** — measures genetic diversity between parents
- **Agent gallery UI** — browse, compare, and select agents for breeding

### Phase 3: Agent Arena (Tournament System)
- **Competitive tournaments** — 4 agents compete across 5 rounds
- **Natural selection** — top performers breed, improving subsequent generations
- **Custom prompts** — run tournaments with any deliberation scenario
- **Global leaderboard** — all-time rankings with win rates and scores
- **Tournament history** — track evolution of agent performance over time

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SWARM OS Frontend                         │
│           React 18 + Vite + TailwindCSS + Inter             │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Deliberate│ │ Gallery  │ │  Arena   │ │  Agents  │       │
│  │  Panel   │ │& Breeding│ │Tournament│ │ Monitor  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                        │                                    │
│                  WebSocket + REST API                       │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│              SWARM OS Backend (Node.js + Express)            │
│                        │                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Swarm Orchestrator                       │   │
│  │   Planner → Researcher → Critic → Verifier → Executor│   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────┼───────────────────────────────┐   │
│  │              0G Integration Layer                     │   │
│  │                      │                                │   │
│  │  ┌──────────────┐  ┌┴─────────────┐  ┌────────────┐ │   │
│  │  │ 0G KV Store  │  │ 0G Log Store │  │ 0G Compute │ │   │
│  │  │ Agent data   │  │ Audit trail  │  │ TEE Verify │ │   │
│  │  │ Session meta │  │ Verify proofs│  │ AI Scoring │ │   │
│  │  │ Breed records│  │ Breed history│  │ Proof hash │ │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │   │
│  │  localhost:8080     localhost:8081     serving-broker │   │
│  │                                       -testnet.0g.ai│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Breeding Engine + Traits Manager         │   │
│  │   Crossover · Mutation · Generation · Heritage        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│              0G Chain (EVM L1 — Galileo Testnet)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  DeliberationINFT.sol — Agent NFTs with traits       │   │
│  │  On-chain breeding, heritage, and generation tracking │   │
│  └──────────────────────────────────────────────────────┘   │
│  RPC: evmrpc-testnet.0g.ai · Chain ID: 16600               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- At least one LLM API key: **Anthropic** or **OpenAI**

### 1. Clone & Install

```bash
git clone https://github.com/Maanyajha-12/SWARMOS.git
cd SWARMOS

# One-command setup
chmod +x setup-all.sh && ./setup-all.sh
```

Or manually:
```bash
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example backend/.env
```

Edit `backend/.env` — fill in your API key(s):
```env
# At least one LLM key required
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-proj-your-key-here     # automatic fallback

# 0G Compute (works with testnet, no API key needed for basic usage)
OG_COMPUTE_ENDPOINT=https://serving-broker-testnet.0g.ai
OG_COMPUTE_MODEL=qwen/qwen-2.5-7b-instruct
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 4. Open

Navigate to **http://localhost:5173**

On startup you'll see:
```
[0G Storage] ⚠ External 0G services unavailable — using in-memory fallback
[0G Compute] ✓ Connected to https://serving-broker-testnet.0g.ai (model: qwen/qwen-2.5-7b-instruct)
```

---

## 📖 Demo Guide

See **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** for a complete 10-minute walkthrough with:
- Step-by-step presenter script with timing
- Talking points for judges
- Suggested prompts
- Troubleshooting

---

## 🔌 API Reference

### Core Deliberation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/deliberate` | Start a new multi-agent deliberation |
| `GET`  | `/api/sessions` | List all completed sessions |
| `GET`  | `/api/session/:id` | Get session details |
| `GET`  | `/api/agents` | List all agents with live stats |
| `GET`  | `/api/health` | System health (includes 0G status) |
| `GET`  | `/api/stats` | System-wide statistics |

### Gallery & Breeding

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/gallery/agents` | List all agent profiles from 0G KV |
| `POST` | `/api/breeding/breed` | Create offspring from two parents |
| `GET`  | `/api/breeding/predict/:p1/:p2` | Preview offspring traits |
| `GET`  | `/api/breeding/history` | Breeding event log from 0G Log |
| `GET`  | `/api/breeding/traits/:tokenId` | Agent trait details from 0G KV |

### Arena (Tournaments)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/arena/tournament` | Run a standard 5-round tournament |
| `POST` | `/api/arena/custom-tournament` | Tournament with custom prompt |
| `GET`  | `/api/arena/leaderboard` | Global agent leaderboard |
| `GET`  | `/api/arena/history` | Past tournament results |
| `GET`  | `/api/arena/stats` | Arena-wide statistics |

### 0G Storage (Direct Access)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/0g/kv/:key` | Read from 0G KV store |
| `POST` | `/api/0g/kv/:key` | Write to 0G KV store |
| `GET`  | `/api/0g/log/:name` | Read from 0G Log store |
| `POST` | `/api/0g/log/:name` | Append to 0G Log store |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS, TypeScript, Inter + JetBrains Mono |
| **Backend** | Node.js 18+, Express 4, WebSocket (ws), TypeScript |
| **AI/LLM** | Anthropic Claude (primary) → OpenAI GPT-4 Turbo (fallback) |
| **0G Storage** | 0G KV Store + 0G Log Store (with in-memory fallback) |
| **0G Compute** | Serving Broker API, TeeML verification, Qwen/GPT-OSS/Gemma models |
| **0G Chain** | EVM L1, Solidity 0.8, Foundry, Galileo Testnet |
| **Design** | Glassmorphism dark theme, radial gradient overlays, micro-animations |

---

## 📁 Project Structure

```
SWARMOS/
├── backend/
│   └── src/
│       ├── index.ts              # Express + WebSocket + all API routes
│       ├── agents.ts             # 4 AI agents + orchestrator + LLM fallback
│       ├── compute-verifier.ts   # 0G Compute verification (TEE + simulation)
│       ├── og-storage.ts         # 0G KV + Log storage (with in-memory fallback)
│       ├── breeding.ts           # Genetic crossover + mutation engine
│       └── traits.ts             # Trait management + demo seeding
│
├── frontend/
│   └── src/
│       ├── App.tsx               # Main shell with 6-tab navigation
│       ├── index.css             # Premium design system
│       ├── components/
│       │   ├── DeliberationPanel.tsx   # Deliberation interface
│       │   ├── ArenaPanel.tsx         # Tournament system
│       │   ├── Gallery.tsx            # Agent gallery + breeding
│       │   ├── BreedingModal.tsx      # Breeding preview modal
│       │   ├── AgentMonitor.tsx       # Real-time agent status
│       │   ├── VerdictPanel.tsx       # Critic scoring display
│       │   ├── VerificationBadge.tsx  # 0G verification badge
│       │   ├── ExecutorPanel.tsx      # Execution results
│       │   ├── TraitsDisplay.tsx      # Trait visualization
│       │   ├── SessionHistory.tsx     # Session timeline
│       │   └── SystemStats.tsx        # System dashboard
│       ├── services/
│       │   ├── websocket.ts      # WebSocket (auto-reconnect)
│       │   └── api.ts            # REST client
│       └── styles/
│           └── Arena.css         # Arena-specific styles
│
├── contracts/
│   ├── src/DeliberationINFT.sol  # Agent NFT with on-chain traits
│   ├── script/Deploy.s.sol       # Foundry deployment
│   └── test/DeliberationINFT.t.sol
│
├── .env.example                  # Template with 0G endpoint docs
├── .gitignore
├── DEMO_GUIDE.md                 # Demo script for judges
├── LICENSE
├── README.md                     # This file
└── setup-all.sh                  # One-command setup
```

---

## 🔑 How It Works

### Deliberation Flow

```
User Prompt
    ↓
🧠 Planner (Anthropic/OpenAI) → step-by-step plan
    ↓ stored in 0G KV
🔍 Researcher (Anthropic/OpenAI) → evidence + confidence
    ↓ stored in 0G KV
⚖️ Critic (Anthropic/OpenAI) → 4-dimensional verdict
    ↓
    ├── Score ≥ 75 → APPROVE
    │       ↓
    │   🔐 0G Compute Verify (Serving Broker → TEE → proof hash)
    │       ↓ proof stored in 0G Log
    │   ⚡ Executor → execution result
    │       ↓ result stored in 0G Log
    │   ✅ Complete
    │
    └── Score < 75 → REVISE → back to Planner (max 2 revisions)
```

### LLM Fallback Strategy

```
Request → Try Anthropic Claude
              ├─ ✓ Success → return
              └─ ✗ Failed → Try OpenAI GPT-4 Turbo
                                ├─ ✓ Success → return
                                └─ ✗ Failed → graceful empty response
```

### 0G Compute Verification Flow

```
Plan + Evidence + Verdict
    ↓
0G Serving Broker (serving-broker-testnet.0g.ai)
    ↓ /v1/chat/completions (OpenAI-compatible API)
TEE Inference (qwen-2.5-7b-instruct)
    ↓
Verification Scores (feasibility, safety, legality, cost)
    ↓
SHA-256 Proof Hash (0x...)
    ↓ stored in 0G Log
VerificationBadge displayed in UI
```

### Breeding Algorithm

```
Parent A: [reasoning:85, creativity:72, caution:90, speed:68, accuracy:95, adaptability:78]
Parent B: [reasoning:78, creativity:88, caution:65, speed:92, accuracy:70, adaptability:85]
                           ↓ crossover + mutation(±5)
Child:    [reasoning:83, creativity:81, caution:76, speed:82, accuracy:84, adaptability:80]
                           ↓ stored in 0G KV
Gen 1 agent with heritage [Parent A, Parent B]
```

---

## 🏆 Innovation Highlights

| # | Innovation | 0G Component |
|---|-----------|--------------|
| 1 | **Trustless AI Verification** — every decision is independently verified via TEE inference | 0G Compute |
| 2 | **Decentralized Storage** — all session data, proofs, and breeding records on 0G | 0G KV + Log |
| 3 | **On-chain Agent NFTs** — agent traits and heritage stored on EVM chain | 0G Chain |
| 4 | **Dual LLM Architecture** — seamless Anthropic → OpenAI fallback | - |
| 5 | **Agent Evolution** — breeding system creates progressively better agents | - |
| 6 | **Real-time Collaboration** — WebSocket streaming shows agents thinking live | - |
| 7 | **Tournament System** — competitive arena drives natural selection | - |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built for the 0G Hackathon** 🏗️

*Autonomous agents that think, verify, evolve, and compete — all on 0G.*

</div>
