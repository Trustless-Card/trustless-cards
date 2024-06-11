import React from "react";
import logo from "../../logo.svg"; // Certifique-se de que os ativos estáticos estão corretamente configurados
import { Button } from "../ui/button";
import { useHistory, useLocation } from "react-router-dom";
import useWallet from "../../hooks/useWallet";

export default function Header() {
  const { walletAddress, walletBalance, isConnected, connectWallet } =
    useWallet();

  const history = useHistory();
  const location = useLocation();

  const scrollToSection = (id) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  return (
    <div className="flex p-10 justify-between text-xl max-w-screen-xl mx-auto">
      <a href="/">
        <img
          className="h-20 w-20"
          src={logo}
          alt="logo"
          height={50}
          style={{ cursor: "pointer" }}
        />
      </a>
      <div className="gap-5 hidden md:flex font-medium m-auto">
        <a
          href="/"
          className={`transition hover:text-white hover:cursor-pointer ${
            location.pathname === "/" ? "text-white" : "text-zinc-600"
          }`}
        >
          Home
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("about");
          }}
          className="transition hover:text-white hover:cursor-pointer text-zinc-600"
        >
          About
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("about");
          }}
          className="transition hover:text-white hover:cursor-pointer text-zinc-600"
        >
          Games
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("support");
          }}
          className="transition hover:text-white hover:cursor-pointer text-zinc-600"
        >
          Contact
        </a>
      </div>
      <div className="my-auto">
        <Button
          className="hover:scale-105 transition"
          onClick={connectWallet}
          disabled={isConnected}
        >
          {isConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}
