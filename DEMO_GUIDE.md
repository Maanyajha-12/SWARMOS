# 🎬 SWARM OS — ETHGlobal Demo Guide

> **4-minute demo script** for ETHGlobal submission. Follow this exactly for maximum impact.

---

## Pre-Demo Setup (Before Recording)

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Verify both running
curl http://localhost:5000/api/health  # Should return { status: "healthy" }
open http://localhost:3000              # Should show landing page
```

**Checklist before recording:**
- [ ] Backend running on port 5000 (shows "🚀 SWARM OS Backend Server Started")
- [ ] Frontend running on port 3000 (shows "VITE ready")
- [ ] Browser open at `http://localhost:3000`
- [ ] Overview tab shows the landing page with hero text
- [ ] Status badges show "Live" and "Healthy" in top-right

---

## 🎥 Demo Flow (4 Minutes)

### ⏱ 0:00–0:30 — The Hook (Overview Tab)

**What judges see first**: The landing page — this is your elevator pitch.

**Script:**
> "SWARM OS is a trustless multi-agent AI decision system built on 0G Network."
> 
> "AI agents make $2.3 trillion in automated decisions annually — zero are verifiable. We fix that."

**Actions:**
1. Page loads on **Overview** tab (default)
2. Show the hero: "Trustless AI Decision-Making for the Multi-Chain Future"
3. Point out the 4 stats: 12 agents, 847 decisions verified, 3 chains, 91% confidence
4. Slowly scroll to **Problem / Solution** cards
5. Scroll to **How It Works** pipeline diagram (6 steps)
6. Show the **Revenue Model** section briefly

---

### ⏱ 0:30–2:00 — Live Deliberation (Deliberate Tab)

**This is the main event** — judges see 4 AI agents working in real-time.

**Script:**
> "Let me show you a live deliberation. Four agents independently analyze this decision."
> 
> "Each agent produces a cryptographic commitment before seeing others — this is our novel Proof-of-Intelligence consensus."

**Actions:**
1. Click **"Try Live Demo"** button (navigates to Deliberate tab)
2. Type prompt: 'Should we launch a decentralized governance token with quadratic voting?'?`
3. Keep **Simulation** mode selected
4. Click **Start Deliberation**
5. **WATCH** — the 5 pipeline phases light up in sequence:
   - **Planner** (yellow → green): "Creating execution plan..."
   - **Researcher** (yellow → green): "Gathering evidence..."
   - **Critic** (yellow → green): "Evaluating feasibility, safety..."
   - **Verifier** (yellow → green): "0G Compute TEE verification..."
   - **Executor** (yellow → green): "Generating execution report..."
6. Point out the **animated progress** — each phase shows real data
7. When complete, show:
   - **Verdict Panel**: 4 score bars (feasibility, safety, legality, cost)
   - **Verification Badge**: `0x...` SHA-256 proof hash with copy button
   - **APPROVE/REVISE** decision with overall score percentage

**Key talking point:**
> "Every step is verified through 0G Compute TEE. The proof hash is a SHA-256 of the full deliberation — immutable and verifiable."

---

### ⏱ 2:00–2:30 — Agent Evolution (Gallery Tab)

**Show the breeding system** — AI agents evolve through genetic crossover.

**Script:**
> "After deliberation, agents are minted as iNFTs with 6 genetic traits. Top performers can breed."

**Actions:**
1. Click **Gallery** tab
2. Show the 4 agent cards with colorful trait bars (reasoning, creativity, caution, speed, accuracy, adaptability)
3. Click **Agent #1003** (highlight: selected as Parent 1)
4. Click **Agent #1001** (highlight: selected as Parent 2)
5. Click **"Predict & Breed"**
6. Show the **Breeding Modal**:
   - Parent traits side-by-side
   - Predicted offspring (blended traits ±5 mutation)
   - Compatibility score
   - Animated crossover icon
7. Click **"Confirm Breeding"**
8. New Gen 1 agent appears in gallery

**Key talking point:**
> "This creates a 'survival of the fittest' for AI — agents literally evolve through competition and breeding."

---

### ⏱ 2:30–3:00 — Competition (Arena Tab)

**Show competitive tournaments.**

**Script:**
> "Agents compete in elimination tournaments. Winners breed, losers are eliminated."

**Actions:**
1. Click **Arena** tab
2. Click **"Start Standard Tournament"**
3. Show 5 rounds of competition results
4. Click **Leaderboard** sub-tab — show rankings with win rates
5. Mention: "Entry fees go to the prize pool — 70% to winner, 30% to protocol"

---

### ⏱ 3:00–3:30 — Cross-Chain Intelligence (Cross-Chain Tab)

**Show multi-chain architecture.**

**Script:**
> "SWARM OS operates across three blockchains — Ethereum, Polygon, and 0G Chain."

**Actions:**
1. Click **Cross-Chain** tab
2. Show the 3-chain visualization cards (Ethereum, Polygon, 0G Chain)
3. Point out per-chain stats: agents, avg scores, message counts
4. Show **Bridge Connections** with animated message flow between chains
5. Scroll to **Global Leaderboard** with multi-chain rankings

**Key talking point:**
> "Agents can be bred across chains. A parent on Ethereum can breed with a parent on Polygon — the child inherits traits from both chains."

---

### ⏱ 3:30–4:00 — Closing Impact

**Script:**
> "To recap: SWARM OS combines four novel technologies:"
> 
> "1. Multi-agent deliberation with 4 independent AI agents"
> "2. Proof-of-Intelligence — commit-reveal consensus preventing collusion"  
> "3. 0G Compute TEE verification with on-chain proof hashes"
> "4. Evolutionary breeding — AI agents that literally improve over time"
>
> "We have 6 smart contracts, 3 chains, and 25+ API endpoints. All built on 0G Network."
>
> "SWARM OS — trustless AI decisions, verified on-chain, evolving through competition."

**Actions:**
1. Navigate back to **Overview** tab
2. Show the **Market & Revenue** section:
   - TAM: $2.3T → SAM: $50B → Initial: $500M
   - 4 revenue streams
3. Click **"Launch Deliberation"** CTA at bottom
4. End on the deliberation page

---

## 🧪 Verification Checklist

Run these before recording to ensure everything works:

### Build Verification
```bash
# Frontend production build (must be zero errors)
cd frontend && npm run build

# Backend TypeScript check
cd backend && npx tsc --noEmit

# Contract compilation (requires Foundry)
cd contracts && forge build
```

### API Health Checks
```bash
# System health
curl http://localhost:5000/api/health

# Agent stats
curl http://localhost:5000/api/agents

# Gallery agents
curl http://localhost:5000/api/gallery/agents

# Cross-chain status
curl http://localhost:5000/api/cross-chain/status

# PoI consensus test
curl -X POST http://localhost:5000/api/poi/run \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test consensus"}'

# Cross-chain leaderboard
curl http://localhost:5000/api/cross-chain/leaderboard
```

### Visual Verification
- [ ] Landing page loads with hero text and stats
- [ ] All 8 tabs render without errors
- [ ] Deliberation shows real-time pipeline
- [ ] Gallery shows 4 agents with trait bars
- [ ] Breeding modal works with prediction
- [ ] Arena tournament runs 5 rounds
- [ ] Cross-chain shows 3 chains with bridge connections
- [ ] Status shows "Live" and "Healthy"

---

## 🎯 Key Talking Points for Judges

1. **Novel IP**: Proof-of-Intelligence consensus — agents commit decisions before seeing others (prevents collusion)
2. **Real 0G Integration**: Compute TEE verification + KV/Log storage + on-chain proof hashes
3. **Evolution**: Not just AI agents — AI agents that *evolve through competition*
4. **Business Model**: 4 clear revenue streams with real economics
5. **Cross-Chain**: First multi-chain agent swarm with bridge-synchronized state
6. **Production-Ready**: 8 UI tabs, 25+ API endpoints, 6 smart contracts, responsive design

---

## 📊 Metrics to Highlight

| Metric | Value |
|--------|-------|
| Smart Contracts | 6 |
| API Endpoints | 25+ |
| UI Tabs | 8 |
| Supported Chains | 3 |
| AI Agents | 4 specialized |
| Agent Traits | 6 genetic dimensions |
| Pipeline Steps | 5 (Plan → Research → Critique → Verify → Execute) |
| Verification | SHA-256 + TEE |
