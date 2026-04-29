# 🎬 SWARM OS — Demo Guide & Presenter Script

> **Duration:** 10-15 minutes  
> **Prerequisites:** Backend + Frontend running (see Quick Start below)

---

## ⚡ Quick Start (Before the Demo)

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Verify both are running:
- Backend: http://localhost:5000/api/health → should return `{"status":"healthy"}`
- Frontend: http://localhost:5173 → should show the SWARM OS dashboard

---

## 🎙️ Demo Script

### Opening (30 seconds)

> *"This is **SWARM OS** — an autonomous multi-agent deliberation system built on the 0G Network. Four AI agents collaborate to analyze requests, verify facts, critique plans, and execute decisions — with every step cryptographically verified on 0G Compute and stored in 0G Storage."*

---

### Demo 1: Multi-Agent Deliberation (3-4 minutes)

**Tab:** Deliberate

1. **Enter a prompt:**
   ```
   Create a governance proposal for allocating $50,000 of DAO treasury to fund open-source AI safety research
   ```

2. **Click "Start Deliberation"** and narrate:

   > *"Watch what happens — the Planner agent breaks this down into actionable steps. The Researcher verifies each claim. The Critic scores the plan across four dimensions: feasibility, safety, legality, and cost efficiency. And 0G Compute provides cryptographic verification."*

3. **Point out the pipeline bar** at the top showing real-time progress

4. **When complete, highlight:**
   - The Planner's step-by-step breakdown
   - The Researcher's evidence and confidence score
   - The Critic's 4-dimensional verdict panel
   - The 0G verification badge with proof hash
   - The final APPROVE/REVISE decision

**Key talking point:**
> *"If the Critic scores below 75, it automatically sends the plan back for revision — up to 2 times. This creates a self-correcting loop."*

---

### Demo 2: Agent Gallery & Breeding (2-3 minutes)

**Tab:** Gallery

1. **Show the 4 seeded agents** — point out their trait profiles:
   > *"Each agent has 6 traits: reasoning, creativity, caution, speed, accuracy, and adaptability. These are stored as on-chain metadata."*

2. **Click Agent #1001** (selects as Parent 1)
3. **Click Agent #1003** (selects as Parent 2)
4. **Click "Predict & Breed"**

5. **In the modal, explain:**
   > *"The breeding algorithm performs genetic crossover — each child trait is the average of both parents, plus a random mutation of ±5 points. This creates genetic diversity while preserving strong traits."*

6. **Click "Confirm Breed"** — new agent appears in the gallery

**Key talking point:**
> *"This creates a new generation agent with combined DNA. Over time, you can evolve increasingly specialized agents."*

---

### Demo 3: Agent Arena Tournament (2-3 minutes)

**Tab:** Arena

1. **Click "Start Standard Tournament"**
   > *"Four agents compete across 5 rounds. Each round, they're scored on deliberation quality. The top performers breed, improving the next generation."*

2. **Point out the bracket view** — scores per round, rankings
3. **Scroll to the winner card** — highlight the score and generation
4. **Switch to the Leaderboard tab** — show all-time rankings
5. **Switch to Statistics tab** — show arena-wide metrics

**Key talking point:**
> *"This is natural selection for AI agents. The arena drives continuous improvement through competition and breeding."*

---

### Demo 4: Real-time Monitoring (1-2 minutes)

**Tab:** Agents

> *"Every agent's performance is tracked in real-time — executions, success rate, and status."*

**Tab:** Statistics

> *"System-wide metrics give a complete view of operations."*

**Tab:** History

> *"Every deliberation session is stored and retrievable — creating a full audit trail."*

---

### Closing (30 seconds)

> *"SWARM OS combines multi-agent AI with 0G's decentralized infrastructure. Every decision is verified, every evolution is tracked, and every agent improves over time. This is autonomous AI that's transparent, auditable, and self-improving."*

---

## 🎯 Suggested Demo Prompts

These prompts produce the most interesting deliberation results:

| # | Prompt | Why It's Good |
|---|--------|---------------|
| 1 | `Create a governance proposal for allocating $50,000 of DAO treasury to fund AI safety research` | Multi-step, has cost/safety dimensions |
| 2 | `Design a decentralized identity verification system using zero-knowledge proofs` | Technical complexity, strong research output |
| 3 | `Propose a carbon credit trading protocol on 0G Network` | Cross-domain, feasibility challenges |
| 4 | `Build an autonomous agent marketplace with quality scoring` | Self-referential, good breeding tie-in |
| 5 | `Create emergency response coordination system for natural disasters` | Safety-critical, shows Critic's value |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `backend/.env` has at least one API key |
| "Anthropic failed, falling back to OpenAI" | Normal! Means Anthropic credits exhausted, OpenAI takes over |
| WebSocket shows "Disconnected" | Restart backend: `cd backend && npm run dev` |
| Frontend shows blank page | Check browser console, restart: `cd frontend && npm run dev` |
| Gallery shows "No agents" | Run a deliberation first, or restart backend (seeds 4 demo agents) |
| Arena tournament error | Restart backend to reload arena routes |

---

## 📊 What to Emphasize to Judges

1. **0G Integration is real** — KV storage, Log storage, and Compute verification all wired up
2. **LLM fallback is production-grade** — Anthropic → OpenAI with zero code changes
3. **Real-time WebSocket streaming** — not polling, true live updates
4. **Breeding is algorithmic** — crossover + mutation with generation tracking
5. **The arena is self-improving** — winners breed, creating better agents
6. **Full audit trail** — every decision, every verification, every evolution tracked
7. **Beautiful UI** — premium glassmorphism dark theme with Inter + JetBrains Mono

---

## 🖥️ Recommended Demo Flow

```
1. Open http://localhost:5173
2. Deliberate tab → submit prompt → watch pipeline
3. Gallery tab → show agents → breed two agents
4. Arena tab → run tournament → show leaderboard
5. Agents tab → show real-time monitoring
6. History tab → show audit trail
```

**Total time: ~10 minutes**  
**Impression: Production-ready autonomous AI system** ✨
