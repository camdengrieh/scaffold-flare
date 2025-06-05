"use client";

import { Address, formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type USDCBalanceProps = {
  address?: Address;
  className?: string;
  displayDecimals?: number;
  prefix?: string;
};

/**
 * Display USDC balance of an address.
 */
export const USDCBalance = ({ address, className = "", displayDecimals = 2, prefix = "💵" }: USDCBalanceProps) => {
  const {
    data: usdcBalance,
    isLoading,
    isError,
  } = useScaffoldReadContract({
    contractName: "USDCToken",
    functionName: "balanceOf",
    args: [address],
  });

  if (!address || isLoading) {
    return (
      <div className="animate-pulse flex space-x-2">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center">
          <div className="h-2 w-20 bg-slate-300 rounded-sm"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-base-content/30 rounded-md px-2 flex flex-col items-center max-w-fit">
        <div className="text-warning text-xs">Error</div>
      </div>
    );
  }

  const formattedUSDCBalance = usdcBalance ? Number(formatUnits(usdcBalance, 6)) : 0;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {prefix && <span className="text-sm">{prefix}</span>}
      <span className="font-medium">{formattedUSDCBalance.toFixed(displayDecimals)}</span>
      <span className="text-xs font-bold text-base-content/70">USDC</span>
    </div>
  );
};
