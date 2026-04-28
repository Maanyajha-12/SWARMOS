# Deliberation iNFT Smart Contract

Production-ready ERC721 contract for minting iNFTs representing autonomous deliberation decisions with verifiable compute proofs.

## Features

- **iNFT Minting**: Create NFTs with deliberation session metadata
- **Compute Proof Storage**: Store and verify 0G compute proofs on-chain
- **Execution Tracking**: Record transaction hashes and gas execution details
- **Session Metadata**: IPFS-linked metadata containing:
  - Plan (planning phase)
  - Evidence (research phase)
  - Verdict (critic phase)
  - Execution result (executor phase)
  - Compute verification proof (0G phase)

## Technical Details

### Contract Functions

#### `mint()`
Mints an iNFT for a deliberation session. Called by orchestrator after successful execution.

```solidity
function mint(
    string memory sessionId,
    string memory prompt,
    bytes32 planHash,
    bytes32 evidenceHash,
    bytes32 verdictHash,
    bytes32 resultHash,
    bytes32 computeProofHash,
    uint8 computeConfidence,    // 0-100
    uint8 verdictScore,         // 0-100
    string memory metadataURI   // IPFS hash
) external onlyOrchestrator returns (uint256)
```

#### `recordExecution()`
Records execution details after transaction completes.

```solidity
function recordExecution(
    uint256 tokenId,
    string memory transactionHash,
    uint256 gasUsed,
    uint256 costUsd
) external onlyOrchestrator
```

#### `verifyComputeProof()`
Updates compute proof after 0G verification.

```solidity
function verifyComputeProof(
    uint256 tokenId,
    bytes32 proofHash,
    uint8 confidence
) external onlyOrchestrator
```

### Data Structure

```solidity
struct DeliberationMetadata {
    string sessionId;           // Unique session identifier
    string prompt;              // Original user prompt
    bytes32 planHash;           // Hash of planning phase
    bytes32 evidenceHash;       // Hash of research results
    bytes32 verdictHash;        // Hash of critic verdict
    bytes32 resultHash;         // Hash of execution result
    bytes32 computeProofHash;   // Hash of 0G compute proof
    uint8 computeConfidence;    // Confidence % of verification
    uint8 verdictScore;         // Overall decision score
    uint256 timestamp;          // Minting timestamp
    bool executed;              // Whether execution was recorded
}
```

## Deployment

### Using Forge

```bash
# Build
forge build

# Test
forge test

# Deploy to 0G testnet
forge script src/Deploy.sol:DeployScript \
  --rpc-url https://rpc-testnet.0g.ai \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## Events

- `DeliberationMinted`: Emitted when new iNFT is minted
- `ExecutionRecorded`: Emitted when execution details recorded
- `ComputeProofVerified`: Emitted when compute proof verified

## Security

- ✅ Only orchestrator can mint/update tokens
- ✅ No reentrancy vulnerabilities
- ✅ IPFS metadata immutability
- ✅ Proof-of-computation validation

## Gas Optimization

- Batch operations supported
- Efficient storage layout
- Minimal external calls

## License

MIT
