// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {VRFCoordinatorV2Mock} from "../lib/chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";
import {TrustlessCards} from "../src/TrustlessCards.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployContracts is Script {
    function run() external {
        bytes32 _salt = bytes32(abi.encode(1596));
        vm.startBroadcast();
        VRFCoordinatorV2Mock vrf = VRFCoordinatorV2Mock(0xBb61aCa2d955CBAB560f18aCF11f320830161193);

        TrustlessCards trustlessCardsContract = new TrustlessCards(1, address(vrf), 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc);

        vrf.addConsumer(1, address(trustlessCardsContract));

        trustlessCardsContract.requestRandomWords();
        uint256 requestId = trustlessCardsContract.s_requestId();
        vrf.fulfillRandomWords(requestId, address(trustlessCardsContract));

        uint256 randomWords = trustlessCardsContract.s_randomWords(0);

        vm.stopBroadcast();
        console.log(
            "TrustlessCards address:",
            address(trustlessCardsContract),
            "at network:",
            block.chainid
        );
        console.log(
            "RandomWords:",
            randomWords
        );
    }
}
