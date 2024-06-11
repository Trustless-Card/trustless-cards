import React, { useState } from "react";
import { Image } from "lucide-react";
import { Button } from "../ui/button"; // Assuma que este é um componente customizado
import { ChevronDown, ChevronRight, PlayIcon, Sparkles } from "lucide-react"; // Ícones

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
            Fair Play, Real Wins with <br />{" "}
            <span className="font-bold text-white shadow-white drop-shadow-lg">
              Cartesi Rollups<span className="text-green-500">.</span>
            </span>
          </h1>
          <p className="lg:text-xl leading-relaxed text-neutral-300 mt-4 p-10 max-w-screen-lg mx-auto">
            Trustless Cards transforms the online card gaming industry with a
            cutting-edge, decentralized platform, ensuring unparalleled
            transparency and fairness with every shuffle.
            <span className="font-semibold">
                Powered by Blockchain technology, and enhanced with direct
              crypto wallet integrations for secure and immediate transactions
            </span>
          </p>
          <div className="flex flex-wrap justify-center mb-20 md:mb-0 mx-4 gap-10">
            <Button onClick={() => scrollToSection("map")}>
              PLAY
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <ChevronDown
          className="mx-auto hidden md:block p-2 md:p-0 md:mt-10 "
          color="#ccc"
          size={70}
          strokeWidth={1}
        />
      </div>
    </div>
  );
}
