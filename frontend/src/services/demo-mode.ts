// frontend/src/services/demo-mode.ts
// Simulates the full deliberation pipeline for demo/offline mode
// Used when backend is unreachable (e.g., Vercel deploy without hosted backend)

export interface DemoEvent {
  type: string
  agent?: string
  event?: string
  data?: any
  result?: any
  session_id?: string
  timestamp?: string
}

const DEMO_PLAN = {
  goal: "Deploy cross-chain governance framework with verifiable AI decision-making",
  steps: [
    { id: 1, action: "Analyze existing governance contracts across target chains (Ethereum, Polygon, 0G)", duration: "15m", cost: 25 },
    { id: 2, action: "Design cross-chain message protocol with replay protection", duration: "20m", cost: 50 },
    { id: 3, action: "Implement bridge contract with multi-sig validation", duration: "30m", cost: 100 },
    { id: 4, action: "Deploy agent registry with unified scoring system", duration: "15m", cost: 40 },
    { id: 5, action: "Build Proof-of-Intelligence consensus mechanism", duration: "25m", cost: 75 },
    { id: 6, action: "Run cross-chain tournament simulation with 4 agents", duration: "20m", cost: 60 },
    { id: 7, action: "Generate cryptographic verification proofs via 0G Compute", duration: "10m", cost: 30 },
  ],
  dependencies: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  estimated_total_cost: 380,
  timeline: "2 hours 15 minutes",
  feasibility_score: 87,
  risk_factors: [
    "Bridge security requires multi-sig threshold validation",
    "Cross-chain latency may affect tournament timing",
    "0G Compute TEE availability on testnet",
  ],
}

const DEMO_EVIDENCE = {
  claims_analyzed: 8,
  claims_verified: 7,
  confidence_overall: 0.89,
  evidence: [
    { claim: "Cross-chain messaging protocol is technically feasible", confidence: 94, sources: ["LayerZero Whitepaper", "Chainlink CCIP Docs"], verified: true },
    { claim: "Multi-sig bridge security meets industry standards", confidence: 91, sources: ["OWASP Smart Contract Guidelines", "Bridge Security Audit Framework"], verified: true },
    { claim: "0G Compute TEE provides verifiable inference", confidence: 88, sources: ["0G Network Documentation", "TEE Attestation Standards"], verified: true },
    { claim: "Tournament economics are sustainable at scale", confidence: 85, sources: ["DeFi Protocol Revenue Analysis", "Agent Economy Models"], verified: true },
    { claim: "Proof-of-Intelligence consensus is novel", confidence: 96, sources: ["arXiv Multi-Agent Consensus Survey", "Patent Database Search"], verified: true },
    { claim: "iNFT breeding algorithm produces viable offspring", confidence: 82, sources: ["Genetic Algorithm Research", "NFT Trait Inheritance Papers"], verified: true },
    { claim: "Cross-chain state synchronization achieves eventual consistency", confidence: 79, sources: ["Distributed Systems Theory", "CAP Theorem Analysis"], verified: true },
  ],
  gaps: [
    "Long-term MEV resistance in cross-chain tournaments not fully analyzed",
    "Mainnet gas cost projections need real-world validation",
  ],
  assessment: "The cross-chain governance framework demonstrates strong technical viability. 7 of 8 claims verified with high confidence. The Proof-of-Intelligence mechanism is confirmed novel with no prior art found. Minor gaps in MEV analysis are acceptable for testnet deployment.",
}

const DEMO_VERDICT = {
  feasibility: 88,
  safety: 92,
  legality: 95,
  cost_efficiency: 82,
  overall_score: 89.4,
  decision: "APPROVE" as const,
  feedback: "The cross-chain agent swarm architecture demonstrates exceptional design quality. The Proof-of-Intelligence consensus mechanism is genuinely novel and well-suited for verifiable AI governance. Security considerations are thorough with multi-sig bridge protection. Cost efficiency could be improved by batching cross-chain messages.",
  improvements: [
    "Batch cross-chain messages to reduce bridge fees by 40%",
    "Add circuit breaker for bridge operations exceeding gas thresholds",
    "Implement agent reputation decay for inactive participants",
  ],
}

const DEMO_VERIFICATION = {
  verified: true,
  confidence: 91,
  proof: "0x7a3f8b2c1d4e5f6a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6",
  timestamp: new Date().toISOString(),
  computeHash: "0g_router_tee_8f7a6b5c4d3e2f1a",
  message: "Decision verified via 0G Compute Router API (deepseek-chat-v3) — 91% confidence | Chain: 0G Galileo (16602)",
  verificationSource: "0g-compute",
  teeVerified: true,
  providerAddress: "0g-router",
  decision_confidence: 91,
  feasibility_verified: 89,
  safety_verified: 93,
  legality_verified: 96,
  cost_verified: 84,
  overall_verification: 91,
}

const DEMO_EXECUTION = {
  tx_hash: "0x4a2b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
  status: "simulated",
  gas_used: 187432,
  cost_usd: 0.42,
  block: 1847293,
  timestamp: new Date().toISOString(),
  verification_proof: "0x7a3f8b2c1d4e5f6a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6",
}

const DEMO_FULL_RESULT = {
  session_id: `sess_demo_${Date.now().toString(36)}`,
  prompt: "",
  status: "complete",
  plan: DEMO_PLAN,
  evidence: DEMO_EVIDENCE,
  verdict: DEMO_VERDICT,
  verification: DEMO_VERIFICATION,
  execution: DEMO_EXECUTION,
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
}

// Demo agents for gallery
export const DEMO_GALLERY_AGENTS = [
  {
    tokenId: 1001, sessionId: "sess_demo_001", generation: 0, score: 87,
    traits: { reasoning: 88, creativity: 72, caution: 85, speed: 79, accuracy: 92, adaptability: 76 },
    prompt: "Deploy smart contract for token swap", decision: "APPROVE",
    parents: [0, 0], heritage: [], createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    tokenId: 1002, sessionId: "sess_demo_002", generation: 0, score: 84,
    traits: { reasoning: 82, creativity: 90, caution: 68, speed: 85, accuracy: 78, adaptability: 88 },
    prompt: "Create governance proposal for treasury allocation", decision: "APPROVE",
    parents: [0, 0], heritage: [], createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    tokenId: 1003, sessionId: "sess_demo_003", generation: 0, score: 92,
    traits: { reasoning: 91, creativity: 65, caution: 95, speed: 70, accuracy: 96, adaptability: 72 },
    prompt: "Audit DeFi protocol smart contracts", decision: "APPROVE",
    parents: [0, 0], heritage: [], createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    tokenId: 1004, sessionId: "sess_demo_004", generation: 0, score: 79,
    traits: { reasoning: 75, creativity: 88, caution: 72, speed: 92, accuracy: 80, adaptability: 85 },
    prompt: "Design NFT marketplace mechanics", decision: "APPROVE",
    parents: [0, 0], heritage: [], createdAt: new Date().toISOString(),
  },
  {
    tokenId: 2001, sessionId: "bred_2001", generation: 1, score: 89,
    traits: { reasoning: 85, creativity: 81, caution: 77, speed: 82, accuracy: 85, adaptability: 82 },
    prompt: "Bred from Agent #1001 × Agent #1002", decision: "BRED",
    parents: [1001, 1002], heritage: [1001, 1002], createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
]

// Demo leaderboard
export const DEMO_LEADERBOARD = [
  { rank: 1, agent_id: 1001, agent_name: "Alpha",  generation: 8,  wins: 23, losses: 2,  win_rate: 92, avg_score: 87.3, best_score: 98, total_earnings: 1250, breeding_count: 12 },
  { rank: 2, agent_id: 1002, agent_name: "Beta",   generation: 6,  wins: 18, losses: 7,  win_rate: 72, avg_score: 84.2, best_score: 96, total_earnings: 980,  breeding_count: 8  },
  { rank: 3, agent_id: 1003, agent_name: "Gamma",  generation: 4,  wins: 12, losses: 13, win_rate: 48, avg_score: 81.1, best_score: 92, total_earnings: 650,  breeding_count: 5  },
  { rank: 4, agent_id: 1004, agent_name: "Delta",  generation: 2,  wins: 5,  losses: 20, win_rate: 20, avg_score: 78.4, best_score: 88, total_earnings: 320,  breeding_count: 2  },
]

// Demo cross-chain data
export const DEMO_CROSS_CHAIN = {
  chains: [
    { id: 1, name: "Ethereum", agents: 4, avgScore: 87.3, totalMessages: 142, status: "active", color: "#627EEA" },
    { id: 137, name: "Polygon", agents: 4, avgScore: 84.1, totalMessages: 89, status: "active", color: "#8247E5" },
    { id: 0, name: "0G Chain", agents: 4, avgScore: 88.5, totalMessages: 67, status: "active", color: "#00D4AA" },
  ],
  bridges: [
    { from: "Ethereum", to: "Polygon", messages: 45, lastSync: new Date(Date.now() - 300000).toISOString(), status: "synced" },
    { from: "Polygon", to: "0G Chain", messages: 32, lastSync: new Date(Date.now() - 180000).toISOString(), status: "synced" },
    { from: "Ethereum", to: "0G Chain", messages: 28, lastSync: new Date(Date.now() - 420000).toISOString(), status: "synced" },
  ],
  globalLeaderboard: [
    { agent_id: 1001, name: "Alpha", ethereum_score: 87.3, polygon_score: 86.1, og_score: 88.5, average_score: 87.3, global_rank: 1, chains_active: 3 },
    { agent_id: 1002, name: "Beta",  ethereum_score: 84.2, polygon_score: 83.5, og_score: 85.0, average_score: 84.2, global_rank: 2, chains_active: 3 },
    { agent_id: 1003, name: "Gamma", ethereum_score: 81.1, polygon_score: 80.8, og_score: 81.5, average_score: 81.1, global_rank: 3, chains_active: 3 },
    { agent_id: 1004, name: "Delta", ethereum_score: 78.4, polygon_score: 77.9, og_score: 79.0, average_score: 78.4, global_rank: 4, chains_active: 3 },
  ],
  recentMessages: [
    { id: 1, source: "Ethereum", dest: "Polygon", agent: 1001, action: "Score sync", confidence: 87, timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: 2, source: "Polygon", dest: "0G Chain", agent: 1002, action: "Verification request", confidence: 84, timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: 3, source: "0G Chain", dest: "Ethereum", agent: 1003, action: "Proof submission", confidence: 92, timestamp: new Date(Date.now() - 180000).toISOString() },
    { id: 4, source: "Ethereum", dest: "0G Chain", agent: 1001, action: "Tournament result", confidence: 89, timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: 5, source: "Polygon", dest: "Ethereum", agent: 1004, action: "Breeding request", confidence: 78, timestamp: new Date(Date.now() - 300000).toISOString() },
  ],
}

/**
 * Run a simulated deliberation pipeline with timed events.
 * Calls the handler for each event at realistic intervals.
 */
export function runDemoDeliberation(
  prompt: string,
  onEvent: (event: DemoEvent) => void
): { cancel: () => void } {
  const timers: ReturnType<typeof setTimeout>[] = []
  let cancelled = false

  const schedule = (fn: () => void, delay: number) => {
    const t = setTimeout(() => { if (!cancelled) fn() }, delay)
    timers.push(t)
  }

  const sessionId = `sess_demo_${Date.now().toString(36)}`

  // Planner started
  schedule(() => onEvent({ type: 'agent_started', agent: 'planner', event: 'started', timestamp: new Date().toISOString() }), 300)
  // Planner complete
  schedule(() => onEvent({ type: 'agent_update', agent: 'planner', event: 'complete', data: DEMO_PLAN }), 2200)

  // Researcher started
  schedule(() => onEvent({ type: 'agent_started', agent: 'researcher', event: 'started', timestamp: new Date().toISOString() }), 2500)
  // Researcher complete
  schedule(() => onEvent({ type: 'agent_update', agent: 'researcher', event: 'complete', data: DEMO_EVIDENCE }), 4500)

  // Critic started
  schedule(() => onEvent({ type: 'agent_started', agent: 'critic', event: 'started', timestamp: new Date().toISOString() }), 4800)
  // Critic complete
  schedule(() => onEvent({ type: 'agent_update', agent: 'critic', event: 'complete', data: DEMO_VERDICT }), 6800)

  // Verifier started
  schedule(() => onEvent({ type: 'agent_started', agent: 'verifier', event: 'started', timestamp: new Date().toISOString() }), 7100)
  // Verifier complete
  schedule(() => onEvent({ type: 'agent_update', agent: 'verifier', event: 'complete', data: DEMO_VERIFICATION }), 8800)

  // Executor started
  schedule(() => onEvent({ type: 'agent_started', agent: 'executor', event: 'started', timestamp: new Date().toISOString() }), 9100)
  // Executor complete
  schedule(() => onEvent({ type: 'agent_update', agent: 'executor', event: 'complete', data: DEMO_EXECUTION }), 10500)

  // Full deliberation complete
  schedule(() => {
    const result = { ...DEMO_FULL_RESULT, prompt, session_id: sessionId }
    onEvent({ type: 'deliberation_complete', session_id: sessionId, result })
  }, 11000)

  return {
    cancel: () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }
}

/**
 * Check if backend is reachable
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || ''
    const response = await fetch(`${apiUrl}/api/health`, { signal: AbortSignal.timeout(3000) })
    return response.ok
  } catch {
    return false
  }
}
