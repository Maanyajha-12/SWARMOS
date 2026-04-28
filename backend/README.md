# Backend - SWARM OS Server

Express.js + Node.js server with multi-agent orchestration and 0G Compute verification.

## Features

- **Multi-Agent System**: Planner, Researcher, Critic, Executor
- **0G Compute Verification**: Verifiable on-chain decisions
- **Real-time Updates**: WebSocket for live agent tracking
- **0G Storage Integration**: KV store + Log endpoints
- **Smart Contract Integration**: iNFT minting with proof

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env
cp .env.example .env
nano .env

# 3. Start development server
npm run dev
```

## Environment Variables

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# 0G Endpoints
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081
OG_COMPUTE_ENDPOINT=http://localhost:8082

# Blockchain
RPC_URL=https://rpc-testnet.0g.ai
PRIVATE_KEY=0x...
DELIBERATION_INFT_ADDRESS=0x...
```

## File Structure

```
src/
├── agents.ts          # Planner, Researcher, Critic, Executor
├── compute-verifier.ts # 0G Compute integration
├── og-storage.ts      # 0G KV/Log interface
├── index.ts           # Express routes + WebSocket
└── server.ts          # Server configuration
```

## API Endpoints

All endpoints return JSON. Port: 5000

### Deliberation

- `POST /api/deliberate` - Start deliberation
- `GET /api/session/:id` - Get session details

### Agents

- `GET /api/agents` - List all agents
- `GET /api/agent/:name/stats` - Agent statistics
- `GET /api/health` - Health check
- `GET /api/stats` - System statistics

### 0G Storage

- `GET /api/0g/kv/:key` - Read KV
- `POST /api/0g/kv/:key` - Write KV
- `GET /api/0g/log/:name` - Read Log
- `POST /api/0g/log/:name` - Append Log

## WebSocket Events

Connect to `ws://localhost:5000/` and listen for:

- `planner_complete` - Planner finished
- `researcher_complete` - Researcher finished
- `critic_complete` - Critic finished
- `compute_verified` - 0G Compute verification done ✅ NEW
- `executor_complete` - Execution finished
- `inft_minted` - NFT minted

## Key Classes

### SwarmOrchestrator

Coordinates all agents through deliberation flow:
1. Planner creates plan
2. Researcher validates
3. Critic evaluates
4. 0G Compute verifies ✅ NEW
5. Executor executes

### ComputeVerifier

Interfaces with 0G Compute network:
- `verifyDecision()` - Remote verification
- `verifyDecisionSimulated()` - Local verification
- `healthCheck()` - Endpoint status

### OGStorage

Interfaces with 0G endpoints:
- KV Store (state)
- Log (audit trail)

## Development

```bash
# Open index.ts in VS Code
# Changes auto-reload via nodemon
# Check console for logs
```

## Production

```bash
# Build
npm run build

# Start
npm start

# With PM2
pm2 start npm --name "swarmos-backend" -- start
```

## Troubleshooting

**Port already in use**
```bash
lsof -i :5000
kill -9 <PID>
```

**0G endpoints not connecting**
```bash
curl http://localhost:8080/health
```

**Debug WebSocket**
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:5000');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```
