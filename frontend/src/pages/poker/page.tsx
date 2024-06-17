import React, { Component } from "react";
import "./App.css";
import "./Poker.css";

import { Link } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import { Button } from "../../components/ui/button";

import Spinner from "./Spinner";
import WinScreen from "./WinScreen";

import Player from "../../components/players/player";
import ShowdownPlayer from "../../components/players/showdownPlayer";
import PokerCard from "../../components/cards/card";

import {
  generateDeckOfCards,
  dealPrivateCards,
  inputCards,
} from "../../utils/cards";

import { generateTable, beginNextRound, checkWin } from "../../utils/players";

import {
  determineBlindIndices,
  anteUpBlinds,
  determineMinBet,
  handleBet,
  handleFold,
} from "../../utils/bet";

import { handleAI as handleAIUtil } from "../../utils/ai";

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu,
} from "../../utils/ui";

import { cloneDeep } from "lodash";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

const GET_NOTICES = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

class Poker extends Component {
  state = {
    loading: true,
    winnerFound: null,
    players: null,
    numPlayersActive: null,
    numPlayersFolded: null,
    numPlayersAllIn: null,
    activePlayerIndex: 0,
    dealerIndex: null,
    blindIndex: null,
    deck: [],
    communityCards: [],
    pot: 0,
    highBet: null, // Convert the string to an array of numbers
    betInputValue: null,
    sidePots: [],
    minBet: 20,
    phase: "loading",
    playerHierarchy: [],
    showDownMessages: [],
    playActionMessages: [],
    playerAnimationSwitchboard: {
      0: { isAnimating: false, content: null },
      1: { isAnimating: false, content: null },
      2: { isAnimating: false, content: null },
      3: { isAnimating: false, content: null },
      4: { isAnimating: false, content: null },
      5: { isAnimating: false, content: null },
    },
    noticeValue: "",
  };

  cardAnimationDelay = 0;

  loadTable = () => {};

  async componentDidMount() {
    const players = await generateTable();
    const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
    const blindIndicies = determineBlindIndices(dealerIndex, players.length);
    const playersBoughtIn = anteUpBlinds(
      players,
      blindIndicies,
      this.state.minBet
    );

    const deck = await this.fetchNotices();
    if (!Array.isArray(deck)) {
      throw new Error("Deck is not an array");
    }

    const imageLoaderRequest = new XMLHttpRequest();

    imageLoaderRequest.addEventListener("load", (e) => {
      console.log(`${e.type}`);
      console.log(e);
      console.log("Image Loaded!");
      this.setState({
        loading: false,
      });
    });

    imageLoaderRequest.addEventListener("error", (e) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("loadstart", (e) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("loadend", (e) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("abort", (e) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("progress", (e) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
    imageLoaderRequest.send();

    this.setState((prevState) => ({
      // loading: false,
      players: playersBoughtIn,
      numPlayersActive: players.length,
      numPlayersFolded: 0,
      numPlayersAllIn: 0,
      activePlayerIndex: dealerIndex,
      dealerIndex,
      blindIndex: {
        big: blindIndicies.bigBlindIndex,
        small: blindIndicies.smallBlindIndex,
      },
      deck: inputCards(generateDeckOfCards()),
      pot: 0,
      highBet: prevState.minBet,
      betInputValue: prevState.minBet,
      phase: "initialDeal",
    }));
    this.runGameLoop();
  }

  fetchNotices = async () => {
    try {
      const { data } = await client.query({
        query: GET_NOTICES,
      });
      console.log("Notices fetched:", data.notices.edges);
      const payloadHex = data.notices.edges[0].node.payload;
      const noticeValues = this.hexToDeck(payloadHex);
      console.log("shuffled deck by cartesi:", noticeValues);
      const deck = inputCards(generateDeckOfCards());
      return deck;
    } catch (e) {
      console.error("Failed to fetch notices:", e);
    }
  };

  hexToDeck = (hex) => {
    let deck = [];
    for (let i = 0; i < hex.length; i += 2) {
      deck.push(parseInt(hex.substr(i, 2), 16));
    }
    return deck;
  };

  handleBetInputChange = (val, min, max) => {
    if (val === "") val = min;
    if (val > max) val = max;
    this.setState({
      betInputValue: parseInt(val, 10),
    });
  };

  changeSliderInput = (val) => {
    this.setState({
      betInputValue: val[0],
    });
  };

  pushAnimationState = (index, content) => {
    const newAnimationSwitchboard = Object.assign(
      {},
      this.state.playerAnimationSwitchboard,
      { [index]: { isAnimating: true, content } }
    );
    this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
  };

  popAnimationState = (index) => {
    const persistContent = this.state.playerAnimationSwitchboard[index].content;
    const newAnimationSwitchboard = Object.assign(
      {},
      this.state.playerAnimationSwitchboard,
      { [index]: { isAnimating: false, content: persistContent } }
    );
    this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
  };

  handleBetInputSubmit = (bet, min, max) => {
    const { playerAnimationSwitchboard, ...appState } = this.state;
    const { activePlayerIndex } = appState;
    this.pushAnimationState(
      activePlayerIndex,
      `${renderActionButtonText(
        this.state.highBet,
        this.state.betInputValue,
        this.state.players[this.state.activePlayerIndex]
      )} ${
        bet > this.state.players[this.state.activePlayerIndex].bet ? bet : ""
      }`
    );
    const newState = handleBet(
      cloneDeep(appState),
      parseInt(bet, 10),
      parseInt(min, 10),
      parseInt(max, 10)
    );
    this.setState(newState, () => {
      if (
        this.state.players[this.state.activePlayerIndex].robot &&
        this.state.phase !== "showdown"
      ) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  };

  handleFold = () => {
    const { playerAnimationSwitchboard, ...appState } = this.state;
    const newState = handleFold(cloneDeep(appState));
    this.setState(newState, () => {
      if (
        this.state.players[this.state.activePlayerIndex].robot &&
        this.state.phase !== "showdown"
      ) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  };

  handleAI = () => {
    const { playerAnimationSwitchboard, ...appState } = this.state;
    const newState = handleAIUtil(cloneDeep(appState), this.pushAnimationState);

    this.setState(
      {
        ...newState,
        betInputValue: newState.minBet,
      },
      () => {
        if (
          this.state.players[this.state.activePlayerIndex].robot &&
          this.state.phase !== "showdown"
        ) {
          setTimeout(() => {
            this.handleAI();
          }, 1200);
        }
      }
    );
  };

  renderBoard = () => {
    const {
      players,
      activePlayerIndex,
      dealerIndex,
      clearCards,
      phase,
      playerAnimationSwitchboard,
    } = this.state;
    // Reverse Players Array for the sake of taking turns counter-clockwise.
    const reversedPlayers = players.reduce((result, player, index) => {
      const isActive = index === activePlayerIndex;
      const hasDealerChip = index === dealerIndex;

      result.unshift(
        <Player
          key={index}
          arrayIndex={index}
          isActive={isActive}
          hasDealerChip={hasDealerChip}
          player={player}
          clearCards={clearCards}
          phase={phase}
          playerAnimationSwitchboard={playerAnimationSwitchboard}
          endTransition={this.popAnimationState}
        />
      );
      return result;
    }, []);
    return reversedPlayers.map((component) => component);
  };

  renderCommunityCards = (purgeAnimation) => {
    return this.state.communityCards.map((card, index) => {
      let cardData = { ...card };
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return <PokerCard key={index} cardData={cardData} />;
    });
  };

  runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(this.state));
    this.setState(newState, () => {
      if (
        this.state.players[this.state.activePlayerIndex].robot &&
        this.state.phase !== "showdown"
      ) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  };

  renderRankTie = (rankSnapshot) => {
    return rankSnapshot.map((player) => {
      return this.renderRankWinner(player);
    });
  };

  renderRankWinner = (player) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = this.state.players.find(
      (statePlayer) => statePlayer.name === name
    );
    return (
      <div className="showdown-player--entity" key={name}>
        <ShowdownPlayer
          name={name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips}
          roundStartChips={playerStateData.roundStartChips}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">Best Hand</h5>
          <div
            className="showdown-player--besthand--cards"
            style={{ alignItems: "center" }}
          >
            {bestHand.map((card, index) => {
              // Reset Animation Delay
              const cardData = { ...card, animationDelay: 0 };
              return <PokerCard key={index} cardData={cardData} />;
            })}
          </div>
        </div>
        <div className="showdown--handrank">{handRank}</div>
        {renderNetPlayerEarnings(
          playerStateData.roundEndChips,
          playerStateData.roundStartChips
        )}
      </div>
    );
  };

  renderBestHands = () => {
    const { playerHierarchy } = this.state;

    return playerHierarchy.map((rankSnapshot) => {
      const tie = Array.isArray(rankSnapshot);
      return tie
        ? this.renderRankTie(rankSnapshot)
        : this.renderRankWinner(rankSnapshot);
    });
  };

  handleNextRound = () => {
    const newState = beginNextRound(cloneDeep(this.state));

    // Verifique a condição de vitória
    if (checkWin(newState.players)) {
      this.setState({ winnerFound: true });
      return;
    }

    // Atualize o estado e continue o jogo
    this.setState(newState, () => {
      if (
        this.state.players[this.state.activePlayerIndex].robot &&
        this.state.phase !== "showdown"
      ) {
        setTimeout(() => this.handleAI(), 1200);
      }
    });
  };

  renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } =
      this.state;
    const min = determineMinBet(
      highBet,
      players[activePlayerIndex].chips,
      players[activePlayerIndex].bet
    );
    const max =
      players[activePlayerIndex].chips + players[activePlayerIndex].bet;
    return players[activePlayerIndex].robot || phase === "showdown" ? null : (
      <React.Fragment>
        <Button
          className="text-xl border border-gold bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-white"
          size="lg"
          onClick={() => this.handleBetInputSubmit(betInputValue, min, max)}
        >
          {renderActionButtonText(
            highBet,
            betInputValue,
            players[activePlayerIndex]
          )}
        </Button>
        <Button
          size="lg"
          className="text-xl border border-red-400 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-white"
          onClick={() => this.handleFold()}
        >
          Fold
        </Button>
      </React.Fragment>
    );
  };

  renderShowdown = () => {
    return (
      <div className="showdown-container--wrapper">
        <h5 className="showdown-container--title">Round Complete!</h5>
        <div className="showdown-container--messages">
          {renderShowdownMessages(this.state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className="showdown-container--community-cards">
          {this.renderCommunityCards(true)}
        </div>
        <button
          className="showdown--nextRound--button"
          onClick={() => this.handleNextRound()}
        >
          {" "}
          Next Round{" "}
        </button>
        {this.renderBestHands()}
      </div>
    );
  };

  renderGame = () => {
    const { highBet, players, activePlayerIndex, phase, winnerFound } =
      this.state;
    return (
      <div className="poker-app--background">
        <div className="poker-table--container">
          <img
            className="poker-table--table-image"
            src={"./assets/table-nobg-svg-01.svg"}
            alt="Poker Table"
          />
          {this.renderBoard()}
          <div className="community-card-container">
            {this.renderCommunityCards(false)}
          </div>
        </div>
        {this.state.phase === "showdown" && this.renderShowdown()}
        <div className="game-action-bar">
          <div className="flex gap-7">{this.renderActionButtons()}</div>
          <div className="slider-boi">
            {!this.state.loading &&
              renderActionMenu(
                highBet,
                players,
                activePlayerIndex,
                phase,
                this.handleBetInputChange
              )}
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { betInputValue, players, activePlayerIndex } = this.state;
    const activePlayer = players ? players[activePlayerIndex] : null;

    return (
      <div className="App">
        <div className="poker-table--wrapper">
          <header className="flex p-10 justify-between text-xl max-w-screen-xl mx-auto items-center">
            <img
              className="h-20 w-20 left-0"
              src="/assets/logo.png"
              alt="logo"
              height={50}
            />
            <Card className="bg-zinc-950 flex flex-row">
              <CardHeader>
                <CardTitle className="text-gold bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Pot
                </CardTitle>
                <CardDescription>
                  <h4 className="text-zinc-300 text-xl">
                    $ {`${this.state.pot}`}
                  </h4>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-zinc-950 flex flex-row">
              <CardHeader>
                <CardTitle className="text-gold bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Bet
                </CardTitle>
                <CardDescription>
                  <h4 className="text-zinc-300 text-xl">$ {betInputValue}</h4>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-950 flex flex-row">
              <CardHeader>
                <CardTitle className="text-gold bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Chips
                </CardTitle>
                <CardDescription>
                  <h4 className="text-zinc-300 text-xl">
                    $ {activePlayer ? activePlayer.chips : "Loading..."}
                  </h4>
                </CardDescription>
              </CardHeader>
            </Card>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="border border-zinc-200 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-white">
                  Quit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-950 border border-zinc-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-50">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    If you quit, you will leave with the current money in your
                    hand
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border border-zinc-200 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                    className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950"
                  >
                    <Link to="/"> Continue</Link>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </header>
          {this.state.loading ? (
            <Spinner />
          ) : this.state.winnerFound ? (
            <WinScreen />
          ) : (
            this.renderGame()
          )}
        </div>
      </div>
    );
  }
}

export default Poker;

