/**
 * Proof-of-Intelligence (PoI) Consensus
 * Novel commit-reveal scheme for multi-agent decision verification
 */

import crypto from 'crypto';

export interface AgentCommitment {
    agentName: string;
    commitHash: string;      // SHA-256 of (decision + salt)
    revealedDecision?: string;
    salt?: string;
    timestamp: number;
    verified: boolean;
}

export interface ConsensusRound {
    id: string;
    prompt: string;
    phase: 'commit' | 'reveal' | 'consensus' | 'complete';
    commitments: AgentCommitment[];
    consensusScore: number;
    divergenceDetected: boolean;
    divergenceDetails?: string[];
    finalDecision?: string;
    proofHash?: string;
    timestamp: number;
    duration?: number;
}

export class ProofOfIntelligence {
    private rounds: Map<string, ConsensusRound> = new Map();
    private history: ConsensusRound[] = [];

    constructor() {
        console.log('[PoI] Proof-of-Intelligence consensus engine initialized');
    }

    /**
     * Start a new consensus round
     */
    startRound(prompt: string): ConsensusRound {
        const round: ConsensusRound = {
            id: `poi_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            prompt,
            phase: 'commit',
            commitments: [],
            consensusScore: 0,
            divergenceDetected: false,
            timestamp: Date.now(),
        };
        this.rounds.set(round.id, round);
        return round;
    }

    /**
     * Phase 1: Agent commits a hashed decision (before seeing others)
     */
    commitDecision(roundId: string, agentName: string, decision: string): AgentCommitment {
        const round = this.rounds.get(roundId);
        if (!round) throw new Error('Round not found');
        if (round.phase !== 'commit') throw new Error('Not in commit phase');

        const salt = crypto.randomBytes(16).toString('hex');
        const commitHash = crypto.createHash('sha256')
            .update(decision + salt)
            .digest('hex');

        const commitment: AgentCommitment = {
            agentName,
            commitHash: `0x${commitHash}`,
            timestamp: Date.now(),
            verified: false,
            // Store for reveal phase (in production, agent holds these)
            revealedDecision: decision,
            salt,
        };

        round.commitments.push(commitment);
        console.log(`[PoI] Agent '${agentName}' committed: ${commitment.commitHash.slice(0, 16)}...`);
        return { ...commitment, revealedDecision: undefined, salt: undefined }; // Don't expose
    }

    /**
     * Phase 2: Agents reveal their decisions
     */
    revealDecisions(roundId: string): ConsensusRound {
        const round = this.rounds.get(roundId);
        if (!round) throw new Error('Round not found');

        round.phase = 'reveal';

        // Verify each commitment
        for (const commitment of round.commitments) {
            if (commitment.revealedDecision && commitment.salt) {
                const expectedHash = `0x${crypto.createHash('sha256')
                    .update(commitment.revealedDecision + commitment.salt)
                    .digest('hex')}`;
                commitment.verified = expectedHash === commitment.commitHash;
            }
        }

        const verifiedCount = round.commitments.filter(c => c.verified).length;
        console.log(`[PoI] Reveal phase: ${verifiedCount}/${round.commitments.length} commitments verified`);

        return round;
    }

    /**
     * Phase 3: Calculate consensus
     */
    calculateConsensus(roundId: string): ConsensusRound {
        const round = this.rounds.get(roundId);
        if (!round) throw new Error('Round not found');

        round.phase = 'consensus';

        const decisions = round.commitments
            .filter(c => c.verified && c.revealedDecision)
            .map(c => c.revealedDecision!);

        // Check for agreement
        const decisionCounts = new Map<string, number>();
        for (const d of decisions) {
            // Normalize: extract APPROVE/REVISE from decision text
            const normalized = d.includes('APPROVE') ? 'APPROVE' : 'REVISE';
            decisionCounts.set(normalized, (decisionCounts.get(normalized) || 0) + 1);
        }

        const total = decisions.length;
        let maxAgreement = 0;
        let majorityDecision = '';

        for (const [decision, count] of decisionCounts) {
            if (count > maxAgreement) {
                maxAgreement = count;
                majorityDecision = decision;
            }
        }

        round.consensusScore = total > 0 ? Math.round((maxAgreement / total) * 100) : 0;
        round.divergenceDetected = round.consensusScore < 75;
        round.finalDecision = majorityDecision;

        if (round.divergenceDetected) {
            round.divergenceDetails = [
                `Only ${round.consensusScore}% agreement among ${total} agents`,
                `Majority decision: ${majorityDecision} (${maxAgreement}/${total})`,
                'Divergence triggers deeper analysis in production',
            ];
        }

        // Generate final proof
        const proofData = round.commitments.map(c => c.commitHash).join('|') + '|' + round.consensusScore;
        round.proofHash = `0x${crypto.createHash('sha256').update(proofData).digest('hex')}`;
        round.phase = 'complete';
        round.duration = Date.now() - round.timestamp;

        this.history.push({ ...round });
        console.log(`[PoI] Consensus: ${round.consensusScore}% | Decision: ${round.finalDecision} | Proof: ${round.proofHash.slice(0, 16)}...`);

        return round;
    }

    /**
     * Run the full PoI pipeline for a set of agent decisions
     */
    runConsensus(prompt: string, agentDecisions: Record<string, string>): ConsensusRound {
        const round = this.startRound(prompt);

        // Phase 1: Commit
        for (const [agent, decision] of Object.entries(agentDecisions)) {
            this.commitDecision(round.id, agent, decision);
        }

        // Phase 2: Reveal
        this.revealDecisions(round.id);

        // Phase 3: Consensus
        return this.calculateConsensus(round.id);
    }

    getRound(roundId: string): ConsensusRound | undefined {
        return this.rounds.get(roundId);
    }

    getHistory(limit: number = 10): ConsensusRound[] {
        return this.history.slice(-limit).reverse();
    }

    getStats() {
        return {
            totalRounds: this.history.length,
            avgConsensus: this.history.length > 0
                ? Math.round(this.history.reduce((s, r) => s + r.consensusScore, 0) / this.history.length)
                : 0,
            divergenceRate: this.history.length > 0
                ? Math.round((this.history.filter(r => r.divergenceDetected).length / this.history.length) * 100)
                : 0,
            approvalRate: this.history.length > 0
                ? Math.round((this.history.filter(r => r.finalDecision === 'APPROVE').length / this.history.length) * 100)
                : 0,
        };
    }
}

export default ProofOfIntelligence;
