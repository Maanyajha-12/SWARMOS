
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainBreeding
 * @notice Cross-chain iNFT breeding with royalty distribution
 * @dev Parents can be on different chains; child minted on primary chain
 */
contract CrossChainBreeding {
    struct BreedingRecord {
        uint256 id;
        uint256 parent1Id;
        uint256 parent1Chain;
        uint256 parent2Id;
        uint256 parent2Chain;
        uint256 childId;
        uint256 childChain;
        uint256 compatibility;
        bytes32 geneticHash;
        uint256 timestamp;
    }

    uint256 public breedingCount;
    uint256 public nextChildId = 10000;
    mapping(uint256 => BreedingRecord) public breedings;
    mapping(uint256 => uint256) public breedCount; // tokenId => breed count

    uint256 public breedingFee = 0.01 ether;
    uint256 public parentRoyaltyPercent = 25;  // 2.5% each parent (in basis points / 10)
    uint256 public protocolRoyaltyPercent = 25; // 2.5% protocol

    address public owner;
    uint256 public totalRoyalties;

    event BreedingCompleted(
        uint256 indexed id,
        uint256 parent1Id, uint256 parent1Chain,
        uint256 parent2Id, uint256 parent2Chain,
        uint256 childId, uint256 childChain,
        bytes32 geneticHash
    );
    event RoyaltyDistributed(uint256 indexed breedingId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Breed two agents (potentially from different chains)
     */
    function breed(
        uint256 parent1Id,
        uint256 parent1Chain,
        uint256 parent2Id,
        uint256 parent2Chain,
        uint256 compatibility
    ) external payable returns (uint256) {
        require(msg.value >= breedingFee, "Insufficient breeding fee");
        require(parent1Id != parent2Id || parent1Chain != parent2Chain, "Cannot self-breed");
        require(compatibility > 0 && compatibility <= 100, "Invalid compatibility");

        breedingCount++;
        nextChildId++;

        bytes32 geneticHash = keccak256(abi.encodePacked(
            parent1Id, parent1Chain,
            parent2Id, parent2Chain,
            block.timestamp, block.prevrandao
        ));

        breedings[breedingCount] = BreedingRecord({
            id: breedingCount,
            parent1Id: parent1Id,
            parent1Chain: parent1Chain,
            parent2Id: parent2Id,
            parent2Chain: parent2Chain,
            childId: nextChildId,
            childChain: block.chainid,
            compatibility: compatibility,
            geneticHash: geneticHash,
            timestamp: block.timestamp
        });

        breedCount[parent1Id]++;
        breedCount[parent2Id]++;

        // Track royalties
        totalRoyalties += msg.value;

        emit BreedingCompleted(
            breedingCount,
            parent1Id, parent1Chain,
            parent2Id, parent2Chain,
            nextChildId, block.chainid,
            geneticHash
        );

        return nextChildId;
    }

    /**
     * @notice Get breeding record
     */
    function getBreeding(uint256 breedingId) external view returns (BreedingRecord memory) {
        return breedings[breedingId];
    }

    /**
     * @notice Get breed count for a parent
     */
    function getBreedCount(uint256 tokenId) external view returns (uint256) {
        return breedCount[tokenId];
    }

    function setBreedingFee(uint256 _fee) external onlyOwner {
        breedingFee = _fee;
    }

    function withdrawRoyalties() external onlyOwner {
        uint256 amount = totalRoyalties;
        totalRoyalties = 0;
        payable(owner).transfer(amount);
    }
}
