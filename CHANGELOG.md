# Changelog

All notable changes to SWARM OS are documented here.

## [1.0.0] — 2026-04-29

### 🎯 Phase 1: Multi-Agent Deliberation
- 4-agent pipeline: Planner → Researcher → Critic → Executor
- Real-time WebSocket streaming
- Dual LLM support: Anthropic Claude (primary) + OpenAI GPT-4 Turbo (fallback)
- Automatic revision loops (max 2 revisions when Critic rejects)

### 🔗 0G Network Integration
- **0G Compute**: Trustless AI verification via Serving Broker + TEE inference
  - Endpoint: `serving-broker-testnet.0g.ai`
  - Models: Qwen 2.5 7B, GPT-OSS-20B, Gemma 3 27B
  - SHA-256 proof hash generation
  - Automatic fallback to local simulation
- **0G KV Store**: Agent profiles, session metadata, breeding records
- **0G Log Store**: Verification proofs, deliberation logs, breeding history
- **0G Chain**: DeliberationINFT.sol — agent NFTs with 6 traits on Galileo Testnet
- In-memory fallback for all storage operations

### 🧬 Phase 2: Agent Breeding & Evolution
- Genetic crossover + mutation (±5) algorithm
- 6-dimensional trait model
- Generation tracking with full heritage chain
- Compatibility scoring between parents
- Visual gallery with breeding modal

### 🏟️ Phase 3: Agent Arena
- 5-round competitive tournaments
- Natural selection (winners breed)
- Custom prompt tournaments
- Global leaderboard with win rates
- Tournament history tracking

### 🎨 Frontend
- Premium glassmorphism dark theme
- Inter + JetBrains Mono typography
- 6-tab navigation: Deliberate, Agents, Gallery, Arena, History, Statistics
- Real-time agent monitoring
- 0G verification badge with proof hash display
- Responsive design with micro-animations

### 📖 Documentation
- README with full 0G integration guide
- DEMO_GUIDE for judges (10-minute walkthrough)
- DEMO_SCRIPT (3-minute presenter script)
- CONTRIBUTING guide with coding standards
- API reference (20+ endpoints)
