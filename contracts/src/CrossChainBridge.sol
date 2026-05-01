// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainBridge
 * @notice Bridge contract for cross-chain agent message passing in SWARM OS
 * @dev Supports Ethereum, Polygon, and 0G Chain message relay
 */
contract CrossChainBridge {
    struct Message {
        uint256 id;
        uint256 sourceChain;
        uint256 destChain;
        bytes32 payloadHash;
        address sender;
        uint256 nonce;
        uint256 timestamp;
        bool processed;
    }

    uint256 public messageCount;
    mapping(uint256 => Message) public messages;
    mapping(address => bool) public authorizedRelayers;
    mapping(uint256 => bool) public supportedChains;
    mapping(bytes32 => bool) public processedProofs;

    address public owner;
    uint256 public relayFee = 0.001 ether;

    event MessageSent(uint256 indexed id, uint256 sourceChain, uint256 destChain, bytes32 payloadHash, address sender);
    event MessageReceived(uint256 indexed id, bytes32 proofHash, address relayer);
    event RelayerAdded(address relayer);
    event RelayerRemoved(address relayer);
    event ChainAdded(uint256 chainId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRelayer() {
        require(authorizedRelayers[msg.sender], "Not authorized relayer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedRelayers[msg.sender] = true;

        // Register default chains
        supportedChains[16602] = true;     // 0G Galileo Testnet
        supportedChains[11155111] = true;  // Ethereum Sepolia
        supportedChains[80001] = true;     // Polygon Mumbai
    }

    /**
     * @notice Send a cross-chain message
     * @param destChain Target chain ID
     * @param payloadHash Hash of the message payload
     */
    function sendMessage(uint256 destChain, bytes32 payloadHash) external payable returns (uint256) {
        require(supportedChains[destChain], "Unsupported chain");
        require(msg.value >= relayFee, "Insufficient relay fee");

        messageCount++;
        messages[messageCount] = Message({
            id: messageCount,
            sourceChain: block.chainid,
            destChain: destChain,
            payloadHash: payloadHash,
            sender: msg.sender,
            nonce: messageCount,
            timestamp: block.timestamp,
            processed: false
        });

        emit MessageSent(messageCount, block.chainid, destChain, payloadHash, msg.sender);
        return messageCount;
    }

    /**
     * @notice Process an incoming cross-chain message
     * @param messageId Original message ID
     * @param proofHash Verification proof hash
     */
    function receiveMessage(uint256 messageId, bytes32 proofHash) external onlyRelayer {
        require(!processedProofs[proofHash], "Already processed");
        processedProofs[proofHash] = true;

        if (messageId <= messageCount && messages[messageId].id == messageId) {
            messages[messageId].processed = true;
        }

        emit MessageReceived(messageId, proofHash, msg.sender);
    }

    /**
     * @notice Verify a bridge proof
     */
    function verifyProof(bytes32 proofHash) external view returns (bool) {
        return processedProofs[proofHash];
    }

    function addRelayer(address relayer) external onlyOwner {
        authorizedRelayers[relayer] = true;
        emit RelayerAdded(relayer);
    }

    function removeRelayer(address relayer) external onlyOwner {
        authorizedRelayers[relayer] = false;
        emit RelayerRemoved(relayer);
    }

    function addChain(uint256 chainId) external onlyOwner {
        supportedChains[chainId] = true;
        emit ChainAdded(chainId);
    }

    function setRelayFee(uint256 _fee) external onlyOwner {
        relayFee = _fee;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
