import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CgCardSpades } from "react-icons/cg";
import { Button } from "../components/ui/button";
import { GiCardJoker } from "react-icons/gi";
import { TbClover } from "react-icons/tb";
import { useRollups } from "../hooks/useRollups";
import { ethers } from "ethers";
import { useWallets, useSetChain } from "@web3-onboard/react";

export default function Games() {
  const [resultsArray, setResultsArray] = useState<any>([]);
  const rollups = useRollups("0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C");
  const [wallets] = useWallets();
  const connectedWallet = wallets ? wallets : null;

  useEffect(() => {
    if (!connectedWallet) {
      console.log("No wallet connected");
    } else {
      console.log("Wallet connected: ", connectedWallet);
    }
  }, [connectedWallet]);

  // Similar for chains
  const setChain = useSetChain();

  useEffect(() => {
    if (connectedWallet) {
      setChain({ chainId: "0x1" }).then((result) => {
        if (!result.error) {
          console.log("Chain set successfully");
        } else {
          console.log("Failed to set chain");
        }
      });
    }
  }, [connectedWallet]);

  const addInput = async () => {
    const payloadObj = {
      method: "shambles",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      amount: "0",
    };
    const payloadStr = JSON.stringify(payloadObj);
    console.log("Payload to send:", payloadStr);

    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(payloadStr);
        await rollups.inputContract.addInput(
          "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e",
          payload
        );
        console.log("Input sent successfully");
        setResultsArray(["resposta1", "resposta2", "resposta3"]);
      } catch (e) {
        console.error("Erro ao enviar input:", e);
      }
    } else {
      console.log("Rollups contract not connected or input is empty.");
    }
  };

  return (
    <div className="text-center max-w-screen-xl mx-auto mb-10" id="games">
      <h2 className="text-3xl lg:text-4xl text-neutral-200 font-semibold drop-shadow-xl shadow-white p-10 md:pt-4 px-2">
        ♠️ Popular Casino Games
      </h2>
      <div className="flex gap-4 md:gap-14 flex-wrap mt-8 justify-center md:mt-10 mx-10 md:mx-0">
        {[
          {
            title: "Poker",
            description:
              "Master the art of bluffing in the most strategic card game ever. Poker combines psychology, probability, and luck to create an unforgettable experience.",
            icon: <CgCardSpades strokeWidth={1.5} size={40} color="white" />,
            footer: "",
            link: "/poker",
          },
          {
            title: "Blackjack",
            description:
              "Blackjack, also known as 21, is a fast-paced game where the goal is to beat the dealer by getting a score as close to 21 as possible without going over.",
            content:
              "Perfect for all skill levels, from beginners to seasoned pros.",
            icon: <GiCardJoker strokeWidth={1.5} size={40} color="white" />,
            footer: "",
            link: "/blackjack",
          },
          {
            title: "Roulette",
            description:
              "Roulette offers a blend of sophistication and simplicity with a spinning wheel that determines the fate of your bets. A true game of chance that keeps everyone on their toes.",
            content:
              "Place your bets on numbers, colors, or sets and watch the wheel spin.",
            icon: <TbClover strokeWidth={1.5} size={40} color="white" />,
            footer: "",
            link: "/roulette",
          },
        ].map((game, index) => (
          <Link
            to={game.link}
            key={index}
            className="w-[95%] md:w-[30%] mb-8 relative group"
          >
            <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg"></div>
            <Card className="bg-zinc-950 dark:bg-white border-gold h-[350px] relative z-10">
              <CardHeader className="text-center ">
                <div className="flex flex-col justify-center items-center gap-4">
                  {" "}
                  {/* Added 'items-center' */}
                  <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                    {game.icon}
                  </div>
                  <CardTitle className="text-white pb-3">
                    {" "}
                    {/* Added 'mt-[-2]' */}
                    {game.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-neutral-300">
                  {game.description}
                </CardDescription>
              </CardHeader>
              {game.content && (
                <CardContent>
                  <p>{game.content}</p>
                </CardContent>
              )}
              <CardFooter>
                <p>{game.footer}</p>
              </CardFooter>
              <Button
                variant="default"
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black transition duration-200 ease-in-out hover:scale-110 active:scale-100 hover:bg-black"
              >
                <p className="text-2xl bg-gradient-to-r from-[#9a5517] via-[#ffd98e] to-[#873a1a] bg-clip-text text-transparent">
                  Play
                </p>
              </Button>
            </Card>
          </Link>
        ))}
      </div>
      <button onClick={addInput} className="text-white">
        Send Payload
      </button>
      <div>
        {resultsArray.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}
