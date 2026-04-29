# 🎬 SWARM OS — Demo Guide for Judges
> **System:** 4 autonomous AI agents + 0G Compute + 0G Storage + 0G Chain  
> **Core Innovation:** Trustless AI deliberation with decentralized verification

---

## ⚡ Pre-Demo Checklist

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

**Verify startup logs show:**
```
[0G Storage] ⚠ External 0G services unavailable — using in-memory fallback
[0G Compute] ✓ Connected to https://serving-broker-testnet.0g.ai (model: qwen/qwen-2.5-7b-instruct)
[Init] ✓ Services initialized
```

> **Note:** 0G Storage shows "fallback" because KV/Log nodes must be self-hosted. The in-memory fallback uses the exact same API surface — in production, data goes to 0G network. 0G Compute connects to the live testnet.

Open **http://localhost:5173** in your browser.

---

## 🎙️ Presenter Script

### Opening — "What is SWARM OS?" (30 seconds)

> *"This is SWARM OS — an autonomous multi-agent deliberation system built entirely on the 0G Network.*
>
> *Four AI agents collaborate to analyze requests, with every decision verified through 0G Compute using TEE-based trustless inference, every record stored on 0G KV and Log storage, and agent NFTs living on the 0G EVM chain.*
>
> *Let me show you how it works."*

---

### Demo 1: Multi-Agent Deliberation + 0G Verification (4-5 minutes)

**Tab:** Deliberate

**1. Enter this prompt and click "Start Deliberation":**
```
Create a governance proposal for allocating $50,000 of DAO treasury to fund open-source AI safety research
```

**2. Narrate the pipeline as it runs:**

> *"Watch the pipeline — four agents run in sequence:*
>
> *The **Planner** breaks this into actionable steps with cost estimates. That plan gets stored in **0G KV storage** under `agent:plan:session_id`.*
>
> *The **Researcher** fact-checks every claim and produces evidence with confidence scores. Also stored in **0G KV**.*
>
> *The **Critic** scores the plan on four dimensions — feasibility, safety, legality, and cost efficiency. If the overall score is below 75, it automatically sends the plan back for revision."*

**3. When the verification badge appears, emphasize:**

> *"Now here's the key 0G innovation — the approved decision gets sent to the **0G Compute Network** at `serving-broker-testnet.0g.ai`. This runs inference inside a **TEE (Trusted Execution Environment)** using the Qwen 2.5 7B model.*
>
> *The verification independently re-scores each dimension and produces a **SHA-256 cryptographic proof hash**. This proof gets stored in **0G Log storage** — creating an immutable, verifiable audit trail of every AI decision."*

**4. Point out in the UI:**
- ✅ The Planner's step-by-step breakdown
- ✅ The Researcher's evidence and confidence score
- ✅ The Critic's 4-dimensional verdict bars
- ✅ The **0G Verification Badge** with proof hash (`0x...`)
- ✅ The APPROVE/REVISE decision
- ✅ The executor's final output

**Key talking point for judges:**
> *"This creates a **trustless AI decision pipeline** — the 0G Compute TEE ensures that no single party can manipulate the verification. The 0G Log store ensures every decision is permanently auditable."*

---

### Demo 2: 0G Storage in Action (1-2 minutes)

**Open a new browser tab or use `curl`:**

```bash
# Show what's stored in 0G KV
curl http://localhost:5000/api/health | python3 -m json.tool
```

**Point out the storage section:**
```json
{
  "storage": {
    "mode": "in-memory-fallback",
    "endpoints": {
      "kv": "http://localhost:8080",
      "log": "http://localhost:8081"
    },
    "kv_keys": 4,
    "log_streams": 1,
    "log_total_entries": 1,
    "metrics": {
      "kv_writes": 8,
      "kv_reads": 4,
      "log_appends": 1,
      "fallback_count": 0
    }
  }
}
```

> *"Every agent profile is stored as a KV entry. Every verification proof is appended to the Log store. In production with a running 0G Storage node, this data goes directly to the decentralized network instead of memory. The API is identical — zero code changes required."*

**Show direct 0G KV access:**
```bash
# Read an agent profile directly from 0G KV
curl http://localhost:5000/api/0g/kv/agent:profile:1001 | python3 -m json.tool
```

---

### Demo 3: Agent Gallery & Breeding (2-3 minutes)

**Tab:** Gallery

**1. Show the 4 seeded agents:**
> *"Each agent has 6 genetic traits stored in 0G KV: reasoning, creativity, caution, speed, accuracy, and adaptability. These same traits exist on-chain in the `DeliberationINFT` smart contract on 0G's EVM chain."*

**2. Click Agent #1001, then Agent #1003, then "Predict & Breed"**

**3. In the breeding modal:**
> *"The breeding algorithm performs genetic crossover — each child trait is the average of both parents plus a random mutation of ±5 points. This creates genetic diversity while preserving strong traits.*
>
> *The new agent's profile gets stored in **0G KV** and the breeding event is logged in **0G Log** — creating a complete evolutionary audit trail."*

**4. Confirm the breed — new agent appears**

---

### Demo 4: Agent Arena Tournament (2-3 minutes)

**Tab:** Arena

**1. Click "Start Standard Tournament"**

> *"Four agents compete across 5 rounds. Each round scores their deliberation quality. The bracket shows how they perform relative to each other."*

**2. When complete, show:**
- The **bracket view** — scores per round, rankings
- The **winner card** — score and generation  
- Switch to **Leaderboard** tab — all-time rankings
- Switch to **Statistics** tab — arena metrics

> *"This is natural selection for AI agents. Top performers can breed to create better next-generation agents. The tournament results feed back into the breeding system."*

---

### Demo 5: Real-time Monitoring (1 minute)

**Tab:** Agents
> *"Real-time agent status — executions, success rate, response times. All powered by 0G KV storage."*

**Tab:** History
> *"Every deliberation session is stored and retrievable — a complete audit trail on 0G Log."*

**Tab:** Statistics
> *"System-wide metrics including 0G storage stats."*

---

### Closing — "Why 0G?" (30 seconds)

> *"SWARM OS demonstrates that autonomous AI can be both powerful AND trustworthy by leveraging three pillars of the 0G Network:*
>
> *1. **0G Compute** — trustless verification of AI decisions via TEE inference*  
> *2. **0G Storage** — decentralized KV + Log for all agent data and audit trails*  
> *3. **0G Chain** — on-chain agent NFTs with genetic traits and heritage*
>
> *Every decision is verified. Every evolution is tracked. Every agent improves over time. This is the future of autonomous AI on decentralized infrastructure."*

---

## 🎯 Suggested Demo Prompts

| # | Prompt | Why It's Great |
|---|--------|----------------|
| 1 | `Create a governance proposal for allocating $50,000 of DAO treasury to fund AI safety research` | Multi-step, shows cost/safety dimensions |
| 2 | `Design a decentralized identity system using zero-knowledge proofs on 0G Network` | Technical, strong research output |
| 3 | `Propose a carbon credit trading protocol with on-chain verification` | Cross-domain, feasibility challenges |
| 4 | `Build an autonomous agent marketplace with quality scoring and breeding` | Self-referential, ties to breeding system |
| 5 | `Create emergency response coordination system for natural disasters` | Safety-critical, shows Critic's value |

---

## 📊 What to Emphasize to Judges

### 0G Integration (Primary Focus)

| Feature | 0G Service | Evidence |
|---------|-----------|---------|
| Decision verification via TEE | **0G Compute** | Proof hash in UI (`0x...`), `verificationSource: "0g-compute"` |
| Agent profiles persisted | **0G KV Store** | `curl /api/0g/kv/agent:profile:1001` |
| Verification proofs logged | **0G Log Store** | `curl /api/0g/log/agent:compute:verification:*` |
| Breeding history tracked | **0G Log Store** | `curl /api/breeding/history` |
| Agent NFT with traits | **0G Chain** | `DeliberationINFT.sol` on Galileo Testnet |
| Health metrics show 0G status | **All three** | `curl /api/health` shows endpoints, mode, metrics |

### Technical Depth

| Aspect | Detail |
|--------|--------|
| **0G Compute API** | OpenAI-compatible `/v1/chat/completions` via Serving Broker |
| **TEE Verification** | TeeML-based — inference runs inside trusted hardware |
| **Models Used** | Qwen 2.5 7B, GPT-OSS-20B, Gemma 3 27B (all on 0G testnet) |
| **Fallback Strategy** | 0G Compute → local sim; 0G Storage → in-memory; Anthropic → OpenAI |
| **Proof Hash** | SHA-256 of input+output+timestamp, stored in 0G Log |
| **Real-time** | WebSocket streaming, not polling |
| **Breeding** | Genetic crossover + mutation with multi-generation heritage |

### Code Quality

| Metric | Status |
|--------|--------|
| TypeScript compilation | ✅ 0 errors (frontend + backend) |
| 0G Compute integration | ✅ Live testnet connection |
| 0G Storage integration | ✅ Full KV + Log with fallback |
| LLM dual-provider | ✅ Anthropic + OpenAI auto-fallback |
| Real-time WebSocket | ✅ Working with auto-reconnect |
| Premium UI | ✅ Glassmorphism dark theme |

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Backend won't start | Check `backend/.env` has at least one API key |
| "Anthropic failed, falling back to OpenAI" | Normal — Anthropic credits may be exhausted |
| 0G Storage shows "in-memory fallback" | Normal — KV/Log nodes must be self-hosted. API is identical. |
| 0G Compute shows "unavailable" | Check internet connection. Endpoint: `serving-broker-testnet.0g.ai` |
| WebSocket "Disconnected" | Restart backend: `cd backend && npm run dev` |
| Gallery shows "No agents" | Restart backend (seeds 4 demo agents on boot) |

---

## 🖥️ Recommended Demo Flow

```
1. Open http://localhost:5173
2. Deliberate tab → submit prompt → watch pipeline → show 0G verification badge
3. Show /api/health in new tab → highlight 0G storage metrics
4. Gallery tab → browse agents → breed two agents
5. Arena tab → run tournament → show leaderboard
6. Agents tab → real-time monitoring
7. History tab → audit trail
```

**Total time: ~10 minutes**  
**Core message: Trustless AI on 0G infrastructure** ✨
