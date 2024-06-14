// src/hooks/useWallet.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      checkIfWalletIsConnected();
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

  const handleAccountsChanged = async (accounts: string[]) => {
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

  const updateBalance = async (account: string) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      const balanceInEther = ethers.utils.formatEther(balance);
      const formattedBalance = parseFloat(balanceInEther).toFixed(6); 
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

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletAddress(account);
        await updateBalance(account);
        setIsConnected(true);
      }
    }
  };

  const sendWalletDataToBackend = async (address: any, balance: any) => {
    try {
      const response = await fetch("http://localhost:8080/api/wallet-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, balance }),
      });
      if (!response.ok) {
        throw new Error("Failed to send wallet data to backend");
      }
    } catch (error) {
      console.error("Error sending wallet data to backend:", error);
    }
  };

  return {
    walletAddress,
    walletBalance,
    isConnected,
    connectWallet,
  };
}
