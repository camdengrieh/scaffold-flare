import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { USDCFaucet } from "~~/components/scaffold-eth";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>

      {/* USDC Faucet Section */}
      <div className="text-center mt-8 bg-base-200 p-8 rounded-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-base-content">🚰 USDC Test Faucet</h2>
        <p className="text-base-content/70 mb-6 text-sm">
          Get test USDC tokens to interact with the weather insurance platform
        </p>
        <USDCFaucet />
      </div>
    </>
  );
};

export default Debug;
