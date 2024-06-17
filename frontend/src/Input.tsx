// Input.tsx

// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { useRollups } from "./useRollups";
// import { useWallets } from "@web3-onboard/react";
// import { Button } from "./components/ui/button";
// import useRandomWordFromContract from "./components/contract/RandomWords";

// interface IInputProps {
//     dappAddress: string;
// }

// export const Input: React.FC<IInputProps> = (props) => {
//     const rollups = useRollups(props.dappAddress);
//     const [connectedWallet] = useWallets();

//     const [input, setInput] = useState<string>("");
//     const [hexInput, setHexInput] = useState<boolean>(false);

//     const fetchRandomWordFromContract = useRandomWordFromContract();

//     const sendAddress = async (str: string) => {
//         if (rollups) {
//             try {
//                 await rollups.relayContract.relayDAppAddress(props.dappAddress);
//             } catch (e) {
//                 console.log(`${e}`);
//             }
//         }
//     };

//     const addInput = async () => {
//         try {
//             const randomWord = await fetchRandomWordFromContract();
//             const mockJson = JSON.stringify({
//                 method: "shambles",
//                 from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//                 amount: randomWord
//             });

//             if (rollups) {
//                 let payload = ethers.utils.toUtf8Bytes(mockJson);
//                 if (hexInput) {
//                     payload = ethers.utils.arrayify(mockJson);
//                 }
//                 await rollups.inputContract.addInput(props.dappAddress, payload);
//                 console.log("Input adicionado:", mockJson); // Debug para verificar se o input está sendo passado corretamente
//             }
//         } catch (e) {
//             console.log(`${e}`);
//         }
//     };


import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { Button } from "./components/ui/button";
import useRandomWordFromContract from "./components/contract/RandomWords";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

interface IInputProps {
  dappAddress: string;
}

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

const GET_NOTICES = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const Input: React.FC<IInputProps> = (props) => {
  const rollups = useRollups(props.dappAddress);
  const [connectedWallet] = useWallets();

  const [input, setInput] = useState<string>("");
  const [hexInput, setHexInput] = useState<boolean>(false);

  const fetchRandomWordFromContract = useRandomWordFromContract();

  const fetchNotices = async () => {
    try {
      const { data } = await client.query({
        query: GET_NOTICES,
      });
      console.log("Notices fetched:", data.notices.edges);
    } catch (e) {
      console.error("Failed to fetch notices:", e);
    }
  };

  const sendAddress = async (str: string) => {
    if (rollups) {
      try {
        await rollups.relayContract.relayDAppAddress(props.dappAddress);
        fetchNotices(); // Chamar GraphQL após o sucesso do relay
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const addInput = async () => {
    try {
      const randomWord = await fetchRandomWordFromContract();
      const mockJson = JSON.stringify({
        method: "shambles",
        from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        amount: randomWord,
      });

      if (rollups) {
        let payload = ethers.utils.toUtf8Bytes(mockJson);
        if (hexInput) {
          payload = ethers.utils.arrayify(mockJson);
        }
        await rollups.inputContract.addInput(props.dappAddress, payload);
        console.log("Input adicionado:", mockJson); // Debug para verificar se o input está sendo passado corretamente
        fetchNotices(); // Chamar GraphQL após o sucesso do addInput
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  return (
    <div className="text-center max-w-screen-xl mx-auto mb-10" id="input">
            <Button
              variant="default"
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black transition duration-200 ease-in-out hover:scale-110 active:scale-100 hover:bg-black"
              onClick={addInput}
              disabled={!rollups}
            >
              <p className="text-2xl bg-gradient-to-r from-[#9a5517] via-[#ffd98e] to-[#873a1a] bg-clip-text text-transparent">
                Send
              </p>
            </Button>
    </div>
  );
};

