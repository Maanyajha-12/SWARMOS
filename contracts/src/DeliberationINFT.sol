// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title DeliberationINFT
 * @notice Mints iNFTs representing autonomous deliberation decisions with verifiable compute proofs
 * @dev Each NFT contains:
 *   - Session data (plan, evidence, verdict)
 *   - 0G Compute verification proof
 *   - Execution result with transaction proof
 */

interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
}

interface IERC721Metadata is IERC721 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
        external
        returns (bytes4);
}

contract DeliberationINFT is IERC721Metadata {
    string public name = "Deliberation iNFT";
    string public symbol = "IDLIB";
    uint256 private tokenIdCounter = 1;

    address public owner;
    address public orchestrator;

    // Token metadata
    mapping(uint256 => string) private tokenURIs;
    mapping(uint256 => address) private tokenOwners;
    mapping(address => uint256) private balances;
    mapping(uint256 => address) private tokenApprovals;
    mapping(address => mapping(address => bool)) private operatorApprovals;

    // Deliberation session data
    struct DeliberationMetadata {
        string sessionId;
        string prompt;
        bytes32 planHash;
        bytes32 evidenceHash;
        bytes32 verdictHash;
        bytes32 resultHash;
        bytes32 computeProofHash;
        uint8 computeConfidence; // 0-100
        uint8 verdictScore; // 0-100
        uint256 timestamp;
        bool executed;
    }

    mapping(uint256 => DeliberationMetadata) public deliberations;

    // Events
    event DeliberationMinted(
        uint256 indexed tokenId,
        string indexed sessionId,
        address indexed minter,
        uint8 computeConfidence,
        uint8 verdictScore
    );

    event ExecutionRecorded(uint256 indexed tokenId, string transactionHash, uint256 gasUsed, uint256 costUsd);

    event ComputeProofVerified(uint256 indexed tokenId, bytes32 proofHash, uint8 confidence);

    modifier onlyOrchestrator() {
        require(msg.sender == orchestrator, "Only orchestrator");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _orchestrator) {
        owner = msg.sender;
        orchestrator = _orchestrator;
    }

    function mint(
        string memory sessionId,
        string memory prompt,
        bytes32 planHash,
        bytes32 evidenceHash,
        bytes32 verdictHash,
        bytes32 resultHash,
        bytes32 computeProofHash,
        uint8 computeConfidence,
        uint8 verdictScore,
        string memory metadataURI
    ) external onlyOrchestrator returns (uint256) {
        require(computeConfidence > 0, "Invalid confidence");
        require(verdictScore > 0, "Invalid score");
        require(bytes(sessionId).length > 0, "Invalid session ID");

        uint256 tokenId = tokenIdCounter++;

        tokenOwners[tokenId] = msg.sender;
        balances[msg.sender]++;
        tokenURIs[tokenId] = metadataURI;

        deliberations[tokenId] = DeliberationMetadata({
            sessionId: sessionId,
            prompt: prompt,
            planHash: planHash,
            evidenceHash: evidenceHash,
            verdictHash: verdictHash,
            resultHash: resultHash,
            computeProofHash: computeProofHash,
            computeConfidence: computeConfidence,
            verdictScore: verdictScore,
            timestamp: block.timestamp,
            executed: false
        });

        emit DeliberationMinted(tokenId, sessionId, msg.sender, computeConfidence, verdictScore);
        return tokenId;
    }

    function recordExecution(uint256 tokenId, string memory transactionHash, uint256 gasUsed, uint256 costUsd)
        external
        onlyOrchestrator
    {
        require(tokenOwners[tokenId] != address(0), "Token doesn't exist");

        deliberations[tokenId].executed = true;

        emit ExecutionRecorded(tokenId, transactionHash, gasUsed, costUsd);
    }

    function verifyComputeProof(uint256 tokenId, bytes32 proofHash, uint8 confidence) external onlyOrchestrator {
        require(tokenOwners[tokenId] != address(0), "Token doesn't exist");
        require(confidence > 0 && confidence <= 100, "Invalid confidence");

        deliberations[tokenId].computeProofHash = proofHash;
        deliberations[tokenId].computeConfidence = confidence;

        emit ComputeProofVerified(tokenId, proofHash, confidence);
    }

    function getDeliberation(uint256 tokenId) external view returns (DeliberationMetadata memory) {
        require(tokenOwners[tokenId] != address(0), "Token doesn't exist");
        return deliberations[tokenId];
    }

    function balanceOf(address _owner) external view override returns (uint256) {
        require(_owner != address(0), "Invalid address");
        return balances[_owner];
    }

    function ownerOf(uint256 tokenId) external view override returns (address) {
        address tokenOwner = tokenOwners[tokenId];
        require(tokenOwner != address(0), "Token doesn't exist");
        return tokenOwner;
    }

    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        require(tokenOwners[tokenId] != address(0), "Token doesn't exist");
        return tokenURIs[tokenId];
    }

    function approve(address to, uint256 tokenId) external override {
        address owner = tokenOwners[tokenId];
        require(msg.sender == owner || operatorApprovals[owner][msg.sender], "Not approved");

        tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external override {
        operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) external override {
        require(from == tokenOwners[tokenId], "Not owner");
        require(
            msg.sender == from || msg.sender == tokenApprovals[tokenId] || operatorApprovals[from][msg.sender],
            "Not approved"
        );
        require(to != address(0), "Invalid recipient");

        balances[from]--;
        balances[to]++;
        tokenOwners[tokenId] = to;
        delete tokenApprovals[tokenId];

        emit Transfer(from, to, tokenId);
    }

    function setOrchestrator(address _orchestrator) external onlyOwner {
        require(_orchestrator != address(0), "Invalid address");
        orchestrator = _orchestrator;
    }

    function totalSupply() external view returns (uint256) {
        return tokenIdCounter - 1;
    }
}
