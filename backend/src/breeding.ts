// backend/src/breeding.ts
// Agent Breeding Engine — Crossover algorithm with trait blending and mutation

import { OGStorage } from "./og-storage";

export interface AgentTraits {
  reasoning: number;
  creativity: number;
  caution: number;
  speed: number;
  accuracy: number;
  adaptability: number;
}

export interface AgentProfile {
  tokenId: number;
  sessionId: string;
  traits: AgentTraits;
  generation: number;
  score: number;
  parents: [number, number];
  heritage: number[];
  createdAt: string;
  prompt?: string;
  decision?: string;
}

export interface BreedingRequest {
  parent1Id: number;
  parent2Id: number;
  owner?: string;
}

export interface BreedingResult {
  childTokenId: number;
  generation: number;
  traits: AgentTraits;
  inheritedScore: number;
  compatibility: number;
  parents: [number, number];
  timestamp: string;
}

export class BreedingEngine {
  private ogStorage: OGStorage;

  constructor(ogStorage: OGStorage) {
    this.ogStorage = ogStorage;
  }

  /**
   * Breed two agents — crossover algorithm with mutation
   */
  async breedAgents(request: BreedingRequest): Promise<BreedingResult> {
    console.log(`[BreedingEngine] Breeding #${request.parent1Id} × #${request.parent2Id}`);

    // Get parent data
    const parent1 = await this.ogStorage.getKV(`agent:profile:${request.parent1Id}`);
    const parent2 = await this.ogStorage.getKV(`agent:profile:${request.parent2Id}`);

    if (!parent1 || !parent2) {
      throw new Error("One or both parents not found");
    }

    if (request.parent1Id === request.parent2Id) {
      throw new Error("Cannot breed an agent with itself");
    }

    // Perform crossover
    const childTraits = this.crossoverTraits(parent1.traits, parent2.traits);

    // Calculate generation
    const generation = Math.max(parent1.generation || 0, parent2.generation || 0) + 1;

    // Calculate inherited score
    const inheritedScore = Math.round(((parent1.score || 0) + (parent2.score || 0)) / 2);

    // Calculate compatibility
    const compatibility = this.calculateCompatibility(parent1.traits, parent2.traits);

    // Generate child token ID
    const childTokenId = Date.now() % 1000000;

    // Build heritage
    const heritage = [
      request.parent1Id,
      request.parent2Id,
      ...(parent1.heritage || []).slice(0, 5),
      ...(parent2.heritage || []).slice(0, 5),
    ];

    const childProfile: AgentProfile = {
      tokenId: childTokenId,
      sessionId: `bred_${childTokenId}`,
      traits: childTraits,
      generation,
      score: inheritedScore,
      parents: [request.parent1Id, request.parent2Id],
      heritage: [...new Set(heritage)], // deduplicate
      createdAt: new Date().toISOString(),
      prompt: `Bred from Agent #${request.parent1Id} × Agent #${request.parent2Id}`,
      decision: "BRED",
    };

    // Store child profile in 0G
    await this.ogStorage.setKV(`agent:profile:${childTokenId}`, childProfile);

    // Store breeding event in log
    await this.ogStorage.appendLog("breeding:history", {
      timestamp: new Date().toISOString(),
      parent1Id: request.parent1Id,
      parent2Id: request.parent2Id,
      childTokenId,
      generation,
      traits: childTraits,
      inheritedScore,
      compatibility,
    });

    // Update parent breeding counts
    const p1Count = (await this.ogStorage.getKV(`agent:breedcount:${request.parent1Id}`)) || 0;
    const p2Count = (await this.ogStorage.getKV(`agent:breedcount:${request.parent2Id}`)) || 0;
    await this.ogStorage.setKV(`agent:breedcount:${request.parent1Id}`, p1Count + 1);
    await this.ogStorage.setKV(`agent:breedcount:${request.parent2Id}`, p2Count + 1);

    const result: BreedingResult = {
      childTokenId,
      generation,
      traits: childTraits,
      inheritedScore,
      compatibility,
      parents: [request.parent1Id, request.parent2Id],
      timestamp: new Date().toISOString(),
    };

    console.log(`[BreedingEngine] ✓ Child bred: #${childTokenId} (Gen ${generation})`);
    return result;
  }

  /**
   * Crossover Algorithm — Blend parent traits with ±5 mutation
   */
  private crossoverTraits(parent1Traits: AgentTraits, parent2Traits: AgentTraits): AgentTraits {
    const mutation = () => Math.round((Math.random() - 0.5) * 10); // -5 to +5

    return {
      reasoning: this.blendTrait(parent1Traits.reasoning, parent2Traits.reasoning, mutation()),
      creativity: this.blendTrait(parent1Traits.creativity, parent2Traits.creativity, mutation()),
      caution: this.blendTrait(parent1Traits.caution, parent2Traits.caution, mutation()),
      speed: this.blendTrait(parent1Traits.speed, parent2Traits.speed, mutation()),
      accuracy: this.blendTrait(parent1Traits.accuracy, parent2Traits.accuracy, mutation()),
      adaptability: this.blendTrait(parent1Traits.adaptability, parent2Traits.adaptability, mutation()),
    };
  }

  /**
   * Blend two trait values with mutation, clamped 0-100
   */
  private blendTrait(trait1: number, trait2: number, mutation: number): number {
    const blended = (trait1 + trait2) / 2 + mutation;
    return Math.max(0, Math.min(100, Math.round(blended)));
  }

  /**
   * Calculate breeding compatibility (0-100)
   * Higher difference = more genetic diversity = better
   */
  calculateCompatibility(traits1: AgentTraits, traits2: AgentTraits): number {
    const keys = Object.keys(traits1) as Array<keyof AgentTraits>;
    const differences = keys.map((key) => Math.abs((traits1[key] || 50) - (traits2[key] || 50)));
    const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
    // Sweet spot: some difference is good (diversity), but not too much
    // Peak compatibility at ~20 point average difference
    const compatibility = 100 - Math.abs(avgDifference - 20) * 2;
    return Math.max(10, Math.min(100, Math.round(compatibility)));
  }

  /**
   * Predict offspring traits (preview before breeding)
   */
  predictOffspring(traits1: AgentTraits, traits2: AgentTraits): AgentTraits {
    // Show average without mutation for preview
    const keys = Object.keys(traits1) as Array<keyof AgentTraits>;
    const predicted: any = {};
    for (const key of keys) {
      predicted[key] = Math.round(((traits1[key] || 50) + (traits2[key] || 50)) / 2);
    }
    return predicted as AgentTraits;
  }

  /**
   * Get all bred agents (for gallery)
   */
  async getBreedingHistory(limit: number = 50): Promise<any[]> {
    return await this.ogStorage.getLog("breeding:history", limit);
  }
}
