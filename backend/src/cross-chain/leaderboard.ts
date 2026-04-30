/**
 * Global Leaderboard — Multi-Chain Score Aggregation
 */

import crypto from 'crypto';

export interface AgentRanking {
    agentId: number;
    agentName: string;
    homeChain: string;
    generation: number;
    globalScore: number;
    chainScores: Record<string, number>;
    totalWins: number;
    totalMatches: number;
    winRate: number;
    breedingCount: number;
    lastActive: number;
}

export class GlobalLeaderboard {
    private rankings: Map<number, AgentRanking> = new Map();

    constructor() {
        // Seed demo data
        this.seedDemoRankings();
        console.log('[GlobalLeaderboard] Initialized with', this.rankings.size, 'agents');
    }

    private seedDemoRankings(): void {
        const chains = ['0g-testnet', 'ethereum-sepolia', 'polygon-mumbai'];
        const names = ['Alpha-Prime', 'NeuralForge', 'DeepOracle', 'QuantumMind', 'CyberSentinel', 'NexusAgent'];
        
        for (let i = 0; i < 6; i++) {
            const chainScores: Record<string, number> = {};
            chains.forEach(c => { chainScores[c] = Math.floor(70 + Math.random() * 25); });
            
            this.rankings.set(1001 + i, {
                agentId: 1001 + i,
                agentName: names[i],
                homeChain: chains[i % 3],
                generation: Math.floor(Math.random() * 3),
                globalScore: Math.floor(75 + Math.random() * 20),
                chainScores,
                totalWins: Math.floor(5 + Math.random() * 20),
                totalMatches: Math.floor(10 + Math.random() * 30),
                winRate: parseFloat((0.5 + Math.random() * 0.4).toFixed(2)),
                breedingCount: Math.floor(Math.random() * 5),
                lastActive: Date.now() - Math.floor(Math.random() * 3600000),
            });
        }
    }

    updateScore(agentId: number, chain: string, score: number): void {
        const agent = this.rankings.get(agentId);
        if (!agent) return;
        agent.chainScores[chain] = score;
        // Recalculate global score (weighted average)
        const scores = Object.values(agent.chainScores);
        agent.globalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        agent.lastActive = Date.now();
    }

    recordMatch(agentId: number, won: boolean): void {
        const agent = this.rankings.get(agentId);
        if (!agent) return;
        agent.totalMatches++;
        if (won) agent.totalWins++;
        agent.winRate = parseFloat((agent.totalWins / agent.totalMatches).toFixed(2));
    }

    getGlobalRankings(limit: number = 20): AgentRanking[] {
        return Array.from(this.rankings.values())
            .sort((a, b) => b.globalScore - a.globalScore)
            .slice(0, limit);
    }

    getChainRankings(chain: string, limit: number = 20): AgentRanking[] {
        return Array.from(this.rankings.values())
            .filter(a => a.chainScores[chain] !== undefined)
            .sort((a, b) => (b.chainScores[chain] || 0) - (a.chainScores[chain] || 0))
            .slice(0, limit);
    }

    getAgent(agentId: number): AgentRanking | undefined {
        return this.rankings.get(agentId);
    }

    getStats() {
        const agents = Array.from(this.rankings.values());
        return {
            totalAgents: agents.length,
            avgGlobalScore: Math.round(agents.reduce((s, a) => s + a.globalScore, 0) / agents.length),
            topAgent: agents.sort((a, b) => b.globalScore - a.globalScore)[0],
            totalMatches: agents.reduce((s, a) => s + a.totalMatches, 0),
            totalBreedings: agents.reduce((s, a) => s + a.breedingCount, 0),
        };
    }
}

export default GlobalLeaderboard;
