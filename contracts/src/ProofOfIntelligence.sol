// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofOfIntelligence
 * @notice On-chain commit-reveal consensus for multi-agent decisions
 * @dev Novel PoI mechanism — agents commit hashed decisions independently before revealing
 */
contract ProofOfIntelligence {
    struct ConsensusRound {
        uint256 id;
        string prompt;
        uint8 phase;          // 0=commit, 1=reveal, 2=complete
        uint256 commitCount;
        uint256 revealCount;
        uint256 consensusScore;
        bool divergenceDetected;
        bytes32 finalProof;
        uint256 timestamp;
    }

    struct Commitment {
        bytes32 commitHash;
        bytes32 revealedHash;
        bool committed;
        bool revealed;
        bool verified;
    }

    uint256 public roundCount;
    mapping(uint256 => ConsensusRound) public rounds;
    mapping(uint256 => mapping(address => Commitment)) public commitments;
    mapping(uint256 => address[]) public roundAgents;
    
    uint256 public consensusThreshold = 75; // 75% agreement required
    address public owner;

    event RoundCreated(uint256 indexed id, string prompt);
    event DecisionCommitted(uint256 indexed roundId, address agent, bytes32 commitHash);
    event DecisionRevealed(uint256 indexed roundId, address agent, bool verified);
    event ConsensusReached(uint256 indexed roundId, uint256 score, bool divergence, bytes32 proof);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Start a new consensus round
     */
    function createRound(string calldata prompt) external onlyOwner returns (uint256) {
        roundCount++;
        rounds[roundCount] = ConsensusRound({
            id: roundCount,
            prompt: prompt,
            phase: 0,
            commitCount: 0,
            revealCount: 0,
            consensusScore: 0,
            divergenceDetected: false,
            finalProof: bytes32(0),
            timestamp: block.timestamp
        });
        emit RoundCreated(roundCount, prompt);
        return roundCount;
    }

    /**
     * @notice Agent commits a hashed decision (before seeing others)
     * @param roundId The consensus round
     * @param commitHash SHA-256 of (decision + salt)
     */
    function commitDecision(uint256 roundId, bytes32 commitHash) external {
        ConsensusRound storage round = rounds[roundId];
        require(round.phase == 0, "Not in commit phase");
        require(!commitments[roundId][msg.sender].committed, "Already committed");

        commitments[roundId][msg.sender] = Commitment({
            commitHash: commitHash,
            revealedHash: bytes32(0),
            committed: true,
            revealed: false,
            verified: false
        });

        roundAgents[roundId].push(msg.sender);
        round.commitCount++;

        emit DecisionCommitted(roundId, msg.sender, commitHash);
    }

    /**
     * @notice Agent reveals their decision with the original data + salt
     * @param roundId The consensus round
     * @param decision The original decision
     * @param salt The salt used during commit
     */
    function revealDecision(uint256 roundId, string calldata decision, bytes32 salt) external {
        ConsensusRound storage round = rounds[roundId];
        require(round.phase == 1, "Not in reveal phase");
        
        Commitment storage c = commitments[roundId][msg.sender];
        require(c.committed, "Not committed");
        require(!c.revealed, "Already revealed");

        // Verify the commitment
        bytes32 expectedHash = keccak256(abi.encodePacked(decision, salt));
        c.revealedHash = expectedHash;
        c.revealed = true;
        c.verified = (expectedHash == c.commitHash);
        round.revealCount++;

        emit DecisionRevealed(roundId, msg.sender, c.verified);
    }

    /**
     * @notice Transition round to reveal phase
     */
    function startRevealPhase(uint256 roundId) external onlyOwner {
        require(rounds[roundId].phase == 0, "Not in commit phase");
        rounds[roundId].phase = 1;
    }

    /**
     * @notice Finalize consensus and generate proof
     */
    function finalizeConsensus(uint256 roundId, uint256 consensusScore, bytes32 proofHash) external onlyOwner {
        ConsensusRound storage round = rounds[roundId];
        require(round.phase == 1, "Not in reveal phase");

        round.phase = 2;
        round.consensusScore = consensusScore;
        round.divergenceDetected = consensusScore < consensusThreshold;
        round.finalProof = proofHash;

        emit ConsensusReached(roundId, consensusScore, round.divergenceDetected, proofHash);
    }

    /**
     * @notice Verify a consensus proof
     */
    function verifyConsensus(uint256 roundId) external view returns (bool, uint256, bytes32) {
        ConsensusRound storage round = rounds[roundId];
        return (round.phase == 2, round.consensusScore, round.finalProof);
    }

    function setConsensusThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold <= 100, "Invalid threshold");
        consensusThreshold = _threshold;
    }

    function getRoundAgents(uint256 roundId) external view returns (address[] memory) {
        return roundAgents[roundId];
    }
}
