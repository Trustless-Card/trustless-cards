import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card"; 
import GoldCard from "./goldCard";
import MetaMask from "./metamask";

export default function AboutHero() {
  return (
    <>
      <div className="flex flex-col space-y-4">
        <h2 className="text-center text-4xl font-semibold text-neutral-200">
          ♦ What is Trustless Cards?
        </h2>
        <div className="flex space-x-2 justify-center">
          <Card className="flex bg-zinc-950 dark:bg-white text-white scale-75 w-[50%] hover:shadow-gold shadow-md transition duration-500 border-gold">
            <div className="flex-1 p-4">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Trustless Game
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-lg text-neutral-300">
                Trustless Cards is an online casino that fully utilizes
                blockchain technology to ensure fairness and transparency.
                <br />
                <br />
                <strong>
                  Here, every shuffle and spin is verifiably random, offering
                  you a true opportunity to win.
                </strong>
              </CardContent>
            </div>
            <div className="m-10">
              <GoldCard className="flex-1" />
            </div>
          </Card>
          <Card className="flex bg-zinc-950 dark:bg-white text-white scale-75 w-[50%] hover:shadow-gold shadow-md transition duration-500 border-gold">
            <div className="flex-1 p-4">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Seamless Crypto Wallet Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-lg text-neutral-300">
                Our platform allows players to effortlessly connect their
                existing crypto wallets, enabling direct participation in games.
                This integration ensures a user-friendly experience, providing
                smooth and secure financial transactions.
              </CardContent>
            </div>
            <div className="flex items-center justify-center m-10 pr-4">
              <MetaMask></MetaMask>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
