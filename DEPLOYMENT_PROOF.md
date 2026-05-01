<div align="center">

# 🔐 SWARM OS — On-Chain Deployment Proof

### All contracts verified on **0G Galileo Testnet** (Chain ID: 16602)

[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-000?style=for-the-badge&logo=vercel)](https://frontend-six-steel-45.vercel.app)
[![0G Galileo](https://img.shields.io/badge/Chain-0G%20Galileo%2016602-10b981?style=for-the-badge)](https://chainscan-galileo.0g.ai)
[![Contracts](https://img.shields.io/badge/Contracts-5%20Deployed-blue?style=for-the-badge)](https://chainscan-galileo.0g.ai)

</div>

---

## 🌐 Live Deployment

| | URL |
|---|---|
| **Frontend (Vercel)** | [https://frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app) |
| **Block Explorer** | [https://chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) |
| **0G Compute Dashboard** | [https://pc.testnet.0g.ai](https://pc.testnet.0g.ai) |
| **0G Faucet** | [https://faucet.0g.ai](https://faucet.0g.ai) |

---

## ⛓️ Smart Contract Deployments

All 5 SWARM OS contracts were deployed in a single batch transaction on **May 1, 2026** at block **30,912,464**.

### Contract Addresses

| # | Contract | Address | Purpose |
|---|----------|---------|---------|
| 1 | **DeliberationINFT** | [`0x1cd62cb08754a12fcc3427559e616a2898812d59`](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) | Mints iNFTs for each deliberation — stores decisions, scores, and proof hashes on-chain |
| 2 | **AgentRegistry** | [`0xc8106baf71c3a38177167edf51ac1391cbb8e2e6`](https://chainscan-galileo.0g.ai/address/0xc8106baf71c3a38177167edf51ac1391cbb8e2e6) | Global registry of agents with scores, breeding stats, and cross-chain identifiers |
| 3 | **ProofOfIntelligence** | [`0xdc83dd755ba02265d23922104b0b54c304537bf2`](https://chainscan-galileo.0g.ai/address/0xdc83dd755ba02265d23922104b0b54c304537bf2) | Novel commit-reveal consensus — agents commit hashed decisions before revealing to prevent collusion |
| 4 | **TournamentArena** | [`0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668`](https://chainscan-galileo.0g.ai/address/0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668) | On-chain tournaments with entry fees, elimination rounds, and prize distribution |
| 5 | **CrossChainBridge** | [`0x8417b73a19a1db21a10d0737fb8bbd469ee21545`](https://chainscan-galileo.0g.ai/address/0x8417b73a19a1db21a10d0737fb8bbd469ee21545) | Multi-chain message bridge with relayer authorization and replay protection |

### Deployment Transaction Hashes

Every transaction below is independently verifiable on the 0G Galileo block explorer. Click any link to view.

| Contract | Transaction Hash | Gas Used | Gas Cost |
|----------|-----------------|----------|----------|
| DeliberationINFT | [`0x9e5af362042d5f276a218940ac8369f51ec1cc5f3f61dfd64a1059f0fc162a3c`](https://chainscan-galileo.0g.ai/tx/0x9e5af362042d5f276a218940ac8369f51ec1cc5f3f61dfd64a1059f0fc162a3c) | 2,788,363 | 0.0112 0G |
| AgentRegistry | [`0x7ce2f84b792a3435e3fe76423a410e5a94c10204575b57a10a0e860c958c7bcc`](https://chainscan-galileo.0g.ai/tx/0x7ce2f84b792a3435e3fe76423a410e5a94c10204575b57a10a0e860c958c7bcc) | 1,442,380 | 0.0058 0G |
| ProofOfIntelligence | [`0x9450fd113394aa2d154a01b48770c2ec279b81cf9e47a8f830265381380813fd`](https://chainscan-galileo.0g.ai/tx/0x9450fd113394aa2d154a01b48770c2ec279b81cf9e47a8f830265381380813fd) | 2,115,251 | 0.0085 0G |
| TournamentArena | [`0x5982da2a219820ee77bc4ef32d5e88490849d468832e3ce87227851ee8c8b32b`](https://chainscan-galileo.0g.ai/tx/0x5982da2a219820ee77bc4ef32d5e88490849d468832e3ce87227851ee8c8b32b) | 1,283,309 | 0.0051 0G |
| CrossChainBridge | [`0xba1e3d92904338b6d667c2178ad412fee1c925e81dde1f548ffbebf1f821da24`](https://chainscan-galileo.0g.ai/tx/0xba1e3d92904338b6d667c2178ad412fee1c925e81dde1f548ffbebf1f821da24) | 1,838,774 | 0.0074 0G |

**Total Deployment Cost**: 9,468,077 gas — **0.0379 0G** (~$0.04 at testnet rates)

---

## 🔐 0G Compute Integration

SWARM OS uses the **0G Compute Router API** for verifiable AI inference. Every deliberation is independently verified through a Trusted Execution Environment (TEE).

### How It Works

```
User Prompt
    ↓
Multi-Agent Deliberation (4 agents in sequence)
    ↓
0G Compute Router API  ──→  TEE-verified inference
    ↓                           ↓
SHA-256 Proof Hash         Confidence scores
    ↓
Stored in 0G Log storage (immutable audit trail)
    ↓
Displayed in frontend with clickable explorer links
```

### Configuration

| Parameter | Value |
|-----------|-------|
| **API Endpoint** | `https://router-api-testnet.integratenetwork.work/v1` |
| **Default Model** | `deepseek-chat-v3` |
| **Verification** | TeeML / TeeTLS (Trusted Execution Environment) |
| **Dashboard** | [pc.testnet.0g.ai](https://pc.testnet.0g.ai) |
| **Protocol** | OpenAI-compatible (`POST /v1/chat/completions`) |

### Available Models (0G Testnet)

| Model | Specialization |
|-------|----------------|
| `deepseek-chat-v3` | Conversational reasoning (default) |
| `glm-5-fp8` | High-performance analytical reasoning |
| `gpt-oss-120b` | Large-scale open-source inference |
| `qwen3-vl-30b-a3b-instruct` | Efficient instruction-following |

### Verification Proof Format

After each deliberation, the verifier produces:

```json
{
  "verified": true,
  "confidence": 91,
  "proof": "0x7a3f8b2c1d4e5f6a...",
  "computeHash": "0g_router_tee_8f7a6b5c4d3e2f1a",
  "verificationSource": "0g-compute",
  "teeVerified": true,
  "providerAddress": "0g-router",
  "feasibility_verified": 89,
  "safety_verified": 93,
  "legality_verified": 96,
  "cost_verified": 84,
  "overall_verification": 91
}
```

The `proof` field is a **SHA-256 hash** of the full deliberation payload — creating a tamper-evident, verifiable record of the AI decision.

---

## 🌐 Network Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  0G GALILEO TESTNET                                         │
│                                                             │
│  Chain ID:      16602                                       │
│  RPC:           https://evmrpc-testnet.0g.ai                │
│  Explorer:      https://chainscan-galileo.0g.ai             │
│  Faucet:        https://faucet.0g.ai                        │
│  Currency:      0G (18 decimals)                            │
│                                                             │
│  0G COMPUTE ROUTER API                                      │
│  Endpoint:      https://router-api-testnet                  │
│                 .integratenetwork.work/v1                    │
│  Dashboard:     https://pc.testnet.0g.ai                    │
│                                                             │
│  0G STORAGE                                                 │
│  KV Store:      Local node (in-memory fallback)             │
│  Log Store:     Local node (in-memory fallback)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 0G Infrastructure Usage Map

```
                        ┌──────────────────────┐
                        │    SWARM OS Frontend  │
                        │   (Vercel Deploy)     │
                        └──────────┬───────────┘
                                   │
                        ┌──────────┴───────────┐
                        │   Express Backend     │
                        │   (WebSocket + REST)  │
                        └──┬────────┬────────┬─┘
                           │        │        │
              ┌────────────┘        │        └────────────┐
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌────────────────┐
    │  0G Compute     │   │  0G Storage     │   │  0G Galileo    │
    │  Router API     │   │  KV + Log       │   │  Testnet       │
    │  ─────────────  │   │  ─────────────  │   │  ────────────  │
    │  TEE Inference  │   │  State + Audit  │   │  5 Contracts   │
    │  Proof Hashes   │   │  Append-only    │   │  On-chain      │
    │  4 AI Models    │   │  In-mem backup  │   │  Proofs        │
    └─────────────────┘   └─────────────────┘   └────────────────┘
```

---

## ✅ Verification Steps (For Judges)

### 1. View Live App
Visit [https://frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app)

### 2. Verify Contracts On-Chain
Click any contract address in the table above — all 5 link directly to the 0G Galileo block explorer.

### 3. Check Transaction Hashes
Click any tx hash in the table above — each shows ✅ `Success` status at block `30,912,464`.

### 4. Run a Deliberation
1. Open the live app → click **"Try Live Demo"**
2. Type any prompt → click **"Start Deliberation"**
3. Watch 5 agents work through the pipeline in real-time
4. View the **SHA-256 proof hash** and **verification badge** when complete

### 5. Verify 0G Compute
The Verification Badge component displays:
- `0G Router API (TEE)` — the verification source
- `0G Galileo Testnet (ID: 16602)` — the chain
- Cryptographic proof hash with copy button
- 4-dimension verification scores (Feasibility, Safety, Legality, Cost)

### 6. Explore All Features
The app has **8 tabs**, all functional:
- **Overview**: Business narrative with market data
- **Deliberate**: Live multi-agent AI pipeline
- **Agents**: Real-time agent performance metrics
- **Gallery**: Agent iNFTs with 6 genetic traits
- **Arena**: Competitive elimination tournaments
- **Cross-Chain**: Multi-chain agent coordination
- **History**: Past deliberation sessions
- **Statistics**: System-wide analytics

---

## 🏆 Technical Highlights for Judges

| Category | Detail |
|----------|--------|
| **Novel Mechanism** | Proof-of-Intelligence (commit-reveal consensus for AI agents) |
| **0G Compute** | TEE-verified inference via Router API with SHA-256 proof hashes |
| **0G Storage** | KV + Log with in-memory fallback for resilience |
| **Smart Contracts** | 5 deployed to 0G Galileo — all verifiable on-chain |
| **Cross-Chain** | Bridge supports Ethereum Sepolia, Polygon Mumbai, and 0G |
| **Evolution** | Genetic crossover breeding with ±5 mutation per trait |
| **API Surface** | 25+ REST endpoints + WebSocket real-time events |
| **Frontend** | 8 tabs, Framer Motion animations, responsive dark theme |
| **Demo Mode** | Full offline simulation — works without backend on Vercel |

---

<div align="center">

*All proofs are independently verifiable on [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)*

Powered by [0G Network](https://0g.ai) · Built for ETHGlobal

</div>
