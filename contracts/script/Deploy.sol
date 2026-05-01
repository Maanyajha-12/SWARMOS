// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../lib/forge-std/src/Script.sol";
import "../lib/forge-std/src/console.sol";
import "../src/DeliberationINFT.sol";
import "../src/AgentRegistry.sol";
import "../src/ProofOfIntelligence.sol";
import "../src/TournamentArena.sol";
import "../src/CrossChainBridge.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy all contracts
        DeliberationINFT nft = new DeliberationINFT(msg.sender);
        console.log("DeliberationINFT deployed at:", address(nft));

        AgentRegistry registry = new AgentRegistry();
        console.log("AgentRegistry deployed at:", address(registry));

        ProofOfIntelligence poi = new ProofOfIntelligence();
        console.log("ProofOfIntelligence deployed at:", address(poi));

        TournamentArena arena = new TournamentArena();
        console.log("TournamentArena deployed at:", address(arena));

        CrossChainBridge bridge = new CrossChainBridge();
        console.log("CrossChainBridge deployed at:", address(bridge));

        console.log("");
        console.log("=== All SWARM OS Contracts Deployed ===");
        console.log("Network: 0G Galileo Testnet (Chain ID: 16602)");
        console.log("Deployer:", msg.sender);

        vm.stopBroadcast();
    }
}
