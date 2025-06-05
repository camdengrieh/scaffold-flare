"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const EarningsPage: NextPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Insurance Earnings & DeFi Integration</h1>
        <p className="text-base-content/60">
          Explore how to leverage DeFi protocols to maximize your weather insurance earnings
        </p>
      </div>

      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="w-8 h-8 text-primary mt-1" />
          <div>
            <h2 className="text-xl font-bold text-base-content mb-2">🎓 Educational Demo Area</h2>
            <p className="text-base-content/80 mb-3">
              This is your canvas to explore advanced DeFi integrations! Use the foundation we&apos;ve built to
              experiment with yield farming, liquidity provision, and automated market making strategies.
            </p>
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 Challenge Yourself:</h3>
              <p className="text-sm text-base-content/70">
                Implement the features outlined below to create a comprehensive DeFi-enabled insurance platform. Perfect
                for learning about cross-protocol integrations!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DeFi Integration Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Farming */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-6 h-6 text-success" />
            <h3 className="text-lg font-semibold text-base-content">Yield Farming Strategies</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-success/10 rounded-lg p-4">
              <h4 className="font-medium text-success mb-2">Premium Reinvestment Pool</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Automatically deposit collected premiums into yield-generating protocols while policies are active.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>
                  • <strong>Integration:</strong> Aave, Compound, or Flare-native lending protocols
                </p>
                <p>
                  • <strong>Strategy:</strong> Deposit ETH/FLR into lending pools
                </p>
                <p>
                  • <strong>Risk:</strong> Low - funds can be withdrawn when claims need settlement
                </p>
              </div>
            </div>

            <div className="bg-info/10 rounded-lg p-4">
              <h4 className="font-medium text-info mb-2">Liquidity Provider Rewards</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Provide liquidity to DEX pools using insurance reserves to earn trading fees.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>
                  • <strong>Pools:</strong> ETH/FLR, stablecoin pairs
                </p>
                <p>
                  • <strong>Protocols:</strong> SparkDEX, PancakeSwap on Flare
                </p>
                <p>
                  • <strong>Benefit:</strong> Earn fees + potential token rewards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Management */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ChartBarIcon className="w-6 h-6 text-warning" />
            <h3 className="text-lg font-semibold text-base-content">Smart Risk Management</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-warning/10 rounded-lg p-4">
              <h4 className="font-medium text-warning mb-2">Dynamic Reserve Ratios</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Automatically adjust DeFi exposure based on active policy risk and seasonal weather patterns.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>
                  • <strong>Algorithm:</strong> Higher reserves during hurricane season
                </p>
                <p>
                  • <strong>Automation:</strong> Gelato Network for scheduled rebalancing
                </p>
                <p>
                  • <strong>Oracle:</strong> Flare FTSO for weather risk scoring
                </p>
              </div>
            </div>

            <div className="bg-error/10 rounded-lg p-4">
              <h4 className="font-medium text-error mb-2">Hedging Strategies</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Use derivatives to hedge against catastrophic weather events that could drain reserves.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>
                  • <strong>Tools:</strong> Weather derivatives, catastrophe bonds
                </p>
                <p>
                  • <strong>Implementation:</strong> Smart contract-based options
                </p>
                <p>
                  • <strong>Trigger:</strong> Aggregate claim thresholds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Implementation Guide */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <RocketLaunchIcon className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-base-content">Implementation Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Phase 1: Basic Yield</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Integrate Aave lending protocol</li>
                <li>• Auto-deposit idle premiums</li>
                <li>• Track yield earnings per policy</li>
                <li>• Build withdrawal mechanisms</li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-lg p-3">
              <h5 className="font-medium text-base-content text-sm mb-1">Key Contracts:</h5>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• YieldManager.sol</p>
                <p>• EarningsDistributor.sol</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary/10 rounded-lg p-4">
              <h4 className="font-semibold text-secondary mb-2">Phase 2: Advanced DeFi</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Multi-protocol yield optimization</li>
                <li>• LP token staking strategies</li>
                <li>• Cross-chain yield farming</li>
                <li>• Governance token accumulation</li>
              </ul>
            </div>

            <div className="bg-secondary/5 rounded-lg p-3">
              <h5 className="font-medium text-base-content text-sm mb-1">Technologies:</h5>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• LayerZero (cross-chain)</p>
                <p>• Chainlink Automation</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-semibold text-accent mb-2">Phase 3: Innovation</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Tokenized insurance shares</li>
                <li>• DAO governance for strategies</li>
                <li>• Predictive yield optimization</li>
                <li>• Insurance-backed stablecoins</li>
              </ul>
            </div>

            <div className="bg-accent/5 rounded-lg p-3">
              <h5 className="font-medium text-base-content text-sm mb-1">Advanced Concepts:</h5>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Synthetic assets</p>
                <p>• Machine learning models</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Earnings Dashboard */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">💰 Potential Earnings Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <CurrencyDollarIcon className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">$12,450</p>
            <p className="text-sm text-base-content/60">Total Yield Earned</p>
          </div>
          <div className="bg-info/10 rounded-lg p-4 text-center">
            <ArrowTrendingUpIcon className="w-8 h-8 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-info">18.5%</p>
            <p className="text-sm text-base-content/60">APY on Reserves</p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 text-center">
            <BanknotesIcon className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">$85,230</p>
            <p className="text-sm text-base-content/60">Active Reserves</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <ChartBarIcon className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">94.2%</p>
            <p className="text-sm text-base-content/60">Capital Efficiency</p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm text-base-content/70">
            <strong>💡 Build Challenge:</strong> Create a real earnings tracker that integrates with DeFi protocols.
            Track yield generation, calculate profit sharing among policy holders and insurers, and implement automated
            strategies for maximum capital efficiency.
          </p>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20 p-6">
        <h3 className="text-xl font-semibold text-base-content mb-4">📚 Learning Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-base-content mb-3">DeFi Integration Tutorials:</h4>
            <ul className="text-sm text-base-content/70 space-y-2">
              <li>
                •{" "}
                <Link href="https://docs.aave.com/developers" className="text-primary hover:underline">
                  Aave Developer Docs
                </Link>{" "}
                - Lending protocol integration
              </li>
              <li>
                •{" "}
                <Link href="https://docs.flare.network" className="text-primary hover:underline">
                  Flare Network Docs
                </Link>{" "}
                - Native DeFi protocols
              </li>
              <li>
                •{" "}
                <Link href="https://docs.layerzero.network" className="text-primary hover:underline">
                  LayerZero
                </Link>{" "}
                - Cross-chain yield strategies
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-base-content mb-3">Smart Contract Patterns:</h4>
            <ul className="text-sm text-base-content/70 space-y-2">
              <li>• Proxy patterns for upgradeable yield strategies</li>
              <li>• Vault architecture for secure fund management</li>
              <li>• Multi-sig governance for strategy changes</li>
              <li>• Emergency pause mechanisms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-base-100 rounded-xl border border-base-300 p-8">
        <h3 className="text-2xl font-bold text-base-content mb-4">Ready to Build? 🚀</h3>
        <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
          You have a solid foundation with working smart contracts and a functional UI. Now&apos;s the perfect time to
          experiment with DeFi integrations and build out advanced earning strategies!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-policy" className="btn btn-primary">
            Create Test Policies
          </Link>
          <Link href="/debug" className="btn btn-outline">
            Debug Contracts
          </Link>
          <Link href="https://github.com/scaffold-eth/scaffold-eth-2" className="btn btn-ghost">
            Scaffold-ETH Docs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
