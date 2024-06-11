import React from "react";
import logo from "../../logo.svg"; // Ajuste o caminho conforme necessário
import { Card } from "../ui/card"; // Ajuste o caminho conforme necessário

export default function AboutHero() {
  return (
    <div className="flex justify-center" id="about">
      <div className="px-12 md:px-12 mt-4 md:mt-12 max-w-screen-2xl w-[100%]">
        <p className="text-5xl font-semibold md:px-10 mb-2">
          What is Trustless Cards?
        </p>
        <div className="flex items-center justify-center">
          <div className="md:w-[70%] md:h-[80%] md:flex p-4 gap-8">
            <div className="md:w-[50%]">
              <div>
                <Card className="mb-6 bg-[#171E4D] border-2 border-[#161d15] md:p-6 p-4">
                  <p className="text-3xl py-2">Fair and Trustless Gaming</p>
                  <p className="indent-4 text-neutral-400">
                    Trustless Cards provides a transparent online card gaming
                    experience using decentralized technology. Each shuffle is
                    verifiable and tamper-proof, ensuring fairness and
                    eliminating doubts about game integrity.
                  </p>
                </Card>
              </div>
              <div>
                <Card className="mb-6 md:mb-0 bg-[#171E4D] border-2 border-[#161d15] md:p-6 p-4">
                  <p className="text-3xl py-2">
                    Seamless Crypto Wallet Integration
                  </p>
                  <p className="indent-4 text-neutral-400">
                    Players can use their existing crypto wallets to participate
                    directly in games, enhancing usability and ensuring a
                    smooth, secure financial transaction interface without
                    relying on traditional banking methods.
                  </p>
                </Card>
              </div>
            </div>
            <div className="md:w-[50%]">
              <div>
                <Card className="md:h-full mb-6 bg-[#171E4D] border-2 border-[#161d15] md:p-6 p-4">
                  <p className="text-3xl py-2">Technological Innovation</p>
                  <p className="indent-4 mb-2 text-neutral-400">
                    Leveraging Cartesi Rollups, Trustless Cards processes
                    thousands of gaming rounds daily off-chain, significantly
                    reducing gas fees while maintaining the security and
                    integrity of on-chain data. This method guarantees equal
                    conditions for all players and ensures platform actions are
                    always transparent and auditable.
                  </p>
                  <p className="indent-4 mb-2 text-neutral-400">
                    Moreover, this platform facilitates instant payouts to
                    players and manages operational costs effectively, keeping
                    transaction fees to a minimum.
                  </p>
                </Card>
              </div>
            </div>
          </div>
          {/* <img
            src={station3d} // Certifique-se de que o caminho está correto
            alt="station"
            height={700}
            className="hidden md:block md:-mt-12 max-h-screen-2xl"
          /> */}
        </div>
      </div>
    </div>
  );
}
