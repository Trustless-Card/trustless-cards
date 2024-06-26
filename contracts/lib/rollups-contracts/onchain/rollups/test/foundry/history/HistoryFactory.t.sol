// (c) Cartesi and individual authors (see AUTHORS)
// SPDX-License-Identifier: Apache-2.0 (see LICENSE)

/// @title History Factory Test
pragma solidity ^0.8.8;

import {Test} from "forge-std/Test.sol";
import {HistoryFactory} from "contracts/history/HistoryFactory.sol";
import {History} from "contracts/history/History.sol";
import {Vm} from "forge-std/Vm.sol";

contract HistoryFactoryTest is Test {
    HistoryFactory factory;

    event HistoryCreated(address historyOwner, History history);

    struct HistoryCreatedEventData {
        address historyOwner;
        History history;
    }

    function setUp() public {
        factory = new HistoryFactory();
    }

    function testNewHistory(address _historyOwner) public {
        vm.assume(_historyOwner != address(0));

        vm.recordLogs();

        History history = factory.newHistory(_historyOwner);

        testNewHistoryAux(_historyOwner, history);
    }

    function testNewHistoryAux(
        address _historyOwner,
        History _history
    ) internal {
        Vm.Log[] memory entries = vm.getRecordedLogs();

        uint256 numOfHistoryCreated;

        for (uint256 i; i < entries.length; ++i) {
            Vm.Log memory entry = entries[i];

            if (
                entry.emitter == address(factory) &&
                entry.topics[0] == HistoryCreated.selector
            ) {
                ++numOfHistoryCreated;

                HistoryCreatedEventData memory eventData;

                eventData = abi.decode(entry.data, (HistoryCreatedEventData));

                assertEq(_historyOwner, eventData.historyOwner);
                assertEq(address(_history), address(eventData.history));
            }
        }

        assertEq(numOfHistoryCreated, 1);

        // call to check history's owner
        assertEq(_history.owner(), _historyOwner);
    }

    function testNewHistoryDeterministic(
        address _historyOwner,
        bytes32 _salt
    ) public {
        vm.assume(_historyOwner != address(0));

        address precalculatedAddress = factory.calculateHistoryAddress(
            _historyOwner,
            _salt
        );

        vm.recordLogs();

        History history = factory.newHistory(_historyOwner, _salt);

        testNewHistoryAux(_historyOwner, history);

        // Precalculated address must match actual address
        assertEq(precalculatedAddress, address(history));

        precalculatedAddress = factory.calculateHistoryAddress(
            _historyOwner,
            _salt
        );

        // Precalculated address must STILL match actual address
        assertEq(precalculatedAddress, address(history));

        // Cannot deploy a history with the same salt twice
        vm.expectRevert();
        factory.newHistory(_historyOwner, _salt);
    }
}
