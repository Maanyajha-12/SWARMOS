// backend/src/index.ts — Express Server with WebSocket + Breeding Endpoints

import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import { SwarmOrchestrator } from "./agents";
import { OGStorage } from "./og-storage";
import { BreedingEngine } from "./breeding";
import { TraitsManager } from "./traits";

dotenv.config();

// ============================================================================
// Setup
// ============================================================================

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

app.use(cors());
app.use(express.json());

// Initialize services
const ogStorage = new OGStorage(
    process.env.OG_KV_ENDPOINT || "http://localhost:8080",
    process.env.OG_LOG_ENDPOINT || "http://localhost:8081"
);

const orchestrator = new SwarmOrchestrator(ogStorage);
const breedingEngine = new BreedingEngine(ogStorage);
const traitsManager = new TraitsManager(ogStorage);

// Track active sessions and clients
const activeSessions: Map<string, any> = new Map();
const connectedClients: Set<WebSocket> = new Set();

// ============================================================================
// Initialize Storage + Seed Data
// ============================================================================

async function initializeServices() {
    await ogStorage.initialize();
    await traitsManager.seedDemoAgents();
    console.log("[Init] ✓ Services initialized");
}

initializeServices().catch(console.error);

// ============================================================================
// WebSocket Events
// ============================================================================

wss.on("connection", (ws: WebSocket) => {
    const clientId = Date.now().toString();
    connectedClients.add(ws);
    console.log(`[WebSocket] Client ${clientId} connected. Total: ${connectedClients.size}`);

    ws.send(
        JSON.stringify({
            type: "connection",
            status: "connected",
            client_id: clientId,
        })
    );

    ws.on("message", async (message: string) => {
        try {
            const data = JSON.parse(message.toString());
            console.log(`[WebSocket] Message from ${clientId}:`, data.action);

            if (data.action === "deliberate") {
                await handleDeliberate(data, ws);
            }
        } catch (error) {
            console.error("[WebSocket] Error:", error);
            ws.send(JSON.stringify({ type: "error", error: "Invalid message" }));
        }
    });

    ws.on("close", () => {
        connectedClients.delete(ws);
        console.log(`[WebSocket] Client ${clientId} disconnected. Total: ${connectedClients.size}`);
    });

    ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
        connectedClients.delete(ws);
    });
});

// Broadcast to all connected clients
function broadcastToAll(message: any): void {
    const payload = JSON.stringify(message);
    connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

// Handle deliberate request via WebSocket
async function handleDeliberate(data: any, ws: WebSocket): Promise<string> {
    const prompt = data.prompt || "";
    const mode = data.mode || "simulation";

    console.log(`[Deliberate] Starting from WebSocket: ${prompt.substring(0, 50)}...`);

    // Run in background
    runDeliberation(prompt, mode);

    return "";
}

// Shared deliberation runner (used by both WebSocket and REST)
function runDeliberation(prompt: string, mode: string): void {
    // Setup event listeners (use once to avoid leaks)
    const plannerHandler = (planData: any) => {
        broadcastToAll({
            type: "agent_update",
            agent: "planner",
            event: "complete",
            data: planData,
        });
    };

    const researcherHandler = (evidenceData: any) => {
        broadcastToAll({
            type: "agent_update",
            agent: "researcher",
            event: "complete",
            data: evidenceData,
        });
    };

    const criticHandler = (verdictData: any) => {
        broadcastToAll({
            type: "agent_update",
            agent: "critic",
            event: "complete",
            data: verdictData,
        });
    };

    const verifierHandler = (verificationData: any) => {
        broadcastToAll({
            type: "agent_update",
            agent: "verifier",
            event: "complete",
            data: verificationData,
        });
    };

    const executorHandler = (executionData: any) => {
        broadcastToAll({
            type: "agent_update",
            agent: "executor",
            event: "complete",
            data: executionData,
        });
    };

    orchestrator.on("planner_complete", plannerHandler);
    orchestrator.on("researcher_complete", researcherHandler);
    orchestrator.on("critic_complete", criticHandler);
    orchestrator.on("compute_verified", verifierHandler);
    orchestrator.on("executor_complete", executorHandler);

    (async () => {
        try {
            const result = await orchestrator.deliberate(prompt, mode as any);
            // cleanup listeners (IMPORTANT)
            orchestrator.off("planner_complete", plannerHandler);
            orchestrator.off("researcher_complete", researcherHandler);
            orchestrator.off("critic_complete", criticHandler);
            orchestrator.off("compute_verified", verifierHandler);
            orchestrator.off("executor_complete", executorHandler);

            // Store result in active sessions
            activeSessions.set(result.session_id, result);

            // Store session in 0G for history
            await ogStorage.setKV(`session:${result.session_id}`, result);

            // Create agent profile from this session (for breeding gallery)
            if (result.verdict) {
                try {
                    await traitsManager.createProfileFromSession(result);
                } catch (e) {
                    console.error("[Traits] Error creating profile:", e);
                }
            }

            // Notify all clients
            broadcastToAll({
                type: "deliberation_complete",
                session_id: result.session_id,
                result,
            });
        } catch (error) {
            console.error("[Deliberate] Error:", error);
            broadcastToAll({
                type: "deliberation_error",
                error: String(error),
            });
        }
    })();
}

// ============================================================================
// REST API Endpoints
// ============================================================================

// POST /api/deliberate - Create deliberation session
app.post("/api/deliberate", async (req: Request, res: Response) => {
    try {
        const { prompt, mode = "simulation" } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt required" });
        }

        console.log(`[API] Deliberate request: ${prompt.substring(0, 50)}...`);

        // Start deliberation in background
        runDeliberation(prompt, mode);

        res.status(202).json({
            session_id: `sess_${Date.now().toString(36)}`,
            status: "started",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/sessions - List all sessions (for history)
app.get("/api/sessions", async (_req: Request, res: Response) => {
    try {
        // Combine in-memory active sessions with stored sessions
        const sessions: any[] = [];

        // From active sessions map
        for (const [id, session] of activeSessions.entries()) {
            sessions.push({
                session_id: id,
                prompt: session.prompt || "",
                status: session.status || "complete",
                created_at: session.created_at || new Date().toISOString(),
                completed_at: session.completed_at,
                score: session.verdict?.overall_score,
                decision: session.verdict?.decision,
            });
        }

        // From 0G storage
        const storedSessions = await ogStorage.getAllByPrefix("session:sess_");
        for (const { value } of storedSessions) {
            if (!sessions.find((s) => s.session_id === value.session_id)) {
                sessions.push({
                    session_id: value.session_id,
                    prompt: value.prompt || "",
                    status: value.status || "complete",
                    created_at: value.created_at || new Date().toISOString(),
                    completed_at: value.completed_at,
                    score: value.verdict?.overall_score,
                    decision: value.verdict?.decision,
                });
            }
        }

        res.json({ sessions: sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/session/:sessionId - Get session status
app.get("/api/session/:sessionId", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        let session = activeSessions.get(sessionId);
        if (!session) {
            session = await ogStorage.getKV(`session:${sessionId}`);
        }

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(session);
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/agents - Get all agents
app.get("/api/agents", (_req: Request, res: Response) => {
    try {
        const stats = orchestrator.getAgentStats();

        const agents = [
            {
                ...stats.planner,
                status: "running",
            },
            {
                ...stats.researcher,
                status: "running",
            },
            {
                ...stats.critic,
                status: "running",
            },
            {
                ...stats.executor,
                status: "running",
            },
        ];

        res.json({ agents });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/agent/:name/stats - Get agent stats
app.get("/api/agent/:name/stats", (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const stats = orchestrator.getAgentStats();

        const agentStats = stats[name.toLowerCase() as keyof typeof stats];
        if (!agentStats) {
            return res.status(404).json({ error: "Agent not found" });
        }

        res.json(agentStats);
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// ============================================================================
// 0G Storage Endpoints
// ============================================================================

// GET /api/0g/kv/:key - Read from 0G KV
app.get("/api/0g/kv/:key", async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const value = await ogStorage.getKV(key);

        if (!value) {
            return res.status(404).json({ error: "Key not found" });
        }

        res.json({
            key,
            value,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// POST /api/0g/kv/:key - Write to 0G KV
app.post("/api/0g/kv/:key", async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        await ogStorage.setKV(key, value);

        res.json({
            key,
            status: "set",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/0g/log/:logName - Read from 0G Log
app.get("/api/0g/log/:logName", async (req: Request, res: Response) => {
    try {
        const { logName } = req.params;
        const entries = await ogStorage.getLog(logName);

        res.json({
            log: logName,
            entries,
            count: entries.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// POST /api/0g/log/:logName - Append to 0G Log
app.post("/api/0g/log/:logName", async (req: Request, res: Response) => {
    try {
        const { logName } = req.params;
        const { entry } = req.body;

        await ogStorage.appendLog(logName, entry);

        res.json({
            log: logName,
            status: "appended",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// ============================================================================
// Breeding Endpoints
// ============================================================================

// GET /api/gallery/agents - List all agents with traits (for gallery)
app.get("/api/gallery/agents", async (_req: Request, res: Response) => {
    try {
        const profiles = await traitsManager.getAllProfiles();
        res.json({ agents: profiles });
    } catch (error) {
        console.error("[API] Gallery error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// POST /api/breeding/breed - Create offspring
app.post("/api/breeding/breed", async (req: Request, res: Response) => {
    try {
        const { parent1Id, parent2Id, owner } = req.body;

        if (!parent1Id || !parent2Id) {
            return res.status(400).json({ error: "Both parent IDs required" });
        }

        const result = await breedingEngine.breedAgents({
            parent1Id: Number(parent1Id),
            parent2Id: Number(parent2Id),
            owner,
        });

        // Broadcast breeding event
        broadcastToAll({
            type: "agent_bred",
            data: result,
        });

        res.json(result);
    } catch (error) {
        console.error("[API] Breeding error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/breeding/predict/:parent1/:parent2 - Preview offspring
app.get("/api/breeding/predict/:parent1/:parent2", async (req: Request, res: Response) => {
    try {
        const parent1Id = Number(req.params.parent1);
        const parent2Id = Number(req.params.parent2);

        const parent1 = await ogStorage.getKV(`agent:profile:${parent1Id}`);
        const parent2 = await ogStorage.getKV(`agent:profile:${parent2Id}`);

        if (!parent1 || !parent2) {
            return res.status(404).json({ error: "One or both parents not found" });
        }

        const predicted = breedingEngine.predictOffspring(parent1.traits, parent2.traits);
        const compatibility = breedingEngine.calculateCompatibility(parent1.traits, parent2.traits);

        res.json({
            parent1: { tokenId: parent1Id, traits: parent1.traits, score: parent1.score },
            parent2: { tokenId: parent2Id, traits: parent2.traits, score: parent2.score },
            predicted,
            compatibility,
            predictedScore: Math.round((parent1.score + parent2.score) / 2),
            predictedGeneration: Math.max(parent1.generation || 0, parent2.generation || 0) + 1,
        });
    } catch (error) {
        console.error("[API] Prediction error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/breeding/history - Get breeding history
app.get("/api/breeding/history", async (_req: Request, res: Response) => {
    try {
        const history = await breedingEngine.getBreedingHistory(100);
        res.json({ history });
    } catch (error) {
        console.error("[API] History error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// GET /api/breeding/traits/:tokenId - Get agent traits
app.get("/api/breeding/traits/:tokenId", async (req: Request, res: Response) => {
    try {
        const tokenId = Number(req.params.tokenId);
        const profile = await ogStorage.getKV(`agent:profile:${tokenId}`);

        if (!profile) {
            return res.status(404).json({ error: "Agent not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("[API] Traits error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// ============================================================================
// System Endpoints
// ============================================================================

// GET /api/health - Health check
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        status: "healthy",
        agents: {
            planner: "running",
            researcher: "running",
            critic: "running",
            executor: "running",
        },
        storage: ogStorage.getStats(),
        connections: connectedClients.size,
        active_sessions: activeSessions.size,
        timestamp: new Date().toISOString(),
    });
});

// GET /api/stats - System statistics
app.get("/api/stats", (_req: Request, res: Response) => {
    try {
        const agentStats = orchestrator.getAgentStats();

        const totalExecutions = Object.values(agentStats).reduce(
            (sum, s) => sum + (s as any).executions,
            0
        );
        const totalSuccesses = Object.values(agentStats).reduce(
            (sum, s) => sum + (s as any).successes,
            0
        );

        res.json({
            total_executions: totalExecutions,
            total_successes: totalSuccesses,
            overall_success_rate: totalExecutions > 0 ? totalSuccesses / totalExecutions : 0,
            agents: agentStats,
            active_sessions: activeSessions.size,
            connected_clients: connectedClients.size,
            storage: ogStorage.getStats(),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[API] Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// Error handlers
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error("[Error]", err);
    res.status(500).json({ error: "Internal server error" });
});

// ============================================================================
// Start Server
// ============================================================================

const PORT = parseInt(process.env.PORT || "5000", 10);

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 SWARM OS Backend Server Started");
    console.log("=".repeat(60));
    console.log(`HTTP Server: http://0.0.0.0:${PORT}`);
    console.log(`WebSocket: ws://0.0.0.0:${PORT}`);
    console.log(`API: http://0.0.0.0:${PORT}/api`);
    console.log("=".repeat(60));
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Anthropic API: ${process.env.ANTHROPIC_API_KEY ? "✓ configured" : "✗ NOT SET"}`);
    console.log(`0G KV: ${process.env.OG_KV_ENDPOINT || "in-memory"}`);
    console.log(`0G Log: ${process.env.OG_LOG_ENDPOINT || "in-memory"}`);
    console.log("=".repeat(60) + "\n");
});

export { app, httpServer, wss };
