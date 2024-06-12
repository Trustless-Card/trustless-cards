import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-indigo-950 to-black text-white">
      <div>
        <div className="pt-10 flex justify-center mb-5">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault(); // Prevent the default link behavior
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the page
            }}
          >
            <img
              src={logo}
              alt="logo"
              className="h-20 w-20 hover:cursor-pointer"
            />
          </a>
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
      </div>
    </footer>
  );
}
