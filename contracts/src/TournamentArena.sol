// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TournamentArena
 * @notice On-chain tournament coordinator with entry fees and prize distribution
 * @dev Manages competitive elimination tournaments for SWARM OS agents
 */
contract TournamentArena {
    struct Tournament {
        uint256 id;
        string prompt;
        uint256 entryFee;
        uint256 prizePool;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256[] participants;
        uint256 winnerId;
        uint256 winnerScore;
        bool completed;
        bytes32 proofHash;
    }

    struct TournamentResult {
        uint256 agentId;
        uint256 score;
        uint256 round;
        bytes32 proofHash;
    }

    uint256 public tournamentCount;
    mapping(uint256 => Tournament) public tournaments;
    mapping(uint256 => TournamentResult[]) public tournamentResults;
    mapping(uint256 => mapping(uint256 => bool)) public hasEntered; // tournamentId => agentId => entered

    address public owner;
    uint256 public protocolFeePercent = 30; // 30% to protocol
    uint256 public totalProtocolFees;

    event TournamentCreated(uint256 indexed id, string prompt, uint256 entryFee, uint256 maxParticipants);
    event AgentEntered(uint256 indexed tournamentId, uint256 indexed agentId);
    event TournamentCompleted(uint256 indexed id, uint256 winnerId, uint256 winnerScore, uint256 prize);
    event ScoreRecorded(uint256 indexed tournamentId, uint256 agentId, uint256 score, uint256 round);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Create a new tournament
     */
    function createTournament(
        string calldata prompt,
        uint256 entryFee,
        uint256 maxParticipants,
        uint256 durationSeconds
    ) external onlyOwner returns (uint256) {
        tournamentCount++;

        uint256[] memory empty;
        tournaments[tournamentCount] = Tournament({
            id: tournamentCount,
            prompt: prompt,
            entryFee: entryFee,
            prizePool: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + durationSeconds,
            maxParticipants: maxParticipants,
            participants: empty,
            winnerId: 0,
            winnerScore: 0,
            completed: false,
            proofHash: bytes32(0)
        });

        emit TournamentCreated(tournamentCount, prompt, entryFee, maxParticipants);
        return tournamentCount;
    }

    /**
     * @notice Enter an agent into a tournament
     */
    function enterTournament(uint256 tournamentId, uint256 agentId) external payable {
        Tournament storage t = tournaments[tournamentId];
        require(!t.completed, "Tournament completed");
        require(t.participants.length < t.maxParticipants, "Tournament full");
        require(!hasEntered[tournamentId][agentId], "Already entered");
        require(msg.value >= t.entryFee, "Insufficient entry fee");

        t.participants.push(agentId);
        t.prizePool += msg.value;
        hasEntered[tournamentId][agentId] = true;

        emit AgentEntered(tournamentId, agentId);
    }

    /**
     * @notice Record a score for a tournament round
     */
    function recordScore(
        uint256 tournamentId,
        uint256 agentId,
        uint256 score,
        uint256 round,
        bytes32 proofHash
    ) external onlyOwner {
        require(!tournaments[tournamentId].completed, "Tournament completed");
        require(hasEntered[tournamentId][agentId], "Agent not in tournament");

        tournamentResults[tournamentId].push(TournamentResult({
            agentId: agentId,
            score: score,
            round: round,
            proofHash: proofHash
        }));

        emit ScoreRecorded(tournamentId, agentId, score, round);
    }

    /**
     * @notice Complete a tournament and distribute prizes
     */
    function completeTournament(
        uint256 tournamentId,
        uint256 winnerId,
        uint256 winnerScore,
        bytes32 proofHash
    ) external onlyOwner {
        Tournament storage t = tournaments[tournamentId];
        require(!t.completed, "Already completed");

        t.completed = true;
        t.winnerId = winnerId;
        t.winnerScore = winnerScore;
        t.proofHash = proofHash;
        t.endTime = block.timestamp;

        // Distribute prizes: 70% to winner, 30% to protocol
        uint256 protocolFee = (t.prizePool * protocolFeePercent) / 100;
        uint256 winnerPrize = t.prizePool - protocolFee;
        totalProtocolFees += protocolFee;

        emit TournamentCompleted(tournamentId, winnerId, winnerScore, winnerPrize);
    }

    /**
     * @notice Get tournament details
     */
    function getTournament(uint256 tournamentId) external view returns (Tournament memory) {
        return tournaments[tournamentId];
    }

    /**
     * @notice Get tournament results
     */
    function getResults(uint256 tournamentId) external view returns (TournamentResult[] memory) {
        return tournamentResults[tournamentId];
    }

    function setProtocolFee(uint256 _percent) external onlyOwner {
        require(_percent <= 50, "Fee too high");
        protocolFeePercent = _percent;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = totalProtocolFees;
        totalProtocolFees = 0;
        payable(owner).transfer(amount);
    }
}
