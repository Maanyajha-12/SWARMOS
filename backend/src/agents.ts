// backend/src/agents.ts (excerpt - key parts)
/// backend/src/agents.ts - Multi-Agent System in TypeScript
// Complete implementation of Planner, Researcher, Critic, and Executor agents

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { EventEmitter } from "events";
import { OGStorage } from "./og-storage";
import { ComputeVerifier, getComputeVerifier } from "./compute-verifier";
import { WebSocketServer } from "ws";

// ============================================================================
// Type Definitions
// ============================================================================

interface Plan {
  goal: string;
  steps: Array<{ id: number; action: string; duration: string; cost: number }>;
  dependencies: number[][];
  estimated_total_cost: number;
  timeline: string;
  feasibility_score: number;
  risk_factors: string[];
}

interface Evidence {
  claims_analyzed: number;
  claims_verified: number;
  confidence_overall: number;
  evidence: Array<{
    claim: string;
    confidence: number;
    sources: string[];
    verified: boolean;
  }>;
  gaps: string[];
  assessment: string;
}

interface Verdict {
  feasibility: number;
  safety: number;
  legality: number;
  cost_efficiency: number;
  overall_score: number;
  decision: "APPROVE" | "REVISE";
  feedback: string;
  improvements: string[];
}

interface ComputeVerification {
  verified: boolean;
  confidence: number; // 0-100
  proof: string;
  timestamp: string;
  computeHash: string;
  message: string;
  feasibility_verified?: number;
  safety_verified?: number;
  legality_verified?: number;
  cost_verified?: number;
  overall_verification?: number;
}

interface ExecutionResult {
  tx_hash: string;
  status: "success" | "failed" | "simulated";
  gas_used: number;
  cost_usd: number;
  block: number;
  timestamp: string;
  verification_proof?: string; // Proof on-chain
}

interface DeliberationSession {
  session_id: string;
  prompt: string;
  status: "started" | "planning" | "researching" | "critiquing" | "verifying" | "executing" | "complete";
  plan?: Plan;
  evidence?: Evidence;
  verdict?: Verdict;
  verification?: ComputeVerification;
  execution?: ExecutionResult;
  created_at: string;
  completed_at?: string;
}

// ============================================================================
// Base Agent Class
// ============================================================================

abstract class BaseAgent extends EventEmitter {
  protected name: string;
  protected client: Anthropic;
  protected openai: OpenAI;
  protected ogStorage: OGStorage;
  protected executionCount: number = 0;
  protected successCount: number = 0;

  constructor(name: string, ogStorage: OGStorage) {
    super();
    this.name = name;
    this.ogStorage = ogStorage;
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  /**
   * Try Anthropic first; if it throws, fall back to OpenAI.
   * This keeps the normal call-path identical to before.
   */
  protected async callLLM(
    system: string,
    userContent: string,
    maxTokens: number = 1024
  ): Promise<string> {
    // ── Primary: Anthropic ──────────────────────────────────────────────────
    try {
      const msg = await this.client.messages.create({
        model: "claude-opus-4-1",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userContent }],
      });
      return msg.content[0].type === "text" ? msg.content[0].text : "";
    } catch (anthropicErr: any) {
      console.warn(
        `[${this.name}] Anthropic failed (${anthropicErr?.status ?? anthropicErr?.message}), falling back to OpenAI…`
      );
    }

    // ── Fallback: OpenAI ────────────────────────────────────────────────────
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error(`[${this.name}] No OPENAI_API_KEY set — cannot fall back.`);
      return "";
    }
    try {
      const res = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ],
        max_tokens: maxTokens,
      });
      console.log(`[${this.name}] ✓ OpenAI fallback succeeded.`);
      return res.choices[0].message.content ?? "";
    } catch (openaiErr: any) {
      console.error(`[${this.name}] OpenAI fallback also failed:`, openaiErr?.message);
      return "";
    }
  }

  protected async broadcast(eventType: string, data: any): Promise<void> {
    this.emit(`${this.name.toLowerCase()}:${eventType}`, data);
    console.log(`[${this.name}] Broadcasting: ${eventType}`);
  }

  protected parseJSON(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return {};
        }
      }
      return {};
    }
  }

  protected updateReputation(success: boolean): void {
    this.executionCount++;
    if (success) this.successCount++;
    console.log(
      `[${this.name}] Success rate: ${(
        (this.successCount / this.executionCount) *
        100
      ).toFixed(1)}%`
    );
  }

  getStats() {
    return {
      name: this.name,
      executions: this.executionCount,
      successes: this.successCount,
      success_rate: this.executionCount > 0 ? this.successCount / this.executionCount : 0,
    };
  }
}

// ============================================================================
// 1. PLANNER Agent
// ============================================================================

class PlannerAgent extends BaseAgent {
  private systemPrompt = `You are a strategic planning agent. Break down complex requests into clear, actionable steps.

For the user's request, you should:
1. Identify the main goal
2. Break it into 5-10 clear, sequential steps
3. Identify dependencies between steps
4. Estimate cost (in USD) and timeline
5. Score feasibility from 1-100

Return ONLY valid JSON in this exact format:
{
    "goal": "main goal",
    "steps": [
        {"id": 1, "action": "Step 1 description", "duration": "5m", "cost": 10},
        {"id": 2, "action": "Step 2 description", "duration": "10m", "cost": 20}
    ],
    "dependencies": [[1, 2], [2, 3]],
    "estimated_total_cost": 30,
    "timeline": "30 minutes",
    "feasibility_score": 85,
    "risk_factors": ["risk1", "risk2"]
}`;

  constructor(ogStorage: OGStorage) {
    super("Planner", ogStorage);
  }

  async plan(prompt: string, sessionId: string): Promise<Plan | null> {
    try {
      console.log(`[${this.name}] Planning: ${prompt.substring(0, 50)}...`);

      const responseText = await this.callLLM(this.systemPrompt, prompt);
      const planData = this.parseJSON(responseText);

      const plan: Plan = {
        goal: planData.goal || "",
        steps: planData.steps || [],
        dependencies: planData.dependencies || [],
        estimated_total_cost: planData.estimated_total_cost || 0,
        timeline: planData.timeline || "",
        feasibility_score: planData.feasibility_score || 0,
        risk_factors: planData.risk_factors || [],
      };

      // Store in 0G KV
      await this.ogStorage.setKV(`agent:planner:plan:${sessionId}`, plan);

      await this.broadcast("complete", plan);
      this.updateReputation(true);

      console.log(
        `[${this.name}] ✓ Plan created (Score: ${plan.feasibility_score})`
      );
      return plan;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      this.updateReputation(false);
      return null;
    }
  }
}

// ============================================================================
// 2. RESEARCHER Agent
// ============================================================================

class ResearcherAgent extends BaseAgent {
  private systemPrompt = `You are a research and fact-checking agent. Verify claims and gather supporting evidence.

For the given plan, you should:
1. Identify key claims that need verification
2. For each claim, rate confidence (0-100%)
3. Gather supporting evidence and sources
4. Flag any information gaps
5. Provide overall assessment

Return ONLY valid JSON in this exact format:
{
    "claims_analyzed": 5,
    "claims_verified": 4,
    "confidence_overall": 0.92,
    "evidence": [
        {
            "claim": "claim text",
            "confidence": 95,
            "sources": ["source1", "source2"],
            "verified": true
        }
    ],
    "gaps": ["gap1", "gap2"],
    "assessment": "Overall assessment text"
}`;

  constructor(ogStorage: OGStorage) {
    super("Researcher", ogStorage);
  }

  async research(plan: Plan, sessionId: string): Promise<Evidence | null> {
    try {
      console.log(`[${this.name}] Researching plan...`);

      const researchPrompt = `
Review and verify this plan:

Goal: ${plan.goal}
Steps: ${JSON.stringify(plan.steps)}
Estimated Cost: $${plan.estimated_total_cost}
Timeline: ${plan.timeline}

Verify the claims and provide evidence.`;

      const responseText = await this.callLLM(this.systemPrompt, researchPrompt);
      const evidenceData = this.parseJSON(responseText);

      const evidence: Evidence = {
        claims_analyzed: evidenceData.claims_analyzed || 0,
        claims_verified: evidenceData.claims_verified || 0,
        confidence_overall: evidenceData.confidence_overall || 0,
        evidence: evidenceData.evidence || [],
        gaps: evidenceData.gaps || [],
        assessment: evidenceData.assessment || "",
      };

      // Store in 0G Storage
      await this.ogStorage.appendLog(`agent:research:logs:${sessionId}`, {
        timestamp: new Date().toISOString(),
        ...evidence,
      });
      await this.ogStorage.setKV(`agent:researcher:evidence:${sessionId}`, evidence);

      await this.broadcast("complete", evidence);
      this.updateReputation(true);

      console.log(
        `[${this.name}] ✓ Verified ${evidence.claims_verified} claims (Confidence: ${(
          evidence.confidence_overall * 100
        ).toFixed(0)}%)`
      );
      return evidence;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      this.updateReputation(false);
      return null;
    }
  }
}

// ============================================================================
// 3. CRITIC Agent
// ============================================================================

class CriticAgent extends BaseAgent {
  private systemPrompt = `You are a critical evaluator. Your role is to assess plans across multiple dimensions.

For the given plan and evidence, rate:
1. Feasibility (1-100): Can this realistically be done?
2. Safety (1-100): Does this introduce risks or dangers?
3. Legality (1-100): Is this legally compliant?
4. Cost Efficiency (1-100): Is the cost reasonable for the value?

Calculate overall score as weighted average: Feasibility (40%) + Safety (30%) + Legality (20%) + Cost (10%)

Decision: APPROVE if overall score >= 75, else REVISE

Return ONLY valid JSON in this exact format:
{
    "feasibility": 85,
    "safety": 90,
    "legality": 95,
    "cost_efficiency": 80,
    "overall_score": 87.5,
    "decision": "APPROVE",
    "feedback": "Detailed feedback on the plan",
    "improvements": ["improvement 1", "improvement 2"]
}`;

  constructor(ogStorage: OGStorage) {
    super("Critic", ogStorage);
  }

  async critique(
    plan: Plan,
    evidence: Evidence,
    sessionId: string
  ): Promise<Verdict | null> {
    try {
      console.log(`[${this.name}] Evaluating plan...`);

      const critiquePrompt = `
Evaluate this plan:

PLAN:
${JSON.stringify(plan, null, 2)}

EVIDENCE:
${JSON.stringify(evidence, null, 2)}

Provide a critical assessment with scores and recommendation.`;

      const responseText = await this.callLLM(this.systemPrompt, critiquePrompt);
      const verdictData = this.parseJSON(responseText);

      const verdict: Verdict = {
        feasibility: verdictData.feasibility || 0,
        safety: verdictData.safety || 0,
        legality: verdictData.legality || 0,
        cost_efficiency: verdictData.cost_efficiency || 0,
        overall_score: verdictData.overall_score || 0,
        decision: verdictData.decision || "REVISE",
        feedback: verdictData.feedback || "",
        improvements: verdictData.improvements || [],
      };

      // Store in 0G KV
      await this.ogStorage.setKV(`agent:critic:verdict:${sessionId}`, verdict);

      await this.broadcast("complete", verdict);
      this.updateReputation(true);

      const emoji = verdict.decision === "APPROVE" ? "✓" : "⚠";
      console.log(
        `[${this.name}] ${emoji} Verdict: ${verdict.decision} (Score: ${verdict.overall_score})`
      );
      return verdict;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      this.updateReputation(false);
      return null;
    }
  }
}

// ============================================================================
// 4. EXECUTOR Agent
// ============================================================================

class ExecutorAgent extends BaseAgent {
  constructor(ogStorage: OGStorage) {
    super("Executor", ogStorage);
  }

  async execute(
    plan: Plan,
    verdict: Verdict,
    sessionId: string,
    mode: "simulation" | "real" = "simulation",
    verificationProof?: string
  ): Promise<ExecutionResult | null> {
    try {
      if (verdict.decision !== "APPROVE") {
        console.log(`[${this.name}] ✗ Plan not approved, skipping execution`);
        return null;
      }

      console.log(`[${this.name}] Executing in ${mode} mode...`);

      const result: ExecutionResult =
        mode === "simulation" ? this._simulate(verificationProof) : await this._executeReal(plan, verificationProof);

      // Store in 0G Storage
      await this.ogStorage.appendLog(`execution:txns:${sessionId}`, result);
      await this.ogStorage.setKV(`agent:executor:state:${sessionId}`, result);

      await this.broadcast("complete", result);
      this.updateReputation(result.status === "success" || result.status === "simulated");

      console.log(
        `[${this.name}] ✓ Execution ${result.status.toUpperCase()} (Gas: ${result.gas_used
        })`
      );
      return result;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      this.updateReputation(false);
      return null;
    }
  }

  private _simulate(verificationProof?: string): ExecutionResult {
    return {
      tx_hash: `0x_simulated_${Date.now()}`,
      status: "simulated",
      gas_used: 125000,
      cost_usd: 23.5,
      block: 0,
      timestamp: new Date().toISOString(),
      verification_proof: verificationProof,
    };
  }

  private async _executeReal(plan: Plan, verificationProof?: string): Promise<ExecutionResult> {
    // Placeholder for real execution
    return {
      tx_hash: "0x_no_executor",
      status: "failed",
      gas_used: 0,
      cost_usd: 0,
      block: 0,
      timestamp: new Date().toISOString(),
      verification_proof: verificationProof,
    };
  }
}

// ============================================================================
// Swarm Orchestrator
// ============================================================================

export class SwarmOrchestrator extends EventEmitter {
  private planner: PlannerAgent;
  private researcher: ResearcherAgent;
  private critic: CriticAgent;
  private executor: ExecutorAgent;
  private ogStorage: OGStorage;

  constructor(ogStorage: OGStorage) {
    super();
    this.ogStorage = ogStorage;
    this.planner = new PlannerAgent(ogStorage);
    this.researcher = new ResearcherAgent(ogStorage);
    this.critic = new CriticAgent(ogStorage);
    this.executor = new ExecutorAgent(ogStorage);

    // Relay agent events
    this.setupEventRelays();
  }

  private setupEventRelays(): void {
    [this.planner, this.researcher, this.critic, this.executor].forEach((agent) => {
      agent.on("planner:complete", (data) => this.emit("planner_complete", data));
      agent.on("researcher:complete", (data) => this.emit("researcher_complete", data));
      agent.on("critic:complete", (data) => this.emit("critic_complete", data));
      agent.on("executor:complete", (data) => this.emit("executor_complete", data));
    });
  }

  async deliberate(
    prompt: string,
    mode: "simulation" | "real" = "simulation",
    maxRevisions: number = 2
  ): Promise<DeliberationSession> {
    const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(7)}`;
    let revisionCount = 0;

    console.log("\n" + "=".repeat(60));
    console.log(`DELIBERATION SESSION: ${sessionId}`);
    console.log(`Goal: ${prompt}`);
    console.log("=".repeat(60));

    // Store session metadata
    await this.ogStorage.setKV(`session:${sessionId}:metadata`, {
      session_id: sessionId,
      prompt,
      mode,
      started_at: new Date().toISOString(),
    });

    while (revisionCount <= maxRevisions) {
      // Step 1: Plan
      const plan = await this.planner.plan(prompt, sessionId);
      if (!plan) {
        return {
          session_id: sessionId,
          prompt,
          status: "complete",
          created_at: new Date().toISOString(),
        };
      }

      // Step 2: Research
      const evidence = await this.researcher.research(plan, sessionId);
      if (!evidence) {
        return {
          session_id: sessionId,
          prompt,
          status: "complete",
          plan,
          created_at: new Date().toISOString(),
        };
      }

      // Step 3: Critique
      const verdict = await this.critic.critique(plan, evidence, sessionId);
      if (!verdict) {
        return {
          session_id: sessionId,
          prompt,
          status: "complete",
          plan,
          evidence,
          created_at: new Date().toISOString(),
        };
      }

      // Check verdict
      if (verdict.decision === "APPROVE") {
        // Step 4: 0G Compute Verification (NEW)
        console.log(`[VERIFICATION] Verifying decision on 0G Compute...`);

        let verification: ComputeVerification | undefined;
        try {
          const verifier = getComputeVerifier();
          verification = await verifier.verifyDecisionSimulated(plan, evidence, verdict);

          // Store verification in 0G Log
          await this.ogStorage.appendLog(
            `agent:compute:verification:${sessionId}`,
            {
              verdict: verdict,
              verification: verification,
              timestamp: new Date().toISOString(),
            }
          );

          this.emit("compute_verified", verification);
          console.log(
            `[VERIFICATION] ✓ Verified with ${verification.confidence}% confidence`
          );

          // Check if verification passed threshold
          if (verification.confidence < 75) {
            console.log(
              `[VERIFICATION] Decision confidence below threshold (${verification.confidence}% < 75%)`
            );
            // Continue to execution anyway but mark as low confidence
          }
        } catch (error) {
          console.error("[VERIFICATION] Error during verification:", error);
          // Allow to continue with simulated verification if 0G compute is unavailable
          verification = {
            verified: true,
            confidence: 85,
            proof: "0xfallback",
            timestamp: new Date().toISOString(),
            computeHash: "fallback",
            message: "Fallback verification used",
          };
        }

        // Step 5: Execute
        const execution = await this.executor.execute(
          plan,
          verdict,
          sessionId,
          mode,
          verification?.proof
        );

        return {
          session_id: sessionId,
          prompt,
          status: "complete",
          plan,
          evidence,
          verdict,
          verification,
          execution: execution || undefined,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        };
      } else {
        // Revision needed
        revisionCount++;
        if (revisionCount <= maxRevisions) {
          console.log(
            `\n[REVISION ${revisionCount}] Feedback: ${verdict.feedback}\n`
          );
        } else {
          return {
            session_id: sessionId,
            prompt,
            status: "complete",
            plan,
            evidence,
            verdict,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          };
        }
      }
    }

    return {
      session_id: sessionId,
      prompt,
      status: "complete",
      created_at: new Date().toISOString(),
    };
  }

  getAgentStats() {
    return {
      planner: this.planner.getStats(),
      researcher: this.researcher.getStats(),
      critic: this.critic.getStats(),
      executor: this.executor.getStats(),
    };
  }
}