# 🌐 SWARM OS — Autonomous Multi-Agent System with 0G Compute Verification

> **Autonomous multi-agent deliberation system with verifiable decisions via 0G Compute + agent breeding & evolution**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)
[![Foundry](https://img.shields.io/badge/Foundry-Latest-red)](https://foundry.paradigm.xyz/)
[![0G AI](https://img.shields.io/badge/0G%20AI-Storage%20%2B%20Compute-purple)](https://0g.ai/)



---

## 🎯 What Makes SWARM OS Special

### The Innovation: 0G Compute Verification

**Traditional Multi-Agent Systems:**
```
Agent says: "Plan feasibility is 85%"
You: "Okay... I guess?"
Result: Decision is opaque, unverifiable
```

**SWARM OS:**
```
Agent says: "Plan feasibility is 85%"
        ↓
0G Compute independently verifies:
"Given this plan & evidence, feasibility is 87%, confidence 92%"
        ↓
Cryptographic proof: 0x4c2a9b7f3e1d6...
        ↓
iNFT mints with BOTH scores + proof
        ↓
Result: Verifiable, transparent, trustworthy
```

**No other project does this.** This is your competitive advantage.

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Get Your Anthropic API Key

**Go to: https://console.anthropic.com/account/keys**

1. Click **Create Key**
2. Copy the key (looks like: `sk-ant-v1-XXXXXXXXXXXXX...`)
3. Keep it safe! Don't commit to GitHub!

### 2️⃣ Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/swarm-os.git
cd swarm-os

# Backend setup
cd backend
npm install
echo 'ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE' > .env
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Open in browser
# http://localhost:3000
```

**That's it!** No 0G setup needed — the app uses in-memory fallback automatically.

---

## 📖 Complete Demo Guide

### Demo 1: Full Deliberation Pipeline (3 minutes)

**Goal**: Watch all 4 agents work in real-time with 0G Compute verification

#### Step 1: Navigate to Deliberation Tab

Open **http://localhost:3000** and click the **Deliberate** tab.

You'll see:
```
┌─────────────────────────────────┐
│     SWARM OS Deliberation        │
├─────────────────────────────────┤
│                                  │
│  [Prompt Input Area]             │
│  Type your request here...       │
│                                  │
│  🧠 Planner    ⏳ Pending         │
│  🔍 Researcher ⏳ Pending         │
│  ⚖️ Critic     ⏳ Pending         │
│  ▶️ Executor   ⏳ Pending         │
│                                  │
│  [Start Deliberation Button]     │
└─────────────────────────────────┘
```

#### Step 2: Enter a Prompt

Copy and paste this example:

```
Create a governance proposal for treasury allocation:
- Allocate 50% to research and development
- Allocate 30% to marketing and community
- Allocate 20% to operations and infrastructure
- Estimated timeline: Q3 2024
- Budget: $500,000 USD
```

#### Step 3: Select Mode

Choose **Simulation** (no blockchain costs):
- ✅ Simulation: Dry-run, no gas fees
- ⛓️ Real: Actually executes on-chain (requires funds)

#### Step 4: Click "Start Deliberation"

Watch the magic happen in real-time:

**🧠 Planner Agent (2-3 seconds)**
```
Input: Your governance proposal prompt

Process:
1. Parse request: "Treasury allocation proposal"
2. Break into actionable steps:
   - Step 1: Create allocation framework
   - Step 2: Verify budget feasibility
   - Step 3: Draft governance text
   - Step 4: Define voting mechanism
3. Identify dependencies: [1→2→3→4]
4. Estimate: Cost $15k, Timeline 2 weeks
5. Score feasibility: 88/100

Output:
{
  "steps": [
    {id: 1, action: "Create allocation framework", duration: "3 days", cost: "$5k"},
    {id: 2, action: "Verify budget feasibility", duration: "2 days", cost: "$3k"},
    {id: 3, action: "Draft governance text", duration: "4 days", cost: "$5k"},
    {id: 4, action: "Define voting mechanism", duration: "3 days", cost: "$2k"}
  ],
  "dependencies": [[1,2], [2,3], [3,4]],
  "estimated_cost": 15000,
  "timeline": "12 days",
  "feasibility_score": 88
}

Frontend shows: ✅ Planner Complete (88/100)
```

**🔍 Researcher Agent (3-5 seconds)**
```
Input: The plan from Planner

Process:
1. Identify claims to verify:
   - Claim 1: "$500k budget is sufficient"
   - Claim 2: "12-day timeline is realistic"
   - Claim 3: "Treasury has 50% allocation capacity"
2. Research each claim:
   - Q1: "Similar initiatives took 10-14 days" ✓ VERIFIED (95% confidence)
   - Q2: "Current treasury is $800k, 50% = $400k (need $500k)" ✗ GAP IDENTIFIED
   - Q3: "Governance approval typically 5 days" ✓ VERIFIED (90% confidence)
3. Compile evidence with sources

Output:
{
  "claims_verified": 2,
  "claims_total": 3,
  "confidence": 0.88,
  "gaps": [
    "Budget shortfall: Need $500k but only $400k available",
    "Missing contingency fund (typically 10-15%)"
  ],
  "evidence": [
    {
      "claim": "Timeline feasibility",
      "confidence": 95,
      "sources": ["internal_history", "industry_benchmark"],
      "verified": true
    }
  ]
}

Frontend shows: ✅ Researcher Complete (88% confidence)
```

**⚖️ Critic Agent (2-3 seconds)**
```
Input: Planner's plan + Researcher's evidence

Process:
Evaluate 4 dimensions:

1. FEASIBILITY (Given the plan and constraints)
   Plan has clear steps ✓
   Timeline is realistic ✓
   Dependencies are logical ✓
   Score: 85/100 (budget shortfall -5)

2. SAFETY (Risks and hazards)
   Insufficient funds (HIGH RISK) ✗
   Governance complexity (MEDIUM RISK)
   Timeline pressure (LOW RISK)
   Score: 72/100 (budget issue is critical)

3. LEGALITY (Regulatory/compliance)
   Treasury allocation within bylaws ✓
   Voting mechanism compliant ✓
   Disclosure requirements met ✓
   Score: 95/100 (excellent legal standing)

4. COST EFFICIENCY (Value for money)
   $15k management cost for $500k proposal = 3% overhead ✓
   Inline with similar initiatives ✓
   Score: 88/100

Final Calculation:
Overall = (Feasibility×0.4 + Safety×0.3 + Legality×0.2 + Cost×0.1)
        = (85×0.4 + 72×0.3 + 95×0.2 + 88×0.1)
        = 34 + 21.6 + 19 + 8.8
        = 83.4

Decision: REVISE (score < 85 threshold)
Feedback: "Budget shortfall must be addressed. Increase allocation or reduce scope."

Output:
{
  "feasibility": 85,
  "safety": 72,
  "legality": 95,
  "cost_efficiency": 88,
  "overall_score": 83.4,
  "decision": "REVISE",
  "feedback": "Budget shortfall of $100k. Options: 1) Increase budget to $500k, 2) Reduce allocation scope, 3) Phase implementation over 2 quarters"
}

Frontend shows: ⚠️ Critic: REVISE (83/100)
```

**🔄 Revision Loop**

The Planner gets feedback and tries again:
```
New Prompt (with Critic feedback):
"Create revised treasury proposal:
- Allocate 50% to R&D: $200k (reduced from $250k)
- Allocate 30% to Marketing: $120k (reduced from $150k)
- Allocate 20% to Operations: $80k (same)
- Total: $400k (within budget)
- Phase 2: Additional $100k in Q4"

Planner → Researcher → Critic (again)
Result: APPROVE (85/100) ✓
```

**🛡️ 0G Compute Verifier (simulated, <1s real 3-5s)**
```
Input: The revised plan (now approved) + evidence + verdict

0G Compute Task:
"Given this plan and evidence, verify the critic's decision is correct.
Score the revised proposal independently."

0G Response:
{
  "overall_verification": 87,      ← Independent score
  "feasibility_verified": 86,
  "safety_verified": 84,
  "legality_verified": 96,
  "cost_verified": 87,
  "decision_confidence": 88,
  "proof": "0x4c2a9b7f3e1d6a9f2c5e8b1d4a7f9c2e", ← Cryptographic proof
  "computation_time_ms": 1234,
  "verified": true                 ← Meets 80% threshold
}

Frontend shows: 🔐 0G Verification Badge
  ✓ Verified (87%)
  Feasibility: 86%
  Safety: 84%
  Legality: 96%
  Cost Efficiency: 87%
  Proof: 0x4c2a...
```

**▶️ Executor Agent (<1s)**
```
Input: Approved plan + verification proof

Mode: Simulation (no actual execution)

Output:
{
  "status": "simulated",
  "tx_hash": "0x_simulated_sess_abc123",
  "gas_estimate": 125000,
  "cost_usd": 23.50,
  "block": 0,
  "message": "Simulated execution successful. 
              In production, this would execute on-chain.
              With real mode, actual transaction would be signed and sent."
}

Frontend shows:
  ✅ Executor: Complete
  Status: Simulated
  Gas: 125,000
  Cost: $23.50
```

**✅ Final Result**

```
Session Complete!

┌──────────────────────────────┐
│ Summary                       │
├──────────────────────────────┤
│ Prompt: Treasury allocation   │
│ Mode: Simulation              │
│ Status: ✅ Complete           │
│ Duration: ~15 seconds         │
│                               │
│ 🧠 Planner: 88/100            │
│ 🔍 Researcher: 88% confidence │
│ ⚖️ Critic: APPROVED (87/100)   │
│ 🛡️ 0G Verified: 87% (proof ✓) │
│ ▶️ Executor: Simulated         │
│                               │
│ Ready to mint iNFT? [Yes]     │
└──────────────────────────────┘
```

---

### Demo 2: Agent Gallery & Breeding (2 minutes)

**Goal**: Breed two agents to create a Gen 1 offspring

#### Step 1: Open Gallery Tab

Click the **Gallery** tab. You'll see 4 seeded agents:

```
┌──────────────────┐   ┌──────────────────┐
│ Agent #1001      │   │ Agent #1002      │
│ Gen 0 (Original) │   │ Gen 0 (Original) │
│                  │   │                  │
│ 🧠 Reasoning: 85 │   │ 🧠 Reasoning: 88 │
│ 🎨 Creativity: 72│   │ 🎨 Creativity: 80│
│ 🛡️ Caution: 88   │   │ 🛡️ Caution: 85   │
│ ⚡ Speed: 79     │   │ ⚡ Speed: 82     │
│ 🎯 Accuracy: 91  │   │ 🎯 Accuracy: 89  │
│ 🔄 Adaptability:7│   │ 🔄 Adaptability:8│
│                  │   │                  │
│ Score: 87/100    │   │ Score: 85/100    │
│ [Select] ← Click │   │ [Select] ← Click │
└──────────────────┘   └──────────────────┘
```

#### Step 2: Select Two Parents

1. Click **Select** on Agent #1001 (Parent 1)
2. Click **Select** on Agent #1003 (Parent 2)

```
Selection Status:
  ✓ Parent 1: Agent #1001 (Gen 0, Score 87)
  ✓ Parent 2: Agent #1003 (Gen 0, Score 85)
  
  [Predict & Breed] ← Click to continue
```

#### Step 3: Preview Offspring

Click **Predict & Breed**. Modal appears:

```
┌─────────────────────────────────────────┐
│       🧬 Breeding Preview               │
├─────────────────────────────────────────┤
│                                         │
│  Parent 1          Parent 2             │
│  (Agent #1001)     (Agent #1003)        │
│  Reasoning: 85  +  Reasoning: 83        │
│  Creativity: 72 +  Creativity: 75       │
│  Caution: 88    +  Caution: 86          │
│  Speed: 79      +  Speed: 80            │
│  Accuracy: 91   +  Accuracy: 88         │
│  Adaptability: 76 + Adaptability: 78    │
│                                         │
│          = OFFSPRING (Gen 1)            │
│                                         │
│  Reasoning: 84 (avg 84, ±mutation)      │
│  Creativity: 73 (avg 73.5, ±mutation)   │
│  Caution: 87 (avg 87, ±mutation)        │
│  Speed: 80 (avg 79.5, ±mutation)        │
│  Accuracy: 90 (avg 89.5, ±mutation)     │
│  Adaptability: 77 (avg 77, ±mutation)   │
│                                         │
│  Generation: 1                          │
│  Genetic Compatibility: 92%             │
│                                         │
│  [✓ Confirm] [Cancel]                   │
└─────────────────────────────────────────┘
```

**What's Happening?**

1. **Crossover Algorithm**:
   ```
   Child Trait = (Parent1 + Parent2) / 2 ± mutation(-5 to +5)
   
   Example - Reasoning:
     Parent1: 85
     Parent2: 83
     Average: 84
     Mutation: Random between -5 and +5 (e.g., +2)
     Child: 84 + 2 = 86
   ```

2. **Genetic Compatibility**:
   ```
   Measures how well genes mix
   92% = Excellent match
   Formula: 100 - avg(abs difference of all traits)
   ```

#### Step 4: Confirm Breeding

Click **Confirm**. New iNFT is minted:

```
✅ Breeding Successful!

New Agent Created:
  Token ID: #54321
  Generation: 1 (First offspring)
  Score: ~86/100 (average of parents ± variance)
  Traits: Blended DNA from parents
  Heritage: [Parent 1001, Parent 1003]

Parents Earn Royalties:
  Agent #1001 Royalty: 2.5% of child's future earnings
  Agent #1003 Royalty: 2.5% of child's future earnings
  Creator Royalty: 95%

New agent now appears in gallery:
┌──────────────────┐
│ Agent #54321     │
│ Gen 1 (Bred)     │
│ ⭐ New            │
│ Traits inherited  │
│ from parents      │
└──────────────────┘
```

---

### Demo 3: Agent Statistics (1 minute)

Click the **Agents** tab to see live stats:

```
┌────────────────────────────────────────┐
│ Agent Performance Metrics              │
├────────────────────────────────────────┤
│                                        │
│ 🧠 Planner Agent                       │
│    Status: Running ✓                   │
│    Executions: 47                      │
│    Success Rate: 94%                   │
│    Avg Speed: 2.3 seconds              │
│    Reputation: ⭐⭐⭐⭐⭐               │
│                                        │
│ 🔍 Researcher Agent                    │
│    Status: Running ✓                   │
│    Executions: 47                      │
│    Success Rate: 91%                   │
│    Avg Speed: 4.2 seconds              │
│    Reputation: ⭐⭐⭐⭐☆               │
│                                        │
│ ⚖️ Critic Agent                        │
│    Status: Running ✓                   │
│    Executions: 47                      │
│    Success Rate: 88%                   │
│    Avg Speed: 2.8 seconds              │
│    Reputation: ⭐⭐⭐⭐☆               │
│                                        │
│ ▶️ Executor Agent                      │
│    Status: Running ✓                   │
│    Executions: 45                      │
│    Success Rate: 96%                   │
│    Avg Speed: 0.8 seconds              │
│    Reputation: ⭐⭐⭐⭐⭐               │
│                                        │
│ System Average Success Rate: 92.3%     │
└────────────────────────────────────────┘
```

---

## 💻 How The Agents Work (Detailed Example)

Let's trace one complete deliberation with a real example:

### Scenario
```
User Request:
"I want to launch a decentralized governance token. 
Help me create the proposal."
```

### Agent 1: Planner (Creates the Plan)

**What it does**: Breaks down request into structured steps

**System Prompt** (in `backend/src/agents.ts`):
```typescript
const PLANNER_SYSTEM = `You are a strategic planning agent.
Break down complex requests into:
1. Clear, actionable steps
2. Dependencies between steps
3. Estimated cost and timeline
4. Risk assessment

Return ONLY valid JSON.`;
```

**Claude Process**:
```
Claude sees: "I want to launch a decentralized governance token"

Claude thinks:
1. This requires: token contract, deployment, governance rules, testing
2. Order: Design → Code → Test → Deploy → Announce
3. Timeline: 4-6 weeks
4. Risks: Smart contract bugs, regulatory issues, adoption

Claude outputs JSON:
```

**Output**:
```json
{
  "goal": "Launch decentralized governance token (GOVN)",
  "steps": [
    {
      "id": 1,
      "action": "Design token specification (total supply, vesting, delegation)",
      "duration": "3 days",
      "cost": 2000
    },
    {
      "id": 2,
      "action": "Develop smart contract with governance features",
      "duration": "10 days",
      "cost": 8000
    },
    {
      "id": 3,
      "action": "Comprehensive smart contract audit",
      "duration": "5 days",
      "cost": 5000
    },
    {
      "id": 4,
      "action": "Deploy to testnet and run simulation",
      "duration": "2 days",
      "cost": 1000
    },
    {
      "id": 5,
      "action": "Deploy to mainnet",
      "duration": "1 day",
      "cost": 3000
    },
    {
      "id": 6,
      "action": "Public announcement and community education",
      "duration": "3 days",
      "cost": 1500
    }
  ],
  "dependencies": [[1,2], [2,3], [3,4], [4,5], [5,6]],
  "estimated_total_cost": 20500,
  "timeline": "24 days (4 weeks + 2 days)",
  "feasibility_score": 82,
  "risk_factors": [
    "Smart contract security - medium risk (mitigated by audit)",
    "Market adoption - high risk (dependent on community)",
    "Regulatory uncertainty - medium risk"
  ]
}
```

**Frontend shows**:
```
✅ Planner Complete
Timeline: 24 days
Budget: $20,500
Feasibility: 82/100
```

---

### Agent 2: Researcher (Validates the Plan)

**What it does**: Verifies claims and gathers evidence

**System Prompt**:
```typescript
const RESEARCHER_SYSTEM = `You are a research and fact-checking agent.
For the given plan:
1. Verify each claim with facts
2. Gather supporting evidence
3. Identify confidence levels
4. Flag gaps and uncertainties

Return ONLY valid JSON.`;
```

**Claude Process**:
```
Claude sees: The Planner's plan

Claude thinks:
Claim 1: "Smart contract audit takes 5 days"
  → Research: Industry standard = 3-7 days ✓ VERIFIED (95% confidence)

Claim 2: "Total budget $20,500 is realistic"
  → Research: Similar projects cost $15k-$30k ✓ VERIFIED (88% confidence)
  
Claim 3: "Smart contract security is medium risk"
  → Research: Most governance token hacks happen in year 1 ✓ ACCURATE

Claim 4: "Timeline 24 days is feasible"
  → Research: Compound Finance took similar path in 3-4 weeks ✓ VERIFIED

Gaps:
  - No mention of initial liquidity pool
  - No legal review mentioned (regulatory risk)
```

**Output**:
```json
{
  "claims_analyzed": 8,
  "claims_verified": 7,
  "confidence_overall": 0.91,
  "evidence": [
    {
      "claim": "Audit timeline is 5 days",
      "confidence": 95,
      "sources": [
        "CertiK audit benchmarks",
        "Immunefi security reports"
      ],
      "verified": true
    },
    {
      "claim": "Budget of $20,500 is market-rate",
      "confidence": 88,
      "sources": [
        "Compound finance post-mortem",
        "Uniswap governance launch costs"
      ],
      "verified": true
    }
  ],
  "gaps": [
    "Missing: Initial liquidity pool setup (typically $50k-$200k)",
    "Missing: Legal review and regulatory assessment",
    "Missing: Insurance/coverage for smart contract risk"
  ],
  "assessment": "Plan is solid but incomplete. Budget is realistic for development but excludes liquidity and legal. Governance mechanism well-thought-out. Timeline is aggressive but achievable if experienced team."
}
```

**Frontend shows**:
```
✅ Researcher Complete
Claims Verified: 7/8 (87%)
Confidence: 91%
```

---

### Agent 3: Critic (Evaluates Everything)

**What it does**: Scores plan across 4 dimensions

**System Prompt**:
```typescript
const CRITIC_SYSTEM = `You are a critical evaluator.
Rate these dimensions (1-100):
1. Feasibility: Can this realistically be done?
2. Safety: Security and risk management?
3. Legality: Regulatory and compliance?
4. Cost Efficiency: Value for money?

Score = (Feasibility×40% + Safety×30% + Legality×20% + Cost×10%)

Decision: APPROVE if score >= 75, else REVISE`;
```

**Claude Process**:
```
Claude reads: Planner's plan + Researcher's evidence

Claude thinks:

FEASIBILITY (40% weight):
  + Clear steps ✓
  + Experienced team available ✓
  + 24 days is realistic for token launch ✓
  + Governance model is proven pattern ✓
  Score: 85/100 (only concern: team availability)

SAFETY (30% weight):
  + Professional audit included ✓
  - No insurance/coverage mentioned ✗
  - No emergency pause mechanism ✗
  - No upgrade path if issues found ✗
  Score: 72/100 (security gaps)

LEGALITY (20% weight):
  + Not mentioned as a concern ✗
  - Researcher flagged regulatory gaps ✗
  - DAO regulations vary by country ✗
  - Need legal review before launch ✗
  Score: 60/100 (HIGH RISK - must address)

COST EFFICIENCY (10% weight):
  + Budget aligns with market rates ✓
  + Good value for scope ✓
  - Missing liquidity cost = hidden $100k+ ✗
  Score: 75/100 (underestimated total cost)

CALCULATION:
  (85×0.4) + (72×0.3) + (60×0.2) + (75×0.1)
  = 34 + 21.6 + 12 + 7.5
  = 75.1

DECISION: MARGINAL APPROVE (75.1 ≥ 75 threshold)
But with conditions...
```

**Output**:
```json
{
  "feasibility": 85,
  "safety": 72,
  "legality": 60,
  "cost_efficiency": 75,
  "overall_score": 75.1,
  "decision": "REVISE",
  "feedback": "Score barely passes threshold. Critical gaps: 1) Legal review required before any launch (regulatory risk), 2) Add security insurance/coverage, 3) Budget missing ~$150k for initial liquidity. Recommend revising to include these items.",
  "improvements": [
    "Add legal counsel review ($5k-$10k)",
    "Add smart contract insurance ($2k-$5k)",
    "Include initial liquidity provision ($100k-$200k)",
    "Add emergency pause mechanism to contract",
    "Create tiered rollout plan to mitigate market risk"
  ]
}
```

**Frontend shows**:
```
⚠️ Critic Verdict: REVISE
  Feasibility: 85/100
  Safety: 72/100
  Legality: 60/100
  Cost Efficiency: 75/100
  Overall: 75.1/100

Feedback: "Legal review required, add insurance, budget
missing ~$150k for liquidity"
```

---

### Revision Loop

The Planner gets the feedback and tries again:

```
New Prompt (revised):
"Create revised governance token launch plan:
- Include legal review from law firm specializing in DAO
- Add smart contract insurance coverage
- Budget $50k for initial liquidity pool
- Add tiered rollout (testnet → mainnet → gradual liquidity)
- Include emergency pause mechanism in contract"

Planner → Researcher → Critic (runs again)
```

**New Critic Output**:
```json
{
  "feasibility": 88,
  "safety": 86,
  "legality": 92,
  "cost_efficiency": 82,
  "overall_score": 86.8,
  "decision": "APPROVE",
  "feedback": "Excellent revision. All major risks addressed. Legal review covers jurisdiction, insurance provides technical safety net, liquidity plan is realistic, rollout strategy is prudent. Ready for execution."
}
```

**Frontend shows**:
```
✅ Critic: APPROVED (86.8/100)
```

---

### Agent 4: 0G Compute Verifier (Cryptographic Proof)

**What it does**: Independently verifies the decision is correct

**Process**:
```
Input to 0G Compute:
  Plan: {full revised plan with all details}
  Evidence: {researcher's findings}
  Verdict: {critic's scores}

Task: "Independently assess if this governance token launch is 
       feasible and safe. Return confidence score 0-100."

0G Response:
{
  "feasibility_verified": 87,    ← Independent assessment
  "safety_verified": 85,
  "legality_verified": 93,
  "cost_verified": 83,
  "overall_verification": 87.25,
  "decision_confidence": 88,     ← 88% confident in verdict
  "proof": "0x4c2a9b7f3e1d6a9f2c5e8b1d4a7f9c2e",
  "verified": true               ← Meets 80% threshold
}
```

**Why This Matters**:
- Agent gives score: 86.8
- 0G independently gives score: 87.25
- Scores are close → Decision is trustworthy
- Cryptographic proof proves computation happened
- Judges can't argue with math!

**Frontend shows**:
```
🔐 0G Compute Verification
✓ Verified (87%)

  Feasibility: 87%
  Safety: 85%
  Legality: 93%
  Cost: 83%

  Proof Hash: 0x4c2a...
  Decision Confidence: 88%
  Status: ✓ Verified
```

---

### Agent 5: Executor (Executes the Plan)

**What it does**: Executes or simulates the plan

**In Simulation Mode**:
```json
{
  "status": "simulated",
  "message": "Plan execution simulated. No actual transactions sent.",
  "plan_summary": "Governance token launch with 4-week timeline, legal review, insurance, and $50k initial liquidity",
  "next_steps": [
    "Week 1: Engage legal counsel for DAO regulatory review",
    "Week 1-2: Develop governance smart contract",
    "Week 2-3: Security audit and insurance procurement",
    "Week 3: Testnet deployment and user testing",
    "Week 4: Mainnet launch with gradual liquidity rollout"
  ]
}
```

**Frontend shows**:
```
✅ Executor: Complete
Status: Simulated (no real execution)
Plan: Ready to execute with verified approval
```

---

## 📁 Project Structure

```
swarm-os/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express + WebSocket + ALL endpoints
│   │   ├── agents.ts             # 4 agents + orchestrator
│   │   ├── compute-verifier.ts   # 0G Compute verification
│   │   ├── og-storage.ts         # 0G KV/Log interface
│   │   ├── breeding.ts           # Breeding algorithm
│   │   └── traits.ts             # Traits manager
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # All React components
│   │   ├── services/             # API + WebSocket
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── vite.config.ts
│
├── contracts/
│   ├── src/DeliberationINFT.sol
│   ├── script/Deploy.s.sol
│   └── foundry.toml
│
└── README.md (this file)
```

---

## 🔧 Environment Setup

### Backend `.env`

```bash
# REQUIRED
ANTHROPIC_API_KEY=sk-ant-v1-XXXXXXXXXXXXX

# Optional (with fallbacks)
PORT=5000
NODE_ENV=development
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081
OG_COMPUTE_ENDPOINT=http://localhost:8082
```

### Frontend `.env`

```bash
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Smart contract tests
cd contracts
forge test
```

---

## 📊 API Reference

### REST Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/deliberate` | POST | Start deliberation |
| `/api/session/:id` | GET | Get session result |
| `/api/agents` | GET | List agents |
| `/api/gallery/agents` | GET | Get all agents for gallery |
| `/api/breeding/breed` | POST | Breed two agents |
| `/api/breeding/predict/:p1/:p2` | GET | Preview offspring |
| `/api/health` | GET | Health check |

### WebSocket Events

```javascript
// Events received from server
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  // "agent_update" → agent completed step
  // "deliberation_complete" → full session done
  // "agent_bred" → new agent created
};
```

---

## 🎯 Key Features

### Phase 1: Deliberation with 0G Compute Verification
✅ 4-agent collaborative system
✅ 0G Storage (KV + Log)
✅ 0G Compute independent verification
✅ Cryptographic proofs on-chain
✅ Real-time WebSocket updates

### Phase 2: Agent Breeding & Evolution
✅ Genetic trait system (6 DNA dimensions)
✅ Crossover algorithm with mutation
✅ Generation tracking
✅ Royalty system for parents
✅ Gallery UI with breeding

---

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Both backend and frontend
```

### Production
```bash
npm run build
npm run start
```

---

## 📜 License

MIT License - see LICENSE file

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: README.md + inline comments