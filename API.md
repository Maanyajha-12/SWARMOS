# 📚 SWARM OS - Complete API Documentation

---

## 🔗 REST API Endpoints

**Base URL**: `http://localhost:5000`  
**Default Port**: 5000  
**Response Format**: JSON

---

## Authentication

Currently no authentication required. In production, add API keys:

```bash
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### POST /api/deliberate

Start a new deliberation session with AI agents.

**Request:**
```bash
curl -X POST http://localhost:5000/api/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a governance proposal for treasury allocation",
    "mode": "simulation"
  }'
```

**Parameters:**
- `prompt` (required): The deliberation prompt
- `mode` (optional): "simulation" (default) or "execution"

**Response:** (202 Accepted)
```json
{
  "session_id": "sess_1234567890_abc123",
  "status": "started",
  "timestamp": "2024-04-26T10:30:00Z"
}
```

**Status Codes:**
- 202: Deliberation started
- 400: Invalid prompt
- 500: Internal error

---

### GET /api/session/:sessionId

Get the current state and results of a deliberation session.

**Request:**
```bash
curl http://localhost:5000/api/session/sess_1234567890_abc123
```

**Response:**
```json
{
  "session_id": "sess_1234567890_abc123",
  "status": "complete",
  "plan": {
    "steps": [
      {
        "id": 1,
        "action": "Draft proposal",
        "duration": "2 hours",
        "cost": 50
      }
    ],
    "estimated_total_cost": 150,
    "feasibility_score": 85
  },
  "evidence": {
    "claims_analyzed": 15,
    "claims_verified": 14,
    "confidence_overall": 0.93
  },
  "verdict": {
    "feasibility": 85,
    "safety": 90,
    "legality": 95,
    "cost_efficiency": 80,
    "overall_score": 87.5,
    "decision": "APPROVE"
  },
  "verification": {
    "verified": true,
    "confidence": 88,
    "proof": "0x...",
    "timestamp": "2024-04-26T10:35:00Z",
    "computeHash": "hash_..."
  },
  "execution": {
    "tx_hash": "0x...",
    "status": "simulated",
    "gas_used": 125000,
    "cost_usd": 23.50,
    "block": 18523456,
    "verification_proof": "0x..."
  }
}
```

**Status Codes:**
- 200: Success
- 404: Session not found

---

### GET /api/agents

Get all agents and their current statistics.

**Request:**
```bash
curl http://localhost:5000/api/agents
```

**Response:**
```json
{
  "agents": [
    {
      "name": "Planner",
      "status": "running",
      "executions": 42,
      "successes": 40,
      "success_rate": 0.952
    },
    {
      "name": "Researcher",
      "status": "running",
      "executions": 42,
      "successes": 41,
      "success_rate": 0.976
    },
    {
      "name": "Critic",
      "status": "running",
      "executions": 42,
      "successes": 40,
      "success_rate": 0.952
    },
    {
      "name": "Executor",
      "status": "running",
      "executions": 38,
      "successes": 38,
      "success_rate": 1.0
    }
  ]
}
```

---

### GET /api/agent/:name/stats

Get statistics for a specific agent.

**Request:**
```bash
curl http://localhost:5000/api/agent/planner/stats
```

**Response:**
```json
{
  "name": "Planner",
  "executions": 42,
  "successes": 40,
  "success_rate": 0.952
}
```

**Parameters:**
- `:name` - Agent name: "planner", "researcher", "critic", or "executor"

---

### GET /api/health

Health check for the entire system.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "agents": {
    "planner": "running",
    "researcher": "running",
    "critic": "running",
    "executor": "running"
  },
  "connections": 5,
  "active_sessions": 3,
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

### GET /api/stats

Get comprehensive system statistics.

**Request:**
```bash
curl http://localhost:5000/api/stats
```

**Response:**
```json
{
  "total_executions": 156,
  "total_successes": 148,
  "overall_success_rate": 0.949,
  "agents": {
    "planner": {
      "name": "Planner",
      "executions": 42,
      "successes": 40,
      "success_rate": 0.952
    },
    "researcher": {
      "name": "Researcher",
      "executions": 42,
      "successes": 41,
      "success_rate": 0.976
    },
    "critic": {
      "name": "Critic",
      "executions": 42,
      "successes": 40,
      "success_rate": 0.952
    },
    "executor": {
      "name": "Executor",
      "executions": 30,
      "successes": 27,
      "success_rate": 0.9
    }
  },
  "active_sessions": 3,
  "connected_clients": 5,
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

## 0G Storage Endpoints

### GET /api/0g/kv/:key

Read a value from 0G Key-Value store.

**Request:**
```bash
curl http://localhost:5000/api/0g/kv/agent:planner:plan:sess_123
```

**Response:**
```json
{
  "key": "agent:planner:plan:sess_123",
  "value": {
    "steps": [...],
    "estimated_total_cost": 150
  },
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

### POST /api/0g/kv/:key

Write a value to 0G Key-Value store.

**Request:**
```bash
curl -X POST http://localhost:5000/api/0g/kv/my:key \
  -H "Content-Type: application/json" \
  -d '{"value": {"data": "example"}}'
```

**Response:**
```json
{
  "key": "my:key",
  "status": "set",
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

### GET /api/0g/log/:logName

Read entries from 0G Log store.

**Request:**
```bash
curl http://localhost:5000/api/0g/log/agent:research:logs:sess_123
```

**Response:**
```json
{
  "log": "agent:research:logs:sess_123",
  "entries": [
    {
      "claim": "Claim 1",
      "verified": true,
      "confidence": 0.95,
      "timestamp": "2024-04-26T10:31:00Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

### POST /api/0g/log/:logName

Append an entry to 0G Log store.

**Request:**
```bash
curl -X POST http://localhost:5000/api/0g/log/my:log \
  -H "Content-Type: application/json" \
  -d '{"entry": {"message": "Log entry"}}'
```

**Response:**
```json
{
  "log": "my:log",
  "status": "appended",
  "timestamp": "2024-04-26T10:30:00Z"
}
```

---

## 🔌 WebSocket API

Connect to receive real-time updates.

**URL**: `ws://localhost:5000`

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

### Events

#### connection
Initial connection confirmation.
```json
{
  "type": "connection",
  "status": "connected",
  "client_id": "1234567890"
}
```

#### agent_update
Agent completed a phase.
```json
{
  "type": "agent_update",
  "agent": "planner",
  "event": "complete",
  "data": {
    "steps": [...],
    "estimated_cost": 150
  }
}
```

#### compute_verified
0G Compute verification completed.
```json
{
  "type": "agent_update",
  "agent": "compute",
  "event": "verified",
  "data": {
    "verified": true,
    "confidence": 88,
    "proof": "0x...",
    "feasibility_verified": 85,
    "safety_verified": 90,
    "legality_verified": 95,
    "cost_verified": 80
  }
}
```

#### deliberation_complete
Entire deliberation completed.
```json
{
  "type": "deliberation_complete",
  "session_id": "sess_...",
  "result": {
    "status": "complete",
    "plan": {...},
    "evidence": {...},
    "verdict": {...},
    "verification": {...},
    "execution": {...}
  }
}
```

#### deliberation_error
Error during deliberation.
```json
{
  "type": "deliberation_error",
  "error": "Error message",
  "session_id": "sess_..."
}
```

---

## Error Responses

All errors return JSON with status code:

```json
{
  "error": "Human-readable error message",
  "session_id": "sess_... (if applicable)"
}
```

**Common Status Codes:**
- 200: OK
- 202: Accepted (async operation)
- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting

Not currently implemented. In production, add:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

---

## Example: Complete Workflow

```bash
# 1. Start deliberation
curl -X POST http://localhost:5000/api/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create treasury allocation proposal",
    "mode": "simulation"
  }'
# Response: {"session_id": "sess_abc123", "status": "started"}

# 2. Monitor via WebSocket (in Node.js or browser)
ws = new WebSocket('ws://localhost:5000')
ws.onmessage = (e) => console.log(JSON.parse(e.data))

# 3. Poll for results
sleep 5  # Wait for deliberation
curl http://localhost:5000/api/session/sess_abc123

# 4. Check system stats
curl http://localhost:5000/api/stats

# 5. Get specific agent performance
curl http://localhost:5000/api/agent/critic/stats
```

---

## Best Practices

1. **Use WebSocket for real-time updates** instead of polling
2. **Store session_id** for later reference
3. **Implement retry logic** for failed requests
4. **Handle errors gracefully** with try-catch
5. **Keep connections alive** with ping/pong
6. **Validate all inputs** before sending to API

---

## SDK Availability

Currently available:
- cURL (HTTP client)
- JavaScript/TypeScript (WebSocket)
- Python (requests library)

---

**Last Updated**: April 28, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
