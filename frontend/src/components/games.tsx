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
import { GiCardJoker } from "react-icons/gi";
import { TbClover } from "react-icons/tb";
import { useRollups } from "../useRollups";
import useRandomWordFromContract from "../components/contract/RandomWords";
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

export default function Games() {
  const dappAddress = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e";
  const rollups = useRollups(dappAddress);
  const fetchRandomWordFromContract = useRandomWordFromContract();
  const [{ wallet }] = useConnectWallet();
  const { toast } = useToast();

  const addInput = async () => {
    try {
      const randomWord = await fetchRandomWordFromContract();
      const mockJson = JSON.stringify({
        method: "shambles",
        from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        amount: randomWord,
      });

      if (rollups) {
        let payload = ethers.utils.toUtf8Bytes(mockJson);
        payload = ethers.utils.arrayify(mockJson);
        await rollups.inputContract.addInput(dappAddress, payload);
        console.log("Input adicionado:", mockJson);
      }
    } catch (e) {
      console.log(`${e}`);
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
        ].map((game, index) =>
          wallet ? (
            <Link
              to={game.link}
              key={index}
              className="w-[95%] md:w-[30%] mb-8 relative group"
              onClick={addInput}
            >
              <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg"></div>
              <Card className="bg-zinc-950 dark:bg-white border-gold h-[350px] relative z-10">
                <CardHeader className="text-center ">
                  <div className="flex flex-col justify-center items-center gap-4">
                    {" "}
                    <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                      {game.icon}
                    </div>
                    <CardTitle className="text-white pb-3">
                      {" "}
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
              </Card>
            </Link>
          ) : (
            <Link
              key={index}
              className="w-[95%] md:w-[30%] mb-8 relative group"
              onClick={() => alert("Please connect to your wallet")}
            >
              <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg"></div>
              <Card className="bg-zinc-950 dark:bg-white border-gold h-[350px] relative z-10">
                <CardHeader className="text-center ">
                  <div className="flex flex-col justify-center items-center gap-4">
                    {" "}
                    <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                      {game.icon}
                    </div>
                    <CardTitle className="text-white pb-3">
                      {" "}
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
              </Card>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
