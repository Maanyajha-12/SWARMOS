// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @notice Global agent registry with cross-chain awareness for SWARM OS
 * @dev Tracks agent scores, rankings, and chain-specific performance
 */
contract AgentRegistry {
    struct Agent {
        uint256 tokenId;
        string name;
        uint256 homeChain;
        uint256 globalScore;
        uint256 totalMatches;
        uint256 totalWins;
        uint256 generation;
        uint256 breedingCount;
        uint256 registeredAt;
        bool active;
    }

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => mapping(uint256 => uint256)) public chainScores; // tokenId => chainId => score
    uint256[] public agentIds;

    address public owner;

    event AgentRegistered(uint256 indexed tokenId, string name, uint256 homeChain);
    event ScoreUpdated(uint256 indexed tokenId, uint256 chainId, uint256 score, bytes32 proofHash);
    event MatchRecorded(uint256 indexed tokenId, bool won, uint256 newScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Register a new agent
     */
    function registerAgent(uint256 tokenId, string calldata name, uint256 homeChain) external onlyOwner {
        require(!agents[tokenId].active, "Already registered");

        agents[tokenId] = Agent({
            tokenId: tokenId,
            name: name,
            homeChain: homeChain,
            globalScore: 0,
            totalMatches: 0,
            totalWins: 0,
            generation: 0,
            breedingCount: 0,
            registeredAt: block.timestamp,
            active: true
        });

        agentIds.push(tokenId);
        emit AgentRegistered(tokenId, name, homeChain);
    }

    /**
     * @notice Update an agent's score on a specific chain with proof
     */
    function updateScore(uint256 tokenId, uint256 chainId, uint256 score, bytes32 proofHash) external onlyOwner {
        require(agents[tokenId].active, "Agent not found");
        require(score <= 100, "Score must be <= 100");

        chainScores[tokenId][chainId] = score;
        
        // Recalculate global score (simple average for MVP)
        agents[tokenId].globalScore = score;

        emit ScoreUpdated(tokenId, chainId, score, proofHash);
    }

    /**
     * @notice Record a match result
     */
    function recordMatch(uint256 tokenId, bool won) external onlyOwner {
        require(agents[tokenId].active, "Agent not found");

        agents[tokenId].totalMatches++;
        if (won) {
            agents[tokenId].totalWins++;
        }

        emit MatchRecorded(tokenId, won, agents[tokenId].globalScore);
    }

    /**
     * @notice Get agent info
     */
    function getAgent(uint256 tokenId) external view returns (Agent memory) {
        return agents[tokenId];
    }

    /**
     * @notice Get chain-specific score
     */
    function getChainScore(uint256 tokenId, uint256 chainId) external view returns (uint256) {
        return chainScores[tokenId][chainId];
    }

    /**
     * @notice Get total registered agents
     */
    function getTotalAgents() external view returns (uint256) {
        return agentIds.length;
    }

    /**
     * @notice Increment breeding count
     */
    function recordBreeding(uint256 tokenId) external onlyOwner {
        require(agents[tokenId].active, "Agent not found");
        agents[tokenId].breedingCount++;
    }
}
