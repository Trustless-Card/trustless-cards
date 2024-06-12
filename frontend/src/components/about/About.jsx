import React from "react";
import { Card } from "../ui/card"; // Adjust the path as needed

export default function AboutHero() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center px-12 md:px-12 md:mt-10 w-[100%]">
        <p
          className="text-5xl font-semibold text-white md:px-10 p-0 m-0"
          id="about"
        >
          ♣️ What is Trustless Cards?
        </p>
        <div className="flex flex-row flex-start mb-20">
          <div className="flex flex-col items-center p-10 md:h-[80%] md:flex space-y-8">
            <div className="md:w-[100%] flex gap-10 items-center">
              <div className="">
                <div className="relative group">
                  <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-400 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg "></div>
                  <Card className="align-items rounded-lg text-card-foreground mb-6 bg-[#080908] border-2 border-gold md:p-6 p-4 flex flex-col items-center text-center relative z-10">
                    <div className="flex flex-col">
                      <p className="text-3xl text-white py-2 font-semibold">
                        Trustless Game
                      </p>
                      <p className="indent-4 text-slate-300">
                        Trustless Cards is an online casino that fully utilizes
                        blockchain technology to ensure fairness and
                        transparency.
                        <strong>
                          Here, every shuffle and spin is verifiably random,
                          offering you a true opportunity to win.
                        </strong>
                        Discover the thrill of truly fair gaming, where trust is
                        built into every game and your chances are only as good
                        as your strategy. Join us at Trustless Cards and
                        experience the integrity of a fully transparent gaming
                        platform.
                      </p>
                    </div>
                  </Card>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-400 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg"></div>
                  <Card className="align-items rounded-lg text-card-foreground mb-6 bg-[#080908] border-2 border-gold md:p-6 p-4 flex flex- text-center relative z-10">
                    <div className="flex flex-col">
                      <p className="text-3xl text-white py-2 font-semibold">
                        Seamless Crypto Wallet Integration
                      </p>
                      <p className="indent-4 text-slate-300">
                        Our platform allows players to effortlessly connect
                        their existing crypto wallets, enabling direct
                        participation in games. This integration ensures a
                        user-friendly experience, providing smooth and secure
                        financial transactions.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
