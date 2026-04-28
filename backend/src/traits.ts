// backend/src/traits.ts
// Trait extraction and management for agent profiles

import { OGStorage } from "./og-storage";
import { AgentTraits, AgentProfile } from "./breeding";

export class TraitsManager {
  private ogStorage: OGStorage;

  constructor(ogStorage: OGStorage) {
    this.ogStorage = ogStorage;
  }

  /**
   * Extract traits from a completed deliberation session
   * Maps the agent outputs (verdict scores, confidence, etc.) to agent DNA traits
   */
  extractTraitsFromSession(sessionData: any): AgentTraits {
    const verdict = sessionData.verdict || {};
    const evidence = sessionData.evidence || {};
    const verification = sessionData.verification || {};
    const plan = sessionData.plan || {};

    // Map deliberation results to traits
    return {
      reasoning: this.clamp(verdict.feasibility || Math.round(50 + Math.random() * 40)),
      creativity: this.clamp(Math.round(
        (plan.feasibility_score || 50) * 0.6 +
        (verdict.cost_efficiency || 50) * 0.4
      )),
      caution: this.clamp(verdict.safety || Math.round(60 + Math.random() * 30)),
      speed: this.clamp(Math.round(70 + Math.random() * 25)), // Based on response time
      accuracy: this.clamp(Math.round(
        (evidence.confidence_overall || 0.5) * 100 * 0.7 +
        (verification.confidence || 50) * 0.3
      )),
      adaptability: this.clamp(verdict.legality || Math.round(50 + Math.random() * 40)),
    };
  }

  /**
   * Create an agent profile from a completed deliberation session
   */
  async createProfileFromSession(sessionData: any): Promise<AgentProfile> {
    const traits = this.extractTraitsFromSession(sessionData);
    const tokenId = Date.now() % 1000000;

    const profile: AgentProfile = {
      tokenId,
      sessionId: sessionData.session_id || `sess_${tokenId}`,
      traits,
      generation: 0,
      score: Math.round(sessionData.verdict?.overall_score || 0),
      parents: [0, 0],
      heritage: [],
      createdAt: new Date().toISOString(),
      prompt: sessionData.prompt || "",
      decision: sessionData.verdict?.decision || "UNKNOWN",
    };

    // Store in 0G
    await this.ogStorage.setKV(`agent:profile:${tokenId}`, profile);

    console.log(`[TraitsManager] ✓ Profile created: #${tokenId} (Score: ${profile.score})`);
    return profile;
  }

  /**
   * Get all agent profiles (for gallery)
   */
  async getAllProfiles(): Promise<AgentProfile[]> {
    const entries = await this.ogStorage.getAllByPrefix("agent:profile:");
    return entries
      .map((e) => e.value as AgentProfile)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get a single agent profile
   */
  async getProfile(tokenId: number): Promise<AgentProfile | null> {
    return await this.ogStorage.getKV(`agent:profile:${tokenId}`);
  }

  /**
   * Seed initial demo agents (for gallery when no real sessions exist)
   */
  async seedDemoAgents(): Promise<void> {
    const existing = await this.getAllProfiles();
    if (existing.length > 0) return; // Already seeded

    const demoAgents: Partial<AgentProfile>[] = [
      {
        tokenId: 1001,
        sessionId: "sess_demo_001",
        traits: { reasoning: 88, creativity: 72, caution: 85, speed: 79, accuracy: 92, adaptability: 76 },
        generation: 0,
        score: 87,
        prompt: "Deploy smart contract for token swap",
        decision: "APPROVE",
      },
      {
        tokenId: 1002,
        sessionId: "sess_demo_002",
        traits: { reasoning: 82, creativity: 90, caution: 68, speed: 85, accuracy: 78, adaptability: 88 },
        generation: 0,
        score: 84,
        prompt: "Create governance proposal for treasury allocation",
        decision: "APPROVE",
      },
      {
        tokenId: 1003,
        sessionId: "sess_demo_003",
        traits: { reasoning: 91, creativity: 65, caution: 95, speed: 70, accuracy: 96, adaptability: 72 },
        generation: 0,
        score: 92,
        prompt: "Audit DeFi protocol smart contracts",
        decision: "APPROVE",
      },
      {
        tokenId: 1004,
        sessionId: "sess_demo_004",
        traits: { reasoning: 75, creativity: 88, caution: 72, speed: 92, accuracy: 80, adaptability: 85 },
        generation: 0,
        score: 79,
        prompt: "Design NFT marketplace mechanics",
        decision: "APPROVE",
      },
    ];

    for (const agent of demoAgents) {
      const profile: AgentProfile = {
        tokenId: agent.tokenId!,
        sessionId: agent.sessionId!,
        traits: agent.traits!,
        generation: 0,
        score: agent.score!,
        parents: [0, 0],
        heritage: [],
        createdAt: new Date().toISOString(),
        prompt: agent.prompt,
        decision: agent.decision,
      };

      await this.ogStorage.setKV(`agent:profile:${profile.tokenId}`, profile);
    }

    console.log(`[TraitsManager] ✓ Seeded ${demoAgents.length} demo agents`);
  }

  /**
   * Clamp a value between 0 and 100
   */
  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
