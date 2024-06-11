import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MdCasino } from "react-icons/md";
import { CgCardSpades } from "react-icons/cg";
import { GrMoney } from "react-icons/gr";

export default function Games() {
  return (
    <div className="text-center max-w-screen-xl mx-auto mb-20" id="games">
      <h2 className="text-3xl lg:text-4xl text-neutral-200 font-semibold drop-shadow-xl shadow-white md:pt-4 px-2">
        Popular Casino Games
      </h2>
      <div className="flex gap-4 md:gap-14 flex-wrap mt-8 justify-center mx-10 md:mx-0">
        {[
          {
            title: "Poker",
            description:
              "Master the art of bluffing in the most strategic card game ever. Poker combines psychology, probability, and luck to create an unforgettable experience.",
            icon: <MdCasino strokeWidth={1.5} size={40} color="white" />,
            footer: "Learn the rules and hand rankings",
            link: "/poker",
          },
          {
            title: "Blackjack",
            description:
              "Blackjack, also known as 21, is a fast-paced game where the goal is to beat the dealer by getting a score as close to 21 as possible without going over.",
            content:
              "Perfect for all skill levels, from beginners to seasoned pros.",
            icon: <CgCardSpades strokeWidth={1.5} size={40} color="white" />,
            footer: "Explore strategies to improve your game",
            link: "/blackjack",
          },
          {
            title: "Roulette",
            description:
              "Roulette offers a blend of sophistication and simplicity with a spinning wheel that determines the fate of your bets. A true game of chance that keeps everyone on their toes.",
            content:
              "Place your bets on numbers, colors, or sets and watch the wheel spin.",
            icon: <GrMoney strokeWidth={1.5} size={40} color="white" />,
            footer: "Discover various betting systems",
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
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                  {game.icon}
                </div>
                <CardTitle className="text-white">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
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
        ))}
      </div>
    </div>
  );
}