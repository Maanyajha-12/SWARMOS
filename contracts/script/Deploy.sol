// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../lib/forge-std/src/Script.sol";
import "../lib/forge-std/src/console.sol";
import "../src/DeliberationINFT.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        DeliberationINFT nft = new DeliberationINFT(msg.sender);

        console.log("Deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
