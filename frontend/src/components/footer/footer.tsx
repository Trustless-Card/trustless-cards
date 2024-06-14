import "./footer.css";

import logo from '/logo.png'

export default function Footer() {
  return (
    <>
      <hr className="mt-20 border-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#F0E68C] via-[#F5DEB3] via-[#FFA500] to-[#FFD700] move-gradient" />

      <footer className="flex flex-col items-center p-5 ">
        <div className="justify-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault(); 
              window.scrollTo({ top: 0, behavior: "smooth" }); 
            }}
          >
            <img
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="hover:cursor-pointer"
            />
          </a>
        </div>
        <p className="text-xs text-neutral-400 md:text-base p-2 text-center">
          ♧ Copyright @ 2024 TrustlessCards ♧
        </p>
      </footer>
    </>
  );
}
