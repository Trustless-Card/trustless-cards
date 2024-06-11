import React from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="h-fit md:mb-12 mb-8 pt-20 relative mx-auto max-w-screen-2xl">
      <div className="relative z-10">
        <div className="text-center pt-16">
          <h1 className="font-medium text-5xl lg:text-7xl text-neutral-400">
            Fair Play, Real{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Wins
            </span>{" "}
            with <br />{" "}
            <span className="font-bold text-white shadow-white drop-shadow-lg">
              Cartesi Rollups
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                .
              </span>
            </span>
          </h1>
          <p className="lg:text-xl leading-relaxed text-neutral-300 mt-4 p-10 max-w-screen-lg mx-auto">
            Trustless Cards transforms the online card gaming industry with a
            cutting-edge, decentralized platform, ensuring unparalleled
            transparency and fairness with every shuffle.
            <span className="font-semibold">
              Powered by Blockchain technology, and enhanced with direct crypto
              wallet integrations for secure and immediate transactions
            </span>
          </p>
        </div>
      </div>
      <div className="relative mt-32">
        <svg className="arrows">
          <path className="a1" d="M0 0 L30 32 L60 0"></path>
          <path className="a2" d="M0 20 L30 52 L60 20"></path>
          <path className="a3" d="M0 40 L30 72 L60 40"></path>
        </svg>
      </div>
    </div>
  );
}
