"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";

export type WalkthroughMode = "developer" | "user" | null;

export interface WalkthroughStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right";
  action?: () => void; // Optional action to perform when step is shown
}

interface WalkthroughContextType {
  isActive: boolean;
  mode: WalkthroughMode;
  currentStep: number;
  totalSteps: number;
  currentStepData: WalkthroughStep | null;
  startWalkthrough: (mode: WalkthroughMode) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipWalkthrough: () => void;
  closeWalkthrough: () => void;
  goToStep: (step: number) => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

const developerSteps: WalkthroughStep[] = [
  {
    id: "welcome-dev",
    title: "Welcome, Developer! 👨‍💻",
    content:
      "Let's explore the technical aspects of this weather insurance dApp built on Flare Network with Web2Json oracles.",
    target: "body",
    position: "bottom",
  },
  {
    id: "debug-contracts",
    title: "Debug Contracts",
    content:
      "Access the contract debugging interface to interact directly with your deployed smart contracts. Test functions, read contract state, and monitor transactions.",
    target: '[href="/debug"]',
    position: "bottom",
  },
  {
    id: "create-policy-dev",
    title: "Policy Creation Logic",
    content:
      "This form demonstrates how to interact with smart contracts using USDC payments. Notice the coordinate conversion (×10⁶) and timestamp handling for blockchain compatibility.",
    target: '[href="/create-policy"]',
    position: "bottom",
  },
  {
    id: "analytics-dev",
    title: "Analytics & Event Indexing",
    content:
      "Learn about implementing Ponder.sh for real-time event indexing and building comprehensive analytics dashboards for your dApp.",
    target: '[href="/analytics"]',
    position: "bottom",
  },
  {
    id: "earnings-dev",
    title: "DeFi Integration Patterns",
    content:
      "Explore advanced DeFi integration strategies including yield farming, liquidity provision, and automated market making for insurance platforms.",
    target: '[href="/earnings"]',
    position: "bottom",
  },
  {
    id: "wallet-connection",
    title: "Wallet Integration",
    content:
      "RainbowKit provides seamless wallet connection with support for multiple wallets. The connection state is managed globally across the app.",
    target: '[data-testid="wallet-connect"]',
    position: "left",
  },
  {
    id: "contract-data",
    title: "Live Contract Data",
    content:
      "These statistics are pulled directly from the blockchain using useScaffoldReadContract hooks. Data updates automatically when new transactions occur.",
    target: '[data-testid="dashboard-stats"]',
    position: "top",
  },
];

const userSteps: WalkthroughStep[] = [
  {
    id: "welcome-user",
    title: "Welcome to Weather Insurance! 🌦️",
    content:
      "Get protection against weather risks with our decentralized insurance platform. Let's show you how it works.",
    target: "body",
    position: "bottom",
  },
  {
    id: "connect-wallet",
    title: "Connect Your Wallet",
    content:
      "First, connect your wallet to start using the platform. We support multiple wallet types for your convenience.",
    target: '[data-testid="wallet-connect"]',
    position: "left",
  },
  {
    id: "dashboard-overview",
    title: "Platform Overview",
    content:
      "Here you can see live statistics about policies, total coverage, and market activity. This data updates in real-time.",
    target: '[data-testid="dashboard-stats"]',
    position: "top",
  },
  {
    id: "create-policy-user",
    title: "Create Insurance Policy",
    content:
      "Create your own weather insurance policy. Set your terms, premium, and coverage amount. Other users can then provide insurance for your policy.",
    target: '[href="/create-policy"]',
    position: "bottom",
  },
  {
    id: "insurance-market",
    title: "Insurance Marketplace",
    content:
      "Browse available policies that need insurance coverage. Earn returns by providing coverage for weather risks in different locations.",
    target: '[href="/insurance-market"]',
    position: "bottom",
  },
  {
    id: "my-policies",
    title: "Manage Your Policies",
    content:
      "Track all your created policies and their status. See premiums paid, coverage amounts, and settlement history.",
    target: '[href="/my-policies"]',
    position: "bottom",
  },
  {
    id: "how-it-works",
    title: "Automated Settlement",
    content:
      "Policies automatically settle based on real weather data from Flare's Web2Json oracles. No manual intervention needed!",
    target: "body",
    position: "top",
  },
];

export const WalkthroughProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<WalkthroughMode>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = mode === "developer" ? developerSteps : userSteps;
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep] || null;

  const startWalkthrough = (selectedMode: WalkthroughMode) => {
    setMode(selectedMode);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeWalkthrough();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipWalkthrough = () => {
    closeWalkthrough();
  };

  const closeWalkthrough = () => {
    setIsActive(false);
    setMode(null);
    setCurrentStep(0);
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        mode,
        currentStep,
        totalSteps,
        currentStepData,
        startWalkthrough,
        nextStep,
        previousStep,
        skipWalkthrough,
        closeWalkthrough,
        goToStep,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (context === undefined) {
    throw new Error("useWalkthrough must be used within a WalkthroughProvider");
  }
  return context;
};
