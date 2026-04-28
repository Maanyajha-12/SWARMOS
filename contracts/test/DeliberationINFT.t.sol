// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {DeliberationINFT} from "../src/DeliberationINFT.sol";

contract DeliberationINFTTest {
    DeliberationINFT nft;
    address orchestrator = address(0x1234);
    address deployer = address(this);

    function setUp() public {
        nft = new DeliberationINFT(orchestrator);
    }

    function testMint() public {
        uint256 tokenId = nft.mint(
            "sess_test_001",
            "Test deliberation",
            keccak256("plan"),
            keccak256("evidence"),
            keccak256("verdict"),
            keccak256("result"),
            keccak256("proof"),
            89,
            87,
            "ipfs://test"
        );

        assert(tokenId == 1);
    }

    function testOwnership() public {
        uint256 tokenId = nft.mint(
            "sess_test_002",
            "Test",
            keccak256("p"),
            keccak256("e"),
            keccak256("v"),
            keccak256("r"),
            keccak256("pr"),
            85,
            80,
            "uri"
        );

        assert(nft.ownerOf(tokenId) == orchestrator);
    }
}
