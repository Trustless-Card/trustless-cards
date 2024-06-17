//7 SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {VRFCoordinatorV2Mock} from "../lib/chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";
import {TrustlessCards} from "../src/TrustlessCards.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployContracts is Script {
    function run() external {
        bytes32 _salt = bytes32(abi.encode(1596));
        vm.startBroadcast();
        VRFCoordinatorV2Mock vrf = new VRFCoordinatorV2Mock{salt: _salt}(100000000000000000,1000000000);
        vrf.createSubscription();
        vrf.fundSubscription(1, 1000000000000000000);
        console.log(
            "VRFCoordinatorV2Mock address:",
            address(vrf),
            "at network:",
            block.chainid
        );
    }
}
