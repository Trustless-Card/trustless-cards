// src/hooks/useWallet.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
      setWalletAddress("");
      setWalletBalance("");
      setIsConnected(false);
    } else {
      const account = accounts[0];
      setWalletAddress(account);
      await updateBalance(account);
      await sendWalletDataToBackend(account, walletBalance);
      setIsConnected(true);
    }
  };

  const updateBalance = async (account) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      const balanceInEther = ethers.utils.formatEther(balance);
      const formattedBalance = parseFloat(balanceInEther).toFixed(6); // Formata o saldo para 6 casas decimais
      setWalletBalance(formattedBalance);
    }
  };

  const requestAccount = async () => {
    if (window.ethereum) {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account);
        await updateBalance(account);
        await sendWalletDataToBackend(account, walletBalance);
        setIsConnected(true);
        return account;
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const connectWallet = async () => {
    await requestAccount();
  };

//   const sendWalletDataToBackend = async (address, balance) => {
//     try {
//       const response = await fetch("http://localhost:8080/api/wallet-data", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ address, balance }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to send wallet data to backend");
//       }
//     } catch (error) {
//       console.error("Error sending wallet data to backend:", error);
//     }
//   };

  return {
    walletAddress,
    walletBalance,
    isConnected,
    connectWallet,
  };
}
