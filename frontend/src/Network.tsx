import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";
import Header from "./components/header/header";
import Intro from "./components/intro/intro";
import AboutHero from "./components/about/about";
import Footer from "./components/footer/footer";
import Games from "./components/games"
import { Inspect } from "./Inspect";

import './App.css'



const config: any = configFile;

export const Network: FC = () => {
//   const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
//   const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

  return (
    <>
      {/* <div>
        {!wallet && (
          <button
            onClick={() => connect()}
            className="flex flex-row bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
          >
            <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            {connecting ? "Connecting" : "Connect Wallet"}
          </button>
        )}
        {wallet && (
          <div>
            <label>Switch Chain</label>
            {settingChain ? (
              <span>Switching chain...</span>
            ) : (
              <select
                onChange={({ target: { value } }) => {
                  if (config[value] !== undefined) {
                    setChain({ chainId: value });
                  } else {
                    alert("No deploy on this chain");
                  }
                }}
                value={connectedChain?.id}
              >
                {chains.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            )}
        </div>
		  <Header />
		  <Intro />
		  <AboutHero />
			<Inspect />
		<Games />
		  <Footer />
		</>
    );
};
