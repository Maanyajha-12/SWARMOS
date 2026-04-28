# Frontend - SWARM OS Dashboard

React + TypeScript dashboard for real-time agent monitoring and deliberation control.

## Features

- **Real-time Updates**: WebSocket integration
- **Agent Monitoring**: Track performance metrics
- **Deliberation Control**: Submit prompts and monitor progress
- **0G Verification Display**: Show compute confidence & proof
- **iNFT Gallery**: View minted NFTs
- **System Statistics**: Overall health metrics

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env
cp .env.example .env

# 3. Start development server
npm start
```

## Environment Variables

```bash
# Backend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Blockchain
REACT_APP_RPC_URL=https://rpc-testnet.0g.ai
REACT_APP_INFT_CONTRACT=0x...

# 0G Endpoints
REACT_APP_0G_KV_URL=http://localhost:8080
REACT_APP_0G_LOG_URL=http://localhost:8081
REACT_APP_0G_COMPUTE_URL=http://localhost:8082
```

## File Structure

```
src/
├── components/
│   ├── DeliberationPanel.tsx    # Main input
│   ├── AgentMonitor.tsx         # Agent status
│   ├── VerdictPanel.tsx         # Verdict display (NEW)
│   ├── VerificationBadge.tsx    # 0G proof (NEW)
│   ├── ExecutorPanel.tsx        # Transaction info (NEW)
│   ├── SessionHistory.tsx       # Past sessions
│   └── SystemStats.tsx          # Overall stats
├── services/
│   ├── websocket.ts             # WebSocket client
│   └── api.ts                   # HTTP client
├── App.tsx                      # Main component
└── main.tsx                     # Entry point
```

## Key Components

### DeliberationPanel
User input for new deliberations with simulation/execution mode selection.

### VerificationBadge (NEW)
Displays 0G Compute verification results:
- Confidence percentage
- Verified badge
- Cryptographic proof
- Verification message

### VerdictPanel (NEW)
Shows critic verdict with scores:
- Feasibility
- Safety
- Legality
- Cost Efficiency
- Overall score
- Decision with feedback

### ExecutorPanel (NEW)
Displays execution details:
- Transaction hash
- Gas used
- Cost USD
- Block number
- Verification proof

### AgentMonitor
Real-time agent statistics with success rates.

### SystemStats
Overall system health and performance metrics.

## Development

```bash
# Start with Hot Reload
npm start

# Build for production
npm run build

# Preview build
npm run preview
```

## Styling

TailwindCSS + custom glass morphism effects. Colors:

```
Primary: #3B82F6 (blue)
Secondary: #8B5CF6 (purple)
Success: #10B981 (green)
Warning: #F59E0B (orange)
Error: #EF4444 (red)
Background: Dark gradient
```

## WebSocket Integration

Connect and listen for real-time updates:

```typescript
import WebSocketManager from './services/websocket';

const ws = WebSocketManager.getInstance();
ws.connect();

ws.on('compute_verified', (data) => {
  // Update VerificationBadge with data
  // data.confidence: 0-100
  // data.proof: cryptographic hash
  // data.verified: boolean
});

ws.on('executor_complete', (data) => {
  // Update ExecutorPanel with data
  // data.tx_hash
  // data.gas_used
  // data.cost_usd
  // data.verification_proof
});
```

## API Integration

```typescript
import { createDeliberation, getSession } from './services/api';

// Start deliberation
const response = await createDeliberation(
  "Create governance proposal",
  "simulation"
);
// response.session_id

// Get session updates
const session = await getSession(sessionId);
// session.plan, evidence, verdict, verification, execution
```

## Production

```bash
# Build
npm run build

# Deploy static files from dist/
# Ensure API_URL points to production backend
REACT_APP_API_URL=https://api.swarmos.io npm run build
```

## Troubleshooting

**WebSocket connection failed**
- Check `REACT_APP_WS_URL` in .env
- Verify backend is running on port 5000
- Check CORS headers

**Blank page**
- Open DevTools (F12)
- Check Console for errors
- Verify all env vars are set

**Slow updates**
- Check network latency
- Reduce WebSocket message frequency
- Profile in DevTools
