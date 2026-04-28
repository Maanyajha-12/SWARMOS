# 🌐 SWARM OS — Autonomous Multi-Agent System with 0G Compute Verification

**Production-Ready Multi-Agent Deliberation System with Verifiable Autonomous Decisions via 0G Compute + Agent Breeding & Evolution**

---

## 🎯 What Makes This Special

| Traditional Multi-Agent | **SWARM OS** |
|---|---|
| Agents talk → decisions made → execute | Agents talk → decisions **verified on 0G Compute** → cryptographic proof → execute |
| No way to prove correctness | Every decision has a **mathematical proof** |
| Static agents | Agents **breed and evolve** across generations |

---

## 🚀 Quick Start (3 minutes)

### Prerequisites
- **Node.js 18+** (`node --version`)
- **Anthropic API Key** (get one at [console.anthropic.com](https://console.anthropic.com))

### 1. Backend

```bash
cd backend
npm install

# Set your Anthropic API key
echo 'ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE' > .env
echo 'PORT=5000' >> .env
echo 'NODE_ENV=development' >> .env

npm run dev
# ✓ Server running on http://localhost:5000
# ✓ 4 demo agents seeded automatically
# ✓ In-memory storage fallback active
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# ✓ App opens on http://localhost:3000
```

### 3. Open Browser

Go to **http://localhost:3000** — you're ready!

---

## 📋 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | **Yes** | — | Your Anthropic API key for Claude |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `OG_KV_ENDPOINT` | No | `http://localhost:8080` | 0G KV store (falls back to in-memory) |
| `OG_LOG_ENDPOINT` | No | `http://localhost:8081` | 0G Log store (falls back to in-memory) |
| `OG_COMPUTE_ENDPOINT` | No | `http://localhost:8082` | 0G Compute (falls back to simulated) |
| `OG_COMPUTE_API_KEY` | No | `test-key` | 0G Compute API key |
| `RPC_URL` | No | `https://evmrpc-testnet.0g.ai` | Blockchain RPC |
| `PRIVATE_KEY` | No | — | Wallet private key (for on-chain execution) |
| `DELIBERATION_INFT_ADDRESS` | No | — | Deployed iNFT contract address |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:5000` | Backend API URL |

> **Note:** The only **required** variable is `ANTHROPIC_API_KEY`. Everything else has sensible defaults with automatic fallbacks.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────┐
│          React Frontend (Vite + TailwindCSS)     │
│   • Deliberation Panel  • Agent Pipeline View    │
│   • Gallery & Breeding  • Real-time WebSocket    │
└──────────────────┬──────────────────────────────┘
                   │ HTTP + WebSocket
                   ↓
┌─────────────────────────────────────────────────┐
│       Node.js/Express Backend (TypeScript)       │
│  • SwarmOrchestrator (4 agents)                  │
│  • 0G Compute Verification                       │
│  • Breeding Engine + Traits Manager              │
│  • WebSocket Real-Time Updates                   │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    0G KV       0G Log     0G Compute
   (State)    (History)  (Verification)
       │           │           │
       └───────────┼───────────┘
                   ↓
         ┌─────────────────┐
         │  Smart Contract  │
         │ DeliberationINFT │
         └─────────────────┘
```

---

## 📁 Project Structure

```
swarm-os/
├── backend/
│   ├── src/
│   │   ├── index.ts             # Express + WebSocket server + all endpoints
│   │   ├── agents.ts            # 4 agents (Planner, Researcher, Critic, Executor)
│   │   ├── compute-verifier.ts  # 0G Compute verification
│   │   ├── og-storage.ts        # 0G KV/Log with in-memory fallback
│   │   ├── breeding.ts          # Crossover algorithm + BreedingEngine
│   │   └── traits.ts            # TraitsManager for agent DNA
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeliberationPanel.tsx   # Full agent pipeline with real-time updates
│   │   │   ├── AgentMonitor.tsx        # Agent status cards
│   │   │   ├── VerdictPanel.tsx        # Critic verdict with scores
│   │   │   ├── VerificationBadge.tsx   # 0G Compute proof display
│   │   │   ├── ExecutorPanel.tsx       # Transaction details
│   │   │   ├── Gallery.tsx            # iNFT gallery + breeding UI
│   │   │   ├── BreedingModal.tsx      # Breed preview + confirm
│   │   │   ├── TraitsDisplay.tsx      # Agent trait bars
│   │   │   ├── SessionHistory.tsx     # Past sessions
│   │   │   └── SystemStats.tsx        # System statistics
│   │   ├── services/
│   │   │   ├── websocket.ts           # WebSocket client
│   │   │   └── api.ts                 # HTTP client
│   │   ├── App.tsx                    # Main app with 5 tabs
│   │   ├── main.tsx                   # Entry point
│   │   └── vite-env.d.ts             # Vite type declarations
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── contracts/
│   ├── src/
│   │   └── DeliberationINFT.sol       # ERC721 with compute proof
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
│
└── README.md
```

---

## 🔄 How It Works

### Deliberation Flow (Phase 1)

```
User submits prompt
    ↓
🧠 Planner Agent → Creates structured plan (steps, costs, timeline)
    ↓
🔍 Researcher Agent → Verifies claims, gathers evidence
    ↓
⚖️ Critic Agent → Scores feasibility/safety/legality/cost → APPROVE or REVISE
    ↓
🛡️ 0G Compute Verifier → Cryptographic proof of decision correctness
    ↓
▶️ Executor Agent → Simulates or executes on-chain
    ↓
✅ Result with verification proof
```

All updates stream to the frontend via WebSocket in real-time.

### Agent Breeding (Phase 2)

```
Parent 1 (#1001, Gen 0)  ×  Parent 2 (#1002, Gen 0)
    Score: 87%                   Score: 84%
        ↓                            ↓
    Extract Traits              Extract Traits
    (6 DNA dimensions)          (6 DNA dimensions)
        ↓                            ↓
        └──────── CROSSOVER ─────────┘
                      ↓
           Average traits ± mutation (±5)
                      ↓
         Child Agent (#54321, Gen 1)
              Score: ~86%
         Inherits best traits from parents
```

**Agent Traits (DNA):**
| Trait | Description |
|-------|------------|
| 🧠 Reasoning | Logical analysis quality |
| 🎨 Creativity | Novel approach generation |
| 🛡️ Caution | Risk awareness |
| ⚡ Speed | Response efficiency |
| 🎯 Accuracy | Factual correctness |
| 🔄 Adaptability | Situation flexibility |

---

## 📊 API Reference

### Deliberation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/deliberate` | Start deliberation `{prompt, mode}` |
| `GET` | `/api/session/:id` | Get session result |
| `GET` | `/api/sessions` | List all sessions |

### Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents with stats |
| `GET` | `/api/agent/:name/stats` | Individual agent stats |

### Gallery & Breeding
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gallery/agents` | All agent profiles with traits |
| `POST` | `/api/breeding/breed` | Breed two agents `{parent1Id, parent2Id}` |
| `GET` | `/api/breeding/predict/:p1/:p2` | Preview offspring |
| `GET` | `/api/breeding/history` | Breeding log |
| `GET` | `/api/breeding/traits/:tokenId` | Agent traits |

### 0G Storage
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/0g/kv/:key` | Read from KV store |
| `POST` | `/api/0g/kv/:key` | Write to KV store |
| `GET` | `/api/0g/log/:logName` | Read from Log store |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stats` | System statistics |

### WebSocket Events
```
Connect to: ws://localhost:5000

Incoming events:
  "agent_update"          → { agent, event, data }
  "deliberation_complete" → { session_id, result }
  "deliberation_error"    → { error }
  "agent_bred"            → { data: BreedingResult }
```

---

## 🎮 Demo Guide

### Demo 1: Full Deliberation (2 min)

1. Open **http://localhost:3000**
2. In the **Deliberate** tab, type: `Create a governance proposal for treasury allocation`
3. Select **Simulation** mode
4. Click **Start Deliberation**
5. Watch the agent pipeline light up in real-time:
   - 🧠 Planner creates a structured plan
   - 🔍 Researcher verifies claims
   - ⚖️ Critic scores and approves/revises
   - 🛡️ 0G Verifier generates cryptographic proof
   - ▶️ Executor simulates execution
6. See the final result with scores, verification badge, and transaction hash

### Demo 2: Agent Gallery & Breeding (1 min)

1. Click the **Gallery** tab
2. See 4 seeded agents with trait bars (reasoning, creativity, etc.)
3. Click **Agent #1001** (selected as Parent 1)
4. Click **Agent #1003** (selected as Parent 2)
5. Click **Predict & Breed**
6. Review the breeding modal showing:
   - Parent trait comparison
   - Predicted offspring traits
   - Compatibility score
7. Click **Confirm Breeding**
8. New Gen 1 agent appears in the gallery!

### Demo 3: System Monitoring (30 sec)

1. **Agents** tab → Live agent status and success rates
2. **History** tab → All past deliberation sessions
3. **Statistics** tab → System-wide metrics

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check `ANTHROPIC_API_KEY` is set in `backend/.env` |
| Frontend shows "Disconnected" | Make sure backend is running on port 5000 |
| "0G services unavailable" message | Normal — app uses in-memory fallback automatically |
| Deliberation fails | Verify your Anthropic API key is valid |
| Gallery shows no agents | Restart backend — demo agents are seeded on startup |

---

## 📈 Performance

| Component | Time | Notes |
|-----------|------|-------|
| Planner | 2-3s | Claude API call |
| Researcher | 3-5s | Claude API analysis |
| Critic | 2-3s | Claude evaluation |
| 0G Verification | <1s | Simulated (3-5s with real 0G) |
| Executor | <1s | Simulation mode |
| **Total** | **~10-15s** | Full cycle |

---

## 🧬 Phase 2: Agent Breeding

The breeding system allows agents to evolve across generations:

- **Crossover Algorithm**: Child traits = average of parents ± random mutation (±5)
- **Generation Tracking**: Gen 0 (original) → Gen 1 (bred) → Gen 2 ...
- **Compatibility Score**: Measures genetic diversity between parents
- **Heritage Tracking**: Full ancestry chain stored per agent

---

**Status**: ✅ Production Ready  
**Tech Stack**: Node.js + React + Vite + TailwindCSS + Foundry + 0G  
**Innovation**: 0G Compute Verification + Agent Breeding Evolution  
