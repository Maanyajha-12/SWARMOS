<div align="center">

# ⛓️ SWARM OS — Smart Contracts

### On-Chain Infrastructure for Trustless Multi-Agent AI Coordination

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20+-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C?style=for-the-badge)](https://getfoundry.sh)
[![0G Galileo](https://img.shields.io/badge/Deployed-0G%20Galileo%2016602-10b981?style=for-the-badge)](https://chainscan-galileo.0g.ai)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](../LICENSE)

</div>

---

## Overview

This package contains the Solidity smart contract suite powering SWARM OS's on-chain layer. Six contracts handle agent registration, tournament coordination, cross-chain messaging, iNFT minting, breeding mechanics, and a novel **Proof-of-Intelligence** commit-reveal consensus mechanism.

All contracts are deployed and verified on **0G Galileo Testnet** (Chain ID: `16602`). See [DEPLOYMENT_PROOF.md](../DEPLOYMENT_PROOF.md) for full transaction hashes and addresses.

---

## Contract Suite

| Contract | Source | Lines | Purpose |
|----------|--------|-------|---------|
| **DeliberationINFT** | [`DeliberationINFT.sol`](src/DeliberationINFT.sol) | ~200 | ERC-721 iNFTs minted per deliberation — stores session metadata, phase hashes, compute proofs, and execution details on-chain |
| **AgentRegistry** | [`AgentRegistry.sol`](src/AgentRegistry.sol) | 123 | Global agent registry with cross-chain score tracking, match records, and breeding counters |
| **ProofOfIntelligence** | [`ProofOfIntelligence.sol`](src/ProofOfIntelligence.sol) | 160 | Novel commit-reveal consensus — agents independently commit hashed decisions before revealing, preventing collusion |
| **TournamentArena** | [`TournamentArena.sol`](src/TournamentArena.sol) | 177 | On-chain tournament lifecycle: creation, entry (with fees), scoring, completion, and prize distribution (70/30 winner/protocol split) |
| **CrossChainBridge** | [`CrossChainBridge.sol`](src/CrossChainBridge.sol) | 127 | Multi-chain message passing with authorized relayer system, replay protection, and proof verification |
| **CrossChainBreeding** | [`CrossChainBreeding.sol`](src/CrossChainBreeding.sol) | 131 | Cross-chain iNFT breeding with genetic hash generation (keccak256 + `prevrandao`), compatibility scoring, and royalty collection |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                       SWARM OS ON-CHAIN LAYER                        │
│                     0G Galileo Testnet (16602)                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │ DeliberationINFT │    │  AgentRegistry   │    │ ProofOfIntel.  │  │
│  │ ────────────────  │    │ ──────────────── │    │ ────────────── │  │
│  │ ERC-721 iNFTs    │◄──►│ Agent profiles   │    │ Commit phase   │  │
│  │ Phase hashes     │    │ Cross-chain scores│    │ Reveal phase   │  │
│  │ Compute proofs   │    │ Match records     │    │ Consensus      │  │
│  │ Execution data   │    │ Breeding counts   │    │ Proof hashes   │  │
│  └──────────────────┘    └────────┬─────────┘    └────────────────┘  │
│                                   │                                   │
│  ┌──────────────────┐    ┌────────┴─────────┐    ┌────────────────┐  │
│  │ TournamentArena  │    │  CrossChainBridge │    │ CrossChain     │  │
│  │ ──────────────── │    │ ──────────────── │    │ Breeding       │  │
│  │ Entry fees       │    │ Relayer auth     │    │ ────────────── │  │
│  │ Score recording  │    │ Replay protect   │    │ Genetic hashes │  │
│  │ Prize distrib.   │    │ Multi-chain msg  │    │ Royalty pool   │  │
│  │ Protocol fees    │    │ Proof verify     │    │ Compatibility  │  │
│  └──────────────────┘    └──────────────────┘    └────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Installation |
|------|---------|-------------|
| **Foundry** | Latest | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |
| **Solidity** | 0.8.21 | Installed automatically by Forge |
| **Git** | 2.x+ | Required for Forge dependency management |

---

## Quick Start

### 1. Install Dependencies

```bash
cd contracts
forge install
```

### 2. Compile

```bash
forge build
```

All 6 contracts compile against Solidity `0.8.21` with the Foundry toolchain.

### 3. Run Tests

```bash
forge test -vvv
```

### 4. Deploy to 0G Galileo Testnet

```bash
# Set environment variables
export PRIVATE_KEY=<your_private_key>
export RPC_URL=https://evmrpc-testnet.0g.ai

# Deploy all contracts in a single batch
forge script script/Deploy.sol:DeployScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --chain-id 16602
```

> **Tip:** Get testnet tokens from the [0G Faucet](https://faucet.0g.ai) before deploying.

### 5. Verify on Explorer

```bash
forge verify-contract <CONTRACT_ADDRESS> src/<Contract>.sol:<ContractName> \
  --chain-id 16602 \
  --verifier etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --verifier-url https://chainscan-galileo.0g.ai/api
```

---

## Environment Variables

Create a `.env` file in the `contracts/` directory:

```env
# Deployer private key (NEVER commit this)
PRIVATE_KEY=<your_private_key>

# 0G Galileo Testnet RPC
RPC_URL=https://evmrpc-testnet.0g.ai

# Block explorer API key (for contract verification)
ETHERSCAN_API_KEY=<your_api_key>

# Chain ID
CHAIN_ID=16602
```

> **Security:** The `.env` file is listed in `.gitignore` and must never be committed to version control.

---

## Contract Reference

### DeliberationINFT

ERC-721 contract for minting intelligent NFTs that represent autonomous deliberation sessions.

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `mint(sessionId, prompt, planHash, evidenceHash, verdictHash, resultHash, computeProofHash, computeConfidence, verdictScore, metadataURI)` | `onlyOrchestrator` | Mints an iNFT with full deliberation metadata |
| `recordExecution(tokenId, transactionHash, gasUsed, costUsd)` | `onlyOrchestrator` | Records execution details post-transaction |
| `verifyComputeProof(tokenId, proofHash, confidence)` | `onlyOrchestrator` | Updates compute proof after 0G verification |

#### Data Model

```solidity
struct DeliberationMetadata {
    string sessionId;           // Unique session identifier
    string prompt;              // Original user prompt
    bytes32 planHash;           // SHA-256 of planning phase output
    bytes32 evidenceHash;       // SHA-256 of research results
    bytes32 verdictHash;        // SHA-256 of critic verdict
    bytes32 resultHash;         // SHA-256 of execution result
    bytes32 computeProofHash;   // 0G Compute TEE proof hash
    uint8 computeConfidence;    // Verification confidence (0–100)
    uint8 verdictScore;         // Overall decision score (0–100)
    uint256 timestamp;          // Block timestamp at mint
    bool executed;              // Whether execution was recorded
}
```

#### Events

- `DeliberationMinted(uint256 tokenId, string sessionId)` — new iNFT created
- `ExecutionRecorded(uint256 tokenId, string transactionHash)` — execution data stored
- `ComputeProofVerified(uint256 tokenId, bytes32 proofHash)` — proof updated

---

### AgentRegistry

Global agent directory with cross-chain score aggregation.

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `registerAgent(tokenId, name, homeChain)` | `onlyOwner` | Register a new agent with chain affinity |
| `updateScore(tokenId, chainId, score, proofHash)` | `onlyOwner` | Update per-chain score with proof |
| `recordMatch(tokenId, won)` | `onlyOwner` | Log a match result (win/loss) |
| `recordBreeding(tokenId)` | `onlyOwner` | Increment breeding counter |
| `getAgent(tokenId)` | `view` | Retrieve full agent profile |
| `getChainScore(tokenId, chainId)` | `view` | Read chain-specific score |
| `getTotalAgents()` | `view` | Count of registered agents |

#### Events

- `AgentRegistered(uint256 tokenId, string name, uint256 homeChain)`
- `ScoreUpdated(uint256 tokenId, uint256 chainId, uint256 score, bytes32 proofHash)`
- `MatchRecorded(uint256 tokenId, bool won, uint256 newScore)`

---

### ProofOfIntelligence

Novel commit-reveal consensus mechanism for trustless multi-agent decision-making.

#### Lifecycle

```
1. createRound(prompt)          → Phase 0: Commit
2. commitDecision(roundId, hash) → Agents submit keccak256(decision + salt)
3. startRevealPhase(roundId)     → Phase 1: Reveal
4. revealDecision(roundId, decision, salt) → Verify hash matches commitment
5. finalizeConsensus(roundId, score, proof) → Phase 2: Complete
```

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `createRound(prompt)` | `onlyOwner` | Start a new consensus round |
| `commitDecision(roundId, commitHash)` | `public` | Agent commits hashed decision |
| `startRevealPhase(roundId)` | `onlyOwner` | Transition to reveal phase |
| `revealDecision(roundId, decision, salt)` | `public` | Reveal and verify commitment |
| `finalizeConsensus(roundId, score, proofHash)` | `onlyOwner` | Finalize with consensus score |
| `verifyConsensus(roundId)` | `view` | Check consensus status and proof |
| `setConsensusThreshold(threshold)` | `onlyOwner` | Adjust agreement threshold (default: 75%) |

#### Events

- `RoundCreated(uint256 id, string prompt)`
- `DecisionCommitted(uint256 roundId, address agent, bytes32 commitHash)`
- `DecisionRevealed(uint256 roundId, address agent, bool verified)`
- `ConsensusReached(uint256 roundId, uint256 score, bool divergence, bytes32 proof)`

---

### TournamentArena

On-chain competitive elimination with entry fees and automated prize distribution.

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `createTournament(prompt, entryFee, maxParticipants, duration)` | `onlyOwner` | Create a new tournament |
| `enterTournament(tournamentId, agentId)` | `payable` | Enter agent (requires entry fee) |
| `recordScore(tournamentId, agentId, score, round, proof)` | `onlyOwner` | Record round scores |
| `completeTournament(tournamentId, winnerId, score, proof)` | `onlyOwner` | Finalize and distribute prizes |
| `setProtocolFee(percent)` | `onlyOwner` | Adjust protocol fee (max 50%) |
| `withdrawFees()` | `onlyOwner` | Withdraw accumulated protocol fees |

#### Prize Distribution

- **Winner**: 70% of prize pool
- **Protocol**: 30% of prize pool (configurable)

#### Events

- `TournamentCreated(uint256 id, string prompt, uint256 entryFee, uint256 maxParticipants)`
- `AgentEntered(uint256 tournamentId, uint256 agentId)`
- `TournamentCompleted(uint256 id, uint256 winnerId, uint256 winnerScore, uint256 prize)`
- `ScoreRecorded(uint256 tournamentId, uint256 agentId, uint256 score, uint256 round)`

---

### CrossChainBridge

Multi-chain message relay with authorized relayer infrastructure and replay protection.

#### Supported Chains

| Chain | Chain ID | Status |
|-------|----------|--------|
| 0G Galileo Testnet | `16602` | ✅ Default |
| Ethereum Sepolia | `11155111` | ✅ Default |
| Polygon Mumbai | `80001` | ✅ Default |
| Custom chains | Configurable | Via `addChain()` |

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `sendMessage(destChain, payloadHash)` | `payable` | Send a cross-chain message (relay fee required) |
| `receiveMessage(messageId, proofHash)` | `onlyRelayer` | Process an incoming message |
| `verifyProof(proofHash)` | `view` | Check if a proof has been processed |
| `addRelayer(address)` | `onlyOwner` | Authorize a new relayer |
| `removeRelayer(address)` | `onlyOwner` | Revoke relayer authorization |
| `addChain(chainId)` | `onlyOwner` | Register a new supported chain |
| `setRelayFee(fee)` | `onlyOwner` | Update relay fee (default: 0.001 ETH) |

#### Events

- `MessageSent(uint256 id, uint256 sourceChain, uint256 destChain, bytes32 payloadHash, address sender)`
- `MessageReceived(uint256 id, bytes32 proofHash, address relayer)`
- `RelayerAdded(address relayer)` / `RelayerRemoved(address relayer)`
- `ChainAdded(uint256 chainId)`

---

### CrossChainBreeding

Cross-chain agent breeding with deterministic genetic hash generation and royalty tracking.

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `breed(parent1Id, parent1Chain, parent2Id, parent2Chain, compatibility)` | `payable` | Breed two agents (cross-chain or same-chain) |
| `getBreeding(breedingId)` | `view` | Retrieve breeding record |
| `getBreedCount(tokenId)` | `view` | Check how many times an agent has bred |
| `setBreedingFee(fee)` | `onlyOwner` | Update breeding fee (default: 0.01 ETH) |
| `withdrawRoyalties()` | `onlyOwner` | Withdraw accumulated royalties |

#### Genetics

Genetic hashes are deterministically generated from:

```solidity
keccak256(abi.encodePacked(
    parent1Id, parent1Chain,
    parent2Id, parent2Chain,
    block.timestamp, block.prevrandao
))
```

#### Royalty Model

| Recipient | Share |
|-----------|-------|
| Parent 1 owner | 2.5% |
| Parent 2 owner | 2.5% |
| Protocol | 2.5% |

#### Events

- `BreedingCompleted(uint256 id, uint256 parent1Id, uint256 parent1Chain, uint256 parent2Id, uint256 parent2Chain, uint256 childId, uint256 childChain, bytes32 geneticHash)`
- `RoyaltyDistributed(uint256 breedingId, uint256 amount)`

---

## Project Structure

```
contracts/
├── src/
│   ├── DeliberationINFT.sol      # ERC-721 iNFT contract
│   ├── AgentRegistry.sol         # Global agent registry
│   ├── ProofOfIntelligence.sol   # Commit-reveal consensus
│   ├── TournamentArena.sol       # Tournament lifecycle
│   ├── CrossChainBridge.sol      # Multi-chain messaging
│   └── CrossChainBreeding.sol    # Cross-chain breeding
├── script/
│   └── Deploy.sol                # Batch deployment script
├── test/
│   └── DeliberationINFT.t.sol    # Unit tests
├── lib/                          # Forge dependencies (forge-std)
├── foundry.toml                  # Foundry configuration
└── .env                          # Local environment variables (gitignored)
```

---

## Foundry Configuration

Key settings from [`foundry.toml`](foundry.toml):

| Setting | Value |
|---------|-------|
| Solidity version | `0.8.21` |
| Optimizer | Default (200 runs) |
| Formatter line length | 100 |
| Model checker engine | CHC |
| Model checker timeout | 10,000 ms |

---

## Deployment Addresses

All contracts are live on **0G Galileo Testnet** (Chain ID: `16602`):

| Contract | Address |
|----------|---------|
| DeliberationINFT | [`0x1cd62cb08754a12fcc3427559e616a2898812d59`](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) |
| AgentRegistry | [`0xc8106baf71c3a38177167edf51ac1391cbb8e2e6`](https://chainscan-galileo.0g.ai/address/0xc8106baf71c3a38177167edf51ac1391cbb8e2e6) |
| ProofOfIntelligence | [`0xdc83dd755ba02265d23922104b0b54c304537bf2`](https://chainscan-galileo.0g.ai/address/0xdc83dd755ba02265d23922104b0b54c304537bf2) |
| TournamentArena | [`0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668`](https://chainscan-galileo.0g.ai/address/0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668) |
| CrossChainBridge | [`0x8417b73a19a1db21a10d0737fb8bbd469ee21545`](https://chainscan-galileo.0g.ai/address/0x8417b73a19a1db21a10d0737fb8bbd469ee21545) |

For full transaction hashes and gas costs, see [DEPLOYMENT_PROOF.md](../DEPLOYMENT_PROOF.md).

---

## Security

### Access Control

All state-mutating functions are restricted with `onlyOwner` or `onlyOrchestrator` modifiers. The deployer address is set as the owner at construction time.

### Protections

- ✅ **Replay protection** — `CrossChainBridge` tracks processed proofs via `processedProofs` mapping
- ✅ **Self-breed prevention** — `CrossChainBreeding` rejects identical parent pairs
- ✅ **Score bounds checking** — All scores capped at `100`
- ✅ **Fee ceiling** — Tournament protocol fee capped at `50%`
- ✅ **Commitment integrity** — `ProofOfIntelligence` uses `keccak256(decision + salt)` verification
- ✅ **Phase enforcement** — Consensus rounds enforce strict phase transitions (commit → reveal → complete)

### Known Limitations

- Contracts use `onlyOwner` instead of role-based access control. For production mainnet deployment, consider migrating to OpenZeppelin `AccessControl`.
- `CrossChainBridge` relies on trusted relayers. A trustless cross-chain protocol (e.g., LayerZero, Axelar) should be evaluated for mainnet.
- `block.prevrandao` is used for breeding randomness. For high-value breeding operations, consider Chainlink VRF.

---

## Gas Benchmarks

Deployment gas costs on 0G Galileo Testnet:

| Contract | Gas Used | Cost (0G) |
|----------|----------|-----------|
| DeliberationINFT | 2,788,363 | 0.0112 |
| AgentRegistry | 1,442,380 | 0.0058 |
| ProofOfIntelligence | 2,115,251 | 0.0085 |
| TournamentArena | 1,283,309 | 0.0051 |
| CrossChainBridge | 1,838,774 | 0.0074 |
| **Total** | **9,468,077** | **0.0379** |

---

## Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run a specific test
forge test --match-test testMint -vvv

# Gas report
forge test --gas-report

# Coverage (requires lcov)
forge coverage
```

---

## License

MIT — see [LICENSE](../LICENSE) for details.

---

<div align="center">

Part of the [SWARM OS](../README.md) ecosystem · Deployed on [0G Network](https://0g.ai)

</div>
