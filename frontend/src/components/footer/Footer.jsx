import React, { Component } from "react";
import logo from "../../logo.svg";
import { Image } from "lucide-react";
import { Link } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
      <footer className="bg-neutral-800 shadow-inner">
        <div className="pt-10 flex justify-center">
          <Image src={logo} alt="logo" height={50} />
        </div>
        <div className="text-center text-lg text-neutral-400 pb-4 w-full">
          <p>Made in 🇧🇷</p>
        </div>
        <div className="flex justify-center py-4 gap-4">
          <Link href="https://github.com/Trustless-Card">
            <FaGithub 
            strokeWidth={1.5}
            fill="#777" color="#777" size={50}
            className="bg-neutral-900 rounded-full p-3" />
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <p className="mx-auto text-xs md:text-base text-neuFootertral-500 p-2">
            Copyright @ 2024 TrustlessCards
          </p>
        </div>
      </footer>
    );
  }
