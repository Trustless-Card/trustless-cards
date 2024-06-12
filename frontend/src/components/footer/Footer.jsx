import React, { Component } from "react";
import logo from "../../assets/logo.png";
import { Image } from "lucide-react";
import { Link } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-950 to-indigo-900 bg-gradient-to-t from-indigo-950 to-black text-white">
      <div className="pt-10 flex justify-center mb-5">
        <img src={logo} alt="logo" className="h-20 w-20" />
      </div>
      <div className="text-center text-lg pb-4 w-full">
        <p>Made At Inteli</p>
      </div>
      <div className="flex justify-center py-4 gap-4">
        <Link
          href="https://github.com/Trustless-Card"
          className="hover:cursor-pointer"
        ></Link>
      </div>
      <div className="w-full flex justify-center">
        <p className="mx-auto text-xs md:text-base p-2">
          Copyright @ 2024 TrustlessCards
        </p>
      </div>
    </footer>
  );
}
