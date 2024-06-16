import { useState, useEffect } from "react";
import { ethers, ContractInterface } from "ethers";
import ContractData from "../../abis/TrustlessCards.json"; // Certifique-se de que o caminho está correto

const useRandomWordFromContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [randomWord, setRandomWord] = useState<string>("");

  // Função para inicializar o contrato
  const initializeContract = async (): Promise<ethers.Contract | null> => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const contractAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          ContractData.abi as ContractInterface, // Acessar a propriedade 'abi'
          signer
        );
        setContract(contractInstance);
        return contractInstance;
      } else {
        console.error("MetaMask is not installed or not available.");
        return null;
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
      return null;
    }
  };

  // Função para buscar o valor da posição 1 do array s_randomWords do contrato
  const fetchRandomWordFromContract = async (): Promise<string> => {
    try {
      const contractInstance = contract || (await initializeContract()); // Inicializa o contrato se ainda não estiver inicializado
      if (contractInstance) {
        console.log("Fetching random word from contract...");
        const result: ethers.BigNumber = await contractInstance.s_randomWords(1); // Chama a posição 1 do array s_randomWords
        const randomWordStr = result.toString();
        console.log("Random word fetched:", randomWordStr);
        setRandomWord(randomWordStr);
        return randomWordStr;
      } else {
        throw new Error("Contract instance is not initialized.");
      }
    } catch (error) {
      console.error("Error fetching random word from contract:", error);
      throw error;
    }
  };

  return fetchRandomWordFromContract;
};

export default useRandomWordFromContract;


//import React, { useState } from "react";
//import { ethers, ContractInterface } from "ethers";
//import ContractData from "../../abis/TrustlessCards.json"; // Certifique-se de que o caminho está correto
//
//const ReadRandomWordFromContract: React.FC = () => {
//  const [contract, setContract] = useState<ethers.Contract | null>(null);
//  const [randomWord, setRandomWord] = useState<string>("");
//
//  // Função para inicializar o contrato
//  const initializeContract = async (): Promise<ethers.Contract | null> => {
//    try {
//      if (typeof window.ethereum !== "undefined") {
//        const contractAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";
//        const provider = new ethers.providers.Web3Provider(window.ethereum);
//        const signer = provider.getSigner();
//        const contractInstance = new ethers.Contract(
//          contractAddress,
//          ContractData.abi as ContractInterface, // Acessar a propriedade 'abi'
//          signer
//        );
//        setContract(contractInstance);
//        return contractInstance;
//      } else {
//        console.error("MetaMask is not installed or not available.");
//        return null;
//      }
//    } catch (error) {
//      console.error("Error initializing contract:", error);
//      return null;
//    }
//  };
//
//  // Função para buscar o valor da posição 1 do array s_randomWords do contrato
//  const fetchRandomWordFromContract = async () => {
//    try {
//      const contractInstance = contract || (await initializeContract()); // Inicializa o contrato se ainda não estiver inicializado
//      if (contractInstance) {
//        console.log("Fetching random word from contract...");
//        const result: ethers.BigNumber = await contractInstance.s_randomWords(
//          1
//        ); // Chama a posição 1 do array s_randomWords
//        console.log("Random word fetched:", result.toString());
//        setRandomWord(result.toString());
//      }
//    } catch (error) {
//      console.error("Error fetching random word from contract:", error);
//    }
//  };
//
//  return (
//    <div className="flex flex-col items-center justify-center min-h-screen py-2">
//      <h1 className="text-3xl font-bold mb-4">
//        Read Random Word from Contract
//      </h1>
//      <button
//        onClick={fetchRandomWordFromContract}
//        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//      >
//        Fetch Random Word
//      </button>
//      {randomWord && (
//        <div className="mt-4 p-4 bg-gray-100 border rounded-lg">
//          <p>Random Word: {randomWord}</p>
//        </div>
//      )}
//    </div>
//  );
//};
//
//export default ReadRandomWordFromContract;
