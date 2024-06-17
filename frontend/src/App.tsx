import { FC, useState, useEffect } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet } from "@web3-onboard/react";

import { GraphQLProvider } from "./GraphQL";
import { Network } from "./Network";
import configFile from "./config.json";
import "./App.css";

const config: any = configFile;

const injected: any = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v]: [string, any]) => ({
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

  const [{ wallet }] = useConnectWallet();
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
            </div>
          )}
        </GraphQLProvider>
      </div>
    </>
  );
};

export default App;
