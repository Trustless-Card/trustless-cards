import ReactDOM from "react-dom";
import AppCards from "./App";
import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

const app = init({
  wallets: [injected],
  chains: [
    {
      id: "0x1", // ID da cadeia Ethereum Mainnet
      token: "ETH", // Símbolo do token nativo
      label: "Ethereum Mainnet", // Nome amigável da cadeia
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY" // URL do provedor RPC
    }
  ]
});

ReactDOM.render(<AppCards />, document.getElementById('root'));

