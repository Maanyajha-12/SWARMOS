# 🎬 SWARM OS — ETHGlobal Demo Guide

> **4-minute demo script** for ETHGlobal judges. Updated for the **live production deployment** on Vercel with real 0G Galileo testnet contracts.

---

## 🌐 Quick Links

| Resource | URL |
|----------|-----|
| **Live App** | [frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app) |
| **Deployment Proof** | [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md) |
| **Block Explorer** | [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) |
| **0G Compute Dashboard** | [pc.testnet.0g.ai](https://pc.testnet.0g.ai) |

---

## Demo Options

### Option A: Live Demo (Recommended — No Setup Required)

Just open the Vercel URL in your browser:

```
https://frontend-six-steel-45.vercel.app
```

The app runs in **demo mode** automatically — all 8 tabs work with realistic simulated data. No backend needed.

### Option B: Full Local Demo (With Backend)

```bash
# Terminal 1: Start backend
cd backend && npm install && npm run dev

# Terminal 2: Start frontend
cd frontend && npm install && npm run dev

# Verify
curl http://localhost:5000/api/health   # → { status: "healthy" }
open http://localhost:3000               # → Full live app with backend
```

---
## ⛓️ On-Chain Proof Quick Reference

> These are the **real, deployed** contract addresses on 0G Galileo Testnet. Click to verify.

| Contract | Address (click to verify) |
|----------|--------------------------|
| **DeliberationINFT** | [`0x1cd62cb0...812d59`](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) |
| **AgentRegistry** | [`0xc8106baf...8e2e6`](https://chainscan-galileo.0g.ai/address/0xc8106baf71c3a38177167edf51ac1391cbb8e2e6) |
| **ProofOfIntelligence** | [`0xdc83dd75...37bf2`](https://chainscan-galileo.0g.ai/address/0xdc83dd755ba02265d23922104b0b54c304537bf2) |
| **TournamentArena** | [`0x52e4fc0d...6f668`](https://chainscan-galileo.0g.ai/address/0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668) |
| **CrossChainBridge** | [`0x8417b73a...21545`](https://chainscan-galileo.0g.ai/address/0x8417b73a19a1db21a10d0737fb8bbd469ee21545) |

Full details: [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md)

---

## 🧪 Build Verification

```bash
# Frontend production build (zero errors)
cd frontend && npm run build
# ✓ built in 2.70s — 398 KB (114 KB gzipped)

# Contract compilation (requires Foundry)
cd contracts && forge build
# ✓ all 5 contracts compile

# Contract deployment (already done — addresses above)
forge script script/Deploy.sol:DeployScript \
  --rpc-url https://evmrpc-testnet.0g.ai \
  --broadcast --private-key $PRIVATE_KEY
# ✅ ONCHAIN EXECUTION COMPLETE & SUCCESSFUL
```

---

## 🎯 Key Talking Points for Judges

1. **Novel IP**: Proof-of-Intelligence consensus — agents commit decisions before seeing others (prevents collusion)
2. **Real 0G Integration**: Compute Router API (TEE inference) + KV/Log storage + 5 on-chain contracts
3. **Evolution**: Not just AI agents — AI agents that *evolve through competition and breeding*
4. **On-Chain Proof**: Every deliberation produces a SHA-256 hash verifiable on [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)
5. **Cross-Chain**: First multi-chain agent swarm with bridge-synchronized state
6. **Production-Ready**: 8 UI tabs, 25+ API endpoints, 5 deployed contracts, Vercel deployment, demo mode

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| Smart Contracts | 5 (deployed to 0G Galileo) |
| API Endpoints | 25+ |
| UI Tabs | 8 |
| Supported Chains | 3 (Ethereum, Polygon, 0G) |
| AI Agents | 4 specialized |
| Agent Traits | 6 genetic dimensions |
| Pipeline Steps | 5 (Plan → Research → Critique → Verify → Execute) |
| Verification | SHA-256 + 0G Compute TEE |
| Total Deploy Gas | 9,468,077 (0.0379 0G) |
| Build Size | 398 KB (114 KB gzipped) |

---

<div align="center">

*All contracts and transactions are independently verifiable on [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)*

Powered by [0G Network](https://0g.ai) · Built for ETHGlobal

</div>
