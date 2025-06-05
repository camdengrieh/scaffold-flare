"use client";

import React from "react";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

interface WeatherHeaderProps {
  onMenuToggle: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({ onMenuToggle }) => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <header className="sticky top-0 z-30 w-full bg-base-100 border-b border-base-300 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Mobile menu button and network info */}
        <div className="flex items-center space-x-4">
          <button onClick={onMenuToggle} className="lg:hidden btn btn-ghost btn-sm" aria-label="Open navigation menu">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right side - Wallet connection and faucet */}
        <div className="flex items-center space-x-3">
          <div data-testid="wallet-connect">
            <RainbowKitCustomConnectButton />
          </div>
          {isLocalNetwork && <FaucetButton />}
        </div>
      </div>
    </header>
  );
};
