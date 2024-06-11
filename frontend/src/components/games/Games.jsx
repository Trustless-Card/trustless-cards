import React from "react";
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
    <div className="text-center max-w-screen-xl mx-auto mb-20">
      <h2 className="text-3xl lg:text-4xl text-neutral-200 font-semibold drop-shadow-xl shadow-white md:pt-4 px-2">
        Popular Casino Games
      </h2>
      <div className="flex gap-4 md:gap-14 flex-wrap mt-8 justify-center mx-10 md:mx-0">
        <div className="w-[95%] md:w-[30%] mb-8">
          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                <MdCasino strokeWidth={1.5} size={40} />
              </div>
              <CardTitle>Poker</CardTitle>
              <CardDescription>
                Master the art of bluffing in the most strategic card game ever.
                Poker combines psychology, probability, and luck to create an
                unforgettable experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Join thrilling tournaments or play casual rounds with friends.
              </p>
            </CardContent>
            <CardFooter>
              <p>Learn the rules and hand rankings</p>
            </CardFooter>
          </Card>
        </div>

        <div className="w-[95%] md:w-[30%] mb-8">
          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                <CgCardSpades strokeWidth={1.5} size={40} />
              </div>
              <CardTitle>Blackjack</CardTitle>
              <CardDescription>
                Blackjack, also known as 21, is a fast-paced game where the goal
                is to beat the dealer by getting a score as close to 21 as
                possible without going over.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Perfect for all skill levels, from beginners to seasoned pros.
              </p>
            </CardContent>
            <CardFooter>
              <p>Explore strategies to improve your game</p>
            </CardFooter>
          </Card>
        </div>

        <div className="w-[95%] md:w-[30%] mb-8">
          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                <GrMoney strokeWidth={1.5} size={40} />
              </div>
              <CardTitle>Roulette</CardTitle>
              <CardDescription>
                Roulette offers a blend of sophistication and simplicity with a
                spinning wheel that determines the fate of your bets. A true
                game of chance that keeps everyone on their toes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Place your bets on numbers, colors, or sets and watch the wheel
                spin.
              </p>
            </CardContent>
            <CardFooter>
              <p>Discover various betting systems</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
