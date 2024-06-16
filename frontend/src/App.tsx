// App.tsx

import { FC, useState, useEffect } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";

import { GraphQLProvider } from "./GraphQL";
import { Notices } from "./Notices";
import { Input } from "./Input";
import { Inspect } from "./Inspect";
import { Network } from "./Network";
import { Vouchers } from "./Vouchers";
import { Reports } from "./Reports";
import Games from "./components/games";
import configFile from "./config.json";
import "./App.css";
import RandomWords from "../src/components/contract/RandomWords"

const config: any = configFile;

const injected: any = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v]: [string, any], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Cartesi Rollups Test DApp",
    icon: "<svg><svg/>",
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

const App: FC = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (wallet) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [wallet]);

  return (
    <>
      <div>
        <Network />
        <GraphQLProvider>
          <div className="bg-black p-4 rounded-lg text-white mb-4">
            Dapp Address:
            <input
              type="text"
              value={dappAddress}
              onChange={(e) => setDappAddress(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded p-2 ml-2"
            />
          </div>
          {!isWalletConnected ? (
            <Games />
          ) : (
            <div className="flex flex-wrap gap-4">
              {/* <Input dappAddress={dappAddress} />
              <Input dappAddress={dappAddress} />
              <Input dappAddress={dappAddress} /> */}
			  <RandomWords />
            </div>
          )}
        </GraphQLProvider>
      </div>
    </>
  );
};

export default App;
