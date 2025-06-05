"use client";

import { useState } from "react";
import { USDCBalance } from "./USDCBalance";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Faucet modal which lets you send USDC to any address.
 * Also includes a faucet to get 1000 USDC for testing.
 */
export const USDCFaucet = () => {
  const { address: connectedAddress } = useAccount();
  const [loading, setLoading] = useState(false);

  const { writeContractAsync: writeUSDCContract } = useScaffoldWriteContract("USDCToken");

  const handleFaucet = async () => {
    if (!connectedAddress) return;

    setLoading(true);
    try {
      await writeUSDCContract({
        functionName: "faucet",
      });
    } catch (error) {
      console.error("Error getting USDC from faucet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!connectedAddress) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        <USDCBalance address={connectedAddress} />
        <button className="btn btn-secondary btn-sm" onClick={handleFaucet} disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <BanknotesIcon className="h-4 w-4" />
              Get 1000 USDC
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-base-content/60">
        Use the faucet to get test USDC for creating and claiming policies.
      </p>
    </div>
  );
};
