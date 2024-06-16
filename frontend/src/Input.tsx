import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { Button } from "./components/ui/button"; // Certifique-se de importar corretamente o componente Button

interface IInputProps {
    dappAddress: string;
}

export const Input: React.FC<IInputProps> = (props) => {
    const rollups = useRollups(props.dappAddress);
    const [connectedWallet] = useWallets();
    
    const [input, setInput] = useState<string>("");
    const [hexInput, setHexInput] = useState<boolean>(false);

    const sendAddress = async (str: string) => {
        if (rollups) {
            try {
                await rollups.relayContract.relayDAppAddress(props.dappAddress);
            } catch (e) {
                console.log(`${e}`);
            }
        }
    };

    const addInput = async (str: string) => {
        if (rollups) {
            try {
                let payload = ethers.utils.toUtf8Bytes(str);
                if (hexInput) {
                    payload = ethers.utils.arrayify(str);
                }
                await rollups.inputContract.addInput(props.dappAddress, payload);
                console.log("Input adicionado:", str); // Debug para verificar se o input está sendo passado corretamente
            } catch (e) {
                console.log(`${e}`);
            }
        }
    };

    return (
        <div className="text-center max-w-screen-xl mx-auto mb-10" id="input">
            <div className="flex gap-4 md:gap-14 flex-wrap mt-8 justify-center md:mt-10 mx-10 md:mx-0">
                <div className="w-[95%] md:w-[30%] mb-8 relative group">
                    <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-md rounded-lg"></div>
                    <div className="bg-zinc-950 dark:bg-white border-gold h-[350px] relative z-10">
                        <div className="text-center">
                            <div className="flex flex-col justify-center items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-[#FFFFF] border-2 border-[#161d15] flex justify-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="text-white"
                                        width="40"
                                        height="40"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                                <p className="text-white pb-3">Input</p>
                            </div>
                        </div>
                        <div className="text-neutral-300">
                            <input
                                type="text"
                                className="bg-gray-200 dark:bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-md py-2 px-4 block w-full sm:text-sm"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="default"
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black transition duration-200 ease-in-out hover:scale-110 active:scale-100 hover:bg-black"
                            onClick={() => addInput(input)}
                            disabled={!rollups}
                        >
                            <p className="text-2xl bg-gradient-to-r from-[#9a5517] via-[#ffd98e] to-[#873a1a] bg-clip-text text-transparent">
                                Send
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

