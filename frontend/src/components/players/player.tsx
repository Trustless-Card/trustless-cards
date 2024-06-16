import Card from "../cards/card";
import HiddenCard from "../cards/hiddenCard";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import PlayerStatusNotificationBox from "./playerStatusNotificationBox";

const dealerChipImageURL = "/assets/chip.svg";

const Player = (props) => {
  const {
    arrayIndex,
    playerAnimationSwitchboard,
    endTransition,
    hasDealerChip,
    isActive,
    phase,
    clearCards,
    player: { robot, folded, cards, avatarURL, name, chips, bet },
  } = props;

  const renderDealerChip = () => {
    if (hasDealerChip) {
      return (
        <div className="dealer-chip-icon-container">
          <img src={dealerChipImageURL} alt="Dealer Chip" />
        </div>
      );
    } else return null;
  };

  const renderPlayerCards = () => {
    let applyFoldedClassname;

    if (folded || clearCards) {
      applyFoldedClassname = true;
    }

    if (robot) {
      return cards.map((card, index) => {
        if (phase !== "showdown") {
          return (
            <HiddenCard
              key={index}
              cardData={card}
              applyFoldedClassname={applyFoldedClassname}
            />
          );
        } else {
          // Reset Animation Delay
          const cardData = { ...card, animationDelay: 0 };
          return (
            <Card
              key={index}
              cardData={cardData}
              applyFoldedClassname={applyFoldedClassname}
            />
          );
        }
      });
    } else {
      return cards.map((card, index) => {
        return (
          <Card
            key={index}
            cardData={card}
            applyFoldedClassname={applyFoldedClassname}
          />
        );
      });
    }
  };

  const ifAnimating = (playerBoxIndex) => {
    if (playerAnimationSwitchboard[playerBoxIndex].isAnimating) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={`player-entity--wrapper p${arrayIndex}`}>
      <PlayerStatusNotificationBox
        index={arrayIndex}
        isActive={ifAnimating(arrayIndex)}
        content={playerAnimationSwitchboard[arrayIndex].content}
        endTransition={endTransition}
      />
      <div className="centered-flex-row abscard">{renderPlayerCards()}</div>
      <HoverCard>
        <HoverCardTrigger>
          <div className="player-avatar--container">
            <Avatar
              className={`player-avatar--image w-20 h-20${isActive ? " activePlayer" : ""}`}
            >
              <AvatarImage src={avatarURL}/>
              <AvatarFallback>sexo</AvatarFallback>
            </Avatar>
            <Badge>{`${name}`}</Badge>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="bg-zinc-950 text-zinc-50 border-zinc-600">
          <div>
            <strong>Chips:</strong> {chips}
          </div>
          <div>
            <strong>Bet:</strong> {bet}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Player;
