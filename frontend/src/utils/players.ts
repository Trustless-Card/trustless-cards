import uuid from "uuid/v1";
import {
  handlePhaseShift,
  reconcilePot,
  anteUpBlinds,
  determineBlindIndices,
} from "./bet";
import {
  dealMissingCommunityCards,
  showDown,
  generateDeckOfCards,
  shuffle,
  dealPrivateCards,
} from "./cards";

// Function to generate the table and initialize players
const generateTable = async (): Promise<any> => {
  const avatarURLs = [
    "/assets/avatar2.jpeg",
    "/assets/avatar1.jpeg",
    "/assets/avatar3.jpeg",
    "/assets/avatar4.jpeg",
    "/assets/avatar5.jpeg",
  ];

  const bots = ["c0utin", "noyma.eth", "joaosotto", "misterclayt0n"];
  const users = [
    {
      id: uuid(),
      name: "cartesi",
      avatarURL: avatarURLs[0],
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      chips: 20000,
      roundStartChips: 20000,
      roundEndChips: 20000,
      currentRoundChipsInvested: 0,
      bet: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
      canRaise: true,
      stackInvestment: 0,
      robot: false,
    },
  ];

  for (let i = 1; i < 5; i++) {
    users.push({
      id: uuid(),
      name: bots[i - 1],
      avatarURL: avatarURLs[i],
      cards: [],
      chips: Math.floor(Math.random() * (20000 - 18000)) + 18000,
      roundStartChips: 20000,
      roundEndChips: 20000,
      currentRoundChipsInvested: 0,
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      bet: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
      robot: true,
      canRaise: true,
      stackInvestment: 0,
    });
  }

  return users;
};

const generatePersonality = (seed: any) => {
  switch (seed) {
    case seed > 0.5:
      return "standard";
    case seed > 0.35:
      return "aggressive";
    case seed > 0:
    default:
      return "conservative";
  }
};

const handleOverflowIndex = (
  currentIndex,
  incrementBy,
  arrayLength,
  direction,
) => {
  switch (direction) {
    case "up": {
      return (currentIndex + incrementBy) % arrayLength;
    }
    case "down": {
      return ((currentIndex - incrementBy) % arrayLength) + arrayLength;
    }
    default:
      throw Error("Attempted to overfow index on unfamiliar direction");
  }
};

const determinePhaseStartActivePlayer = (state, recursion = false) => {
  if (!recursion) {
    state.activePlayerIndex = handleOverflowIndex(
      state.blindIndex.big,
      1,
      state.players.length,
      "up",
    );
  } else if (recursion) {
    state.activePlayerIndex = handleOverflowIndex(
      state.activePlayerIndex,
      1,
      state.players.length,
      "up",
    );
  }
  if (state.players[state.activePlayerIndex].folded) {
    return determinePhaseStartActivePlayer(state, true);
  }
  if (state.players[state.activePlayerIndex].chips === 0) {
    return determinePhaseStartActivePlayer(state, true);
  }
  return state;
};

// This function can lead to errors if player all ins at a certain position
// final AI will freeze
// seems to happen when only 2 players left and someone has all-in

const determineNextActivePlayer = (state) => {
  state.activePlayerIndex = handleOverflowIndex(
    state.activePlayerIndex,
    1,
    state.players.length,
    "up",
  );
  const activePlayer = state.players[state.activePlayerIndex];

  const allButOnePlayersAreAllIn =
    state.numPlayersActive - state.numPlayersAllIn === 1;
  if (state.numPlayersActive === 1) {
    console.log("Only one player active, skipping to showdown.");
    return showDown(reconcilePot(dealMissingCommunityCards(state)));
  }
  if (activePlayer.folded) {
    console.log("Current player index is folded, going to next active player.");
    return determineNextActivePlayer(state);
  }

  if (
    allButOnePlayersAreAllIn &&
    !activePlayer.folded &&
    activePlayer.betReconciled
  ) {
    return showDown(reconcilePot(dealMissingCommunityCards(state)));
  }

  if (activePlayer.chips === 0) {
    if (state.numPlayersAllIn === state.numPlayersActive) {
      console.log("All players are all in.");
      return showDown(reconcilePot(dealMissingCommunityCards(state)));
    } else if (allButOnePlayersAreAllIn && activePlayer.allIn) {
      return showDown(reconcilePot(dealMissingCommunityCards(state)));
    } else {
      return determineNextActivePlayer(state);
    }
  }

  // IF a player is all in, he will be reconciled?
  if (activePlayer.betReconciled) {
    console.log(
      "Player is reconciled with pot, round betting cycle complete, proceed to next round.",
    );
    return handlePhaseShift(state);
  }

  return state;
};

const passDealerChip = (state) => {
  // This is messy because we are determining active player, dealer, and blinds based on an arbitrary index, not with flags on player entries.
  // When we remove all players who have ran out of chips, the new indices will not match up cleanly. We need to find the index of the player, keep track of who it is or
  state.dealerIndex = handleOverflowIndex(
    state.dealerIndex,
    1,
    state.players.length,
    "up",
  );
  const nextDealer = state.players[state.dealerIndex];
  if (nextDealer.chips === 0) {
    return passDealerChip(state);
  }

  return filterBrokePlayers(state, nextDealer.name);
};

/* !!!!
 Action is initiated on the first betting round by the first player to the left of the blinds. On all subsequent betting rounds, the action begins with the first active player to the left of the button.
 */
const filterBrokePlayers = (state, dealerID) => {
  state.players = state.players.filter((player) => player.chips > 0);
  const newDealerIndex = state.players.findIndex(
    (player) => player.name === dealerID,
  );
  state.dealerIndex = newDealerIndex;
  state.activePlayerIndex = newDealerIndex; // This is incorrect, action should proceed to the left of the blinds -- if there are only 2 people...will it be the small blind? If there are 3, is it the dealer? Action is initiated on the first betting round by the first player to the left of the blinds. On all subsequent betting rounds, the action begins with the first active player to the left of the button.)))) This means THIS FUNCTION WILL CHANGE depending on the ACTIVE PHASE....
  if (state.players.length === 1) {
    // Victory!
    return state;
  } else if (state.players.length === 2) {
    // Need to refine rules for who goes first when 2 players are left
    // Can move this logic to our determineBlindIndices fn
    state.blindIndex.small = newDealerIndex;
    state.blindIndex.big = handleOverflowIndex(
      newDealerIndex,
      1,
      state.players.length,
      "up",
    );
    state.players = anteUpBlinds(
      state.players,
      {
        bigBlindIndex: state.blindIndex.big,
        smallBlindIndex: state.blindIndex.small,
      },
      state.minBet,
    ).map((player) => ({
      ...player,
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      roundStartChips: player.chips + player.bet,
      currentRoundChipsInvested: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
    }));
    state.numPlayersAllIn = 0;
    state.numPlayersFolded = 0;
    state.numPlayersActive = state.players.length;
  } else {
    const blindIndicies = determineBlindIndices(
      newDealerIndex,
      state.players.length,
    );
    state.blindIndex = {
      big: blindIndicies.bigBlindIndex,
      small: blindIndicies.smallBlindIndex,
    };
    state.players = anteUpBlinds(
      state.players,
      blindIndicies,
      state.minBet,
    ).map((player) => ({
      ...player,
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      roundStartChips: player.chips + player.bet,
      currentRoundChipsInvested: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
    }));
    state.numPlayersAllIn = 0; // May need to alter this is big/small blind brings a player all in
    state.numPlayersFolded = 0;
    state.numPlayersActive = state.players.length;
  }
  return dealPrivateCards(state);
};

const beginNextRound = (state) => {
  state.communityCards = [];
  state.sidePots = [];
  state.playerHierarchy = [];
  state.showDownMessages = [];
  state.deck = shuffle(generateDeckOfCards());
  state.highBet = 20;
  state.betInputValue = 20;
  state.minBet = 20; // Valor inicial da aposta mínima

  // Reiniciar os jogadores para a nova rodada
  state.players = state.players.map((player) => ({
    ...player,
    cards: [],
    showDownHand: {
      hand: [],
      descendingSortHand: [],
    },
    roundStartChips: player.chips,
    currentRoundChipsInvested: 0,
    betReconciled: false,
    folded: false,
    allIn: false,
  }));

  return passDealerChip(state);
};


const checkWin = (players) => {
  return players.filter((player) => player.chips > 0).length === 1;
};

export {
  generateTable,
  handleOverflowIndex,
  determineNextActivePlayer,
  determinePhaseStartActivePlayer,
  beginNextRound,
  checkWin,
};
