// backend/src/compute-verifier.ts
// 0G Compute Verification Integration - Verifies decisions on-chain

import axios from "axios";
import crypto from "crypto";

export interface ComputeVerificationInput {
  plan: {
    steps: Array<{ id: number; action: string; cost: number }>;
    estimated_total_cost: number;
    feasibility_score: number;
  };
  evidence: {
    claims_analyzed: number;
    claims_verified: number;
    confidence_overall: number;
  };
  verdict: {
    feasibility: number;
    safety: number;
    legality: number;
    cost_efficiency: number;
    overall_score: number;
    decision: "APPROVE" | "REVISE";
  };
}

export interface ComputeVerificationResult {
  verified: boolean;
  confidence: number; // 0-100
  proof: string; // Cryptographic proof hash
  timestamp: string;
  computeHash: string;
  message: string;
  decision_confidence?: number; // 0-100
  feasibility_verified?: number; // 0-100
  safety_verified?: number; // 0-100
  legality_verified?: number; // 0-100
  cost_verified?: number; // 0-100
  overall_verification?: number; // 0-100
}

export class ComputeVerifier {
  private endpoint: string;
  private apiKey: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  /**
   * Verify decision using 0G Compute
   * Sends plan, evidence, and verdict for verification
   * Returns cryptographic proof of computation
   */
  async verifyDecision(
    plan: any,
    evidence: any,
    verdict: any
  ): Promise<ComputeVerificationResult> {
    console.log("[ComputeVerifier] Starting verification...");

    try {
      const verificationPayload = {
        task: "decision_verification",
        input: { plan, evidence, verdict },
        model: "claude-opus-4-1",
        verification_task: this.buildVerificationPrompt(plan, evidence, verdict),
        return_proof: true,
      };

      // Attempt verification with retries
      let result: any;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          result = await this.sendVerificationRequest(verificationPayload);
          break;
        } catch (error) {
          lastError = error as Error;
          console.log(
            `[ComputeVerifier] Attempt ${attempt}/${this.maxRetries} failed:`,
            lastError.message
          );

          if (attempt < this.maxRetries) {
            await this.delay(this.retryDelay * attempt);
          }
        }
      }

      if (!result) {
        throw lastError || new Error("0G Compute verification failed after retries");
      }

      // Parse verification results
      const verificationScores = this.parseVerificationResponse(result);

      // Generate proof hash
      const proofData = JSON.stringify({
        input: { plan, evidence, verdict },
        result: verificationScores,
        timestamp: new Date().toISOString(),
      });

      const proof = crypto.createHash("sha256").update(proofData).digest("hex");

      const verification: ComputeVerificationResult = {
        verified: verificationScores.overall_verification >= 75,
        confidence: verificationScores.overall_verification,
        proof: `0x${proof}`,
        timestamp: new Date().toISOString(),
        computeHash: result.proof_hash || `hash_${Date.now()}`,
        message: `Decision verified with ${verificationScores.overall_verification}% confidence`,
        decision_confidence: verificationScores.decision_confidence,
        feasibility_verified: verificationScores.feasibility_verified,
        safety_verified: verificationScores.safety_verified,
        legality_verified: verificationScores.legality_verified,
        cost_verified: verificationScores.cost_verified,
        overall_verification: verificationScores.overall_verification,
      };

      console.log(
        `[ComputeVerifier] ✓ Verification complete (Confidence: ${verification.confidence}%)`
      );
      return verification;
    } catch (error) {
      console.error("[ComputeVerifier] Error:", error);
      throw error;
    }
  }

  /**
   * Simulate verification (for testing without 0G connection)
   */
  async verifyDecisionSimulated(
    plan: any,
    evidence: any,
    verdict: any
  ): Promise<ComputeVerificationResult> {
    console.log("[ComputeVerifier] Running simulated verification...");

    // Calculate confidence based on input scores
    const avgScore =
      (verdict.feasibility + verdict.safety + verdict.legality + verdict.cost_efficiency) / 4;

    // Add some randomness for realism
    const confidence = Math.min(100, Math.max(60, avgScore + (Math.random() * 20 - 10)));

    const proofData = JSON.stringify({
      input: { plan, evidence, verdict },
      confidence: confidence,
      timestamp: new Date().toISOString(),
      simulator: true,
    });

    const proof = crypto.createHash("sha256").update(proofData).digest("hex");

    return {
      verified: confidence >= 75,
      confidence: Math.round(confidence),
      proof: `0x${proof}`,
      timestamp: new Date().toISOString(),
      computeHash: `sim_hash_${Date.now()}`,
      message: `[SIMULATED] Decision verified with ${Math.round(confidence)}% confidence`,
      decision_confidence: Math.round(confidence),
      feasibility_verified: verdict.feasibility,
      safety_verified: verdict.safety,
      legality_verified: verdict.legality,
      cost_verified: verdict.cost_efficiency,
      overall_verification: Math.round(confidence),
    };
  }

  /**
   * Build verification prompt for Claude
   */
  private buildVerificationPrompt(plan: any, evidence: any, verdict: any): string {
    return `You are a verification agent for autonomous multi-agent decisions.

Analyze the following deliberation and provide verification scores (0-100) on whether each verdict score is justified:

PLAN:
- Steps: ${plan.steps?.length || 0}
- Estimated cost: $${plan.estimated_total_cost || 0}
- Feasibility: ${plan.feasibility_score}%

EVIDENCE:
- Claims analyzed: ${evidence.claims_analyzed}
- Claims verified: ${evidence.claims_verified}
- Confidence: ${(evidence.confidence_overall * 100).toFixed(1)}%

VERDICT:
- Feasibility: ${verdict.feasibility}%
- Safety: ${verdict.safety}%
- Legality: ${verdict.legality}%
- Cost Efficiency: ${verdict.cost_efficiency}%
- Overall Score: ${verdict.overall_score}%
- Decision: ${verdict.decision}

Respond with ONLY valid JSON (no markdown):
{
  "feasibility_verified": 85,
  "safety_verified": 90,
  "legality_verified": 95,
  "cost_verified": 80,
  "decision_confidence": 88,
  "reasoning": "Brief explanation"
}`;
  }

  /**
   * Send verification request to 0G Compute endpoint
   */
  private async sendVerificationRequest(payload: any): Promise<any> {
    const response = await axios.post(`${this.endpoint}/compute/verify`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`0G Compute returned status ${response.status}`);
    }

    return response.data;
  }

  /**
   * Parse verification response from 0G Compute
   */
  private parseVerificationResponse(data: any): any {
    try {
      // Extract JSON from response
      let parsed = data;

      // If data is a string, try to parse it
      if (typeof data === "string") {
        // Try to extract JSON if embedded in text
        const jsonMatch = data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = JSON.parse(data);
        }
      }

      return {
        feasibility_verified: Math.min(100, Math.max(0, parsed.feasibility_verified || 0)),
        safety_verified: Math.min(100, Math.max(0, parsed.safety_verified || 0)),
        legality_verified: Math.min(100, Math.max(0, parsed.legality_verified || 0)),
        cost_verified: Math.min(100, Math.max(0, parsed.cost_verified || 0)),
        decision_confidence: Math.min(100, Math.max(0, parsed.decision_confidence || 0)),
        overall_verification:
          Math.min(100, Math.max(0, parsed.decision_confidence || 0)) ||
          Math.round(
            ((Math.min(100, Math.max(0, parsed.feasibility_verified || 0)) +
              Math.min(100, Math.max(0, parsed.safety_verified || 0)) +
              Math.min(100, Math.max(0, parsed.legality_verified || 0)) +
              Math.min(100, Math.max(0, parsed.cost_verified || 0))) /
              4)
          ),
      };
    } catch (error) {
      console.error("[ComputeVerifier] Parse error:", error);
      return {
        feasibility_verified: 0,
        safety_verified: 0,
        legality_verified: 0,
        cost_verified: 0,
        decision_confidence: 0,
        overall_verification: 0,
      };
    }
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Health check for 0G Compute endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.endpoint}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (_error) {
      console.warn("[ComputeVerifier] Health check failed");
      return false;
    }
  }

  /**
   * Get verification statistics
   */
  async getStats(): Promise<{
    average_confidence: number;
    total_verifications: number;
    approval_rate: number;
  }> {
    try {
      const response = await axios.get(`${this.endpoint}/stats`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: 5000,
      });
      return response.data;
    } catch (_error) {
      return {
        average_confidence: 0,
        total_verifications: 0,
        approval_rate: 0,
      };
    }
  }
}

// Export singleton instance
let verifierInstance: ComputeVerifier | null = null;

export function getComputeVerifier(): ComputeVerifier {
  if (!verifierInstance) {
    const endpoint = process.env.OG_COMPUTE_ENDPOINT || "http://localhost:8082";
    const apiKey = process.env.OG_COMPUTE_API_KEY || "test-key";
    verifierInstance = new ComputeVerifier(endpoint, apiKey);
  }
  return verifierInstance;
}

export function setComputeVerifier(instance: ComputeVerifier): void {
  verifierInstance = instance;
}