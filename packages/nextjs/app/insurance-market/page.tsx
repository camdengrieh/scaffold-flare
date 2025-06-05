"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "viem";
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  CloudIcon,
  CurrencyDollarIcon,
  FireIcon,
  FunnelIcon,
  InformationCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type PolicyType = "temperature" | "weather-event";

interface MarketPolicy {
  id: number;
  type: PolicyType;
  holder: string;
  latitude: number;
  longitude: number;
  startTimestamp: number;
  expirationTimestamp: number;
  premium: string;
  coverage: string;
  // Type-specific fields
  minTempThreshold?: number;
  weatherIdThreshold?: number;
  // Market-specific metadata
  location?: string;
  riskScore: number; // 1-10 scale
  expectedROI: number; // percentage
  daysRemaining: number;
  holderReputation: number; // 1-5 stars
  contractName: string;
}

const InsuranceMarket: NextPage = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  // Read data from contracts
  const { data: minTempPolicies } = useScaffoldReadContract({
    contractName: "MinTempAgency",
    functionName: "getAllPolicies",
  });

  const { data: weatherIdPolicies } = useScaffoldReadContract({
    contractName: "WeatherIdAgency",
    functionName: "getAllPolicies",
  });

  // Helper function to get location name from coordinates
  const getLocationName = (lat: number, lng: number): string => {
    const locations: { [key: string]: string } = {
      "40774000,-73962000": "New York, NY",
      "41878100,-87629800": "Chicago, IL",
      "25761700,-80191800": "Miami, FL",
      "47606200,-122332100": "Seattle, WA",
      "39739200,-104990200": "Denver, CO",
      "34052200,-118243700": "Los Angeles, CA",
    };
    return locations[`${lat},${lng}`] || `${lat / 1_000_000}, ${lng / 1_000_000}`;
  };

  // Helper function to calculate risk score based on policy data
  const calculateRiskScore = (policy: any): number => {
    // Simple risk calculation based on various factors
    let risk = 5; // base risk

    // Adjust based on coverage amount (higher coverage = higher risk)
    const coverageAmount = parseFloat(formatEther(policy.coverage));
    if (coverageAmount > 5) risk += 2;
    else if (coverageAmount > 2) risk += 1;
    else if (coverageAmount < 1) risk -= 1;

    // Adjust based on time to expiration (shorter time = lower risk)
    const daysToExpiry = (Number(policy.expirationTimestamp) - Date.now() / 1000) / (24 * 60 * 60);
    if (daysToExpiry < 3) risk -= 1;
    else if (daysToExpiry > 14) risk += 1;

    // Clamp between 1-10
    return Math.max(1, Math.min(10, risk));
  };

  // Helper function to calculate expected ROI
  const calculateExpectedROI = (premium: string, coverage: string, riskScore: number): number => {
    const premiumNum = parseFloat(premium);
    const coverageNum = parseFloat(coverage);
    const baseProfitMargin = ((coverageNum - premiumNum) / premiumNum) * 100;

    // Adjust for risk - higher risk should have higher ROI potential
    const riskMultiplier = (11 - riskScore) / 10; // Inverse relationship
    return Math.round(baseProfitMargin * riskMultiplier * 100) / 100;
  };

  // Process contract data to market policies (only unclaimed policies)
  const marketPolicies: MarketPolicy[] = [
    ...(minTempPolicies || [])
      .filter(policy => Number(policy.status) === 0) // Only unclaimed policies
      .map(policy => {
        const riskScore = calculateRiskScore(policy);
        const premium = formatEther(policy.premium);
        const coverage = formatEther(policy.coverage);
        const daysRemaining = Math.ceil((Number(policy.expirationTimestamp) - Date.now() / 1000) / (24 * 60 * 60));

        return {
          id: Number(policy.id),
          type: "temperature" as const,
          holder: policy.holder,
          latitude: Number(policy.latitude),
          longitude: Number(policy.longitude),
          startTimestamp: Number(policy.startTimestamp),
          expirationTimestamp: Number(policy.expirationTimestamp),
          premium,
          coverage,
          minTempThreshold: "minTempThreshold" in policy ? Number(policy.minTempThreshold) / 1_000_000 : undefined,
          location: getLocationName(Number(policy.latitude), Number(policy.longitude)),
          riskScore,
          expectedROI: calculateExpectedROI(premium, coverage, riskScore),
          daysRemaining: Math.max(0, daysRemaining),
          holderReputation: 4, // Default reputation - would be calculated from history
          contractName: "MinTempAgency",
        };
      }),
    ...(weatherIdPolicies || [])
      .filter(policy => Number(policy.status) === 0) // Only unclaimed policies
      .map(policy => {
        const riskScore = calculateRiskScore(policy);
        const premium = formatEther(policy.premium);
        const coverage = formatEther(policy.coverage);
        const daysRemaining = Math.ceil((Number(policy.expirationTimestamp) - Date.now() / 1000) / (24 * 60 * 60));

        return {
          id: Number(policy.id),
          type: "weather-event" as const,
          holder: policy.holder,
          latitude: Number(policy.latitude),
          longitude: Number(policy.longitude),
          startTimestamp: Number(policy.startTimestamp),
          expirationTimestamp: Number(policy.expirationTimestamp),
          premium,
          coverage,
          weatherIdThreshold: "weatherIdThreshold" in policy ? Number(policy.weatherIdThreshold) : undefined,
          location: getLocationName(Number(policy.latitude), Number(policy.longitude)),
          riskScore,
          expectedROI: calculateExpectedROI(premium, coverage, riskScore),
          daysRemaining: Math.max(0, daysRemaining),
          holderReputation: 4, // Default reputation - would be calculated from history
          contractName: "WeatherIdAgency",
        };
      }),
  ];

  const filteredPolicies = marketPolicies
    .filter(policy => {
      const typeMatch = selectedType === "all" || policy.type === selectedType;
      const riskMatch =
        riskFilter === "all" ||
        (riskFilter === "low" && policy.riskScore <= 3) ||
        (riskFilter === "medium" && policy.riskScore >= 4 && policy.riskScore <= 6) ||
        (riskFilter === "high" && policy.riskScore >= 7);
      return typeMatch && riskMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "roi":
          return b.expectedROI - a.expectedROI;
        case "premium":
          return parseFloat(a.premium) - parseFloat(b.premium);
        case "risk":
          return a.riskScore - b.riskScore;
        case "expiry":
          return a.daysRemaining - b.daysRemaining;
        default:
          return b.id - a.id; // newest first
      }
    });

  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 3) return { color: "badge-success", label: "Low Risk" };
    if (riskScore <= 6) return { color: "badge-warning", label: "Medium Risk" };
    return { color: "badge-error", label: "High Risk" };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const calculatePotentialProfit = (premium: string, coverage: string) => {
    const premiumNum = parseFloat(premium);
    const coverageNum = parseFloat(coverage);
    return (coverageNum - premiumNum).toFixed(2);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">Insurance Market</h1>
          <p className="text-base-content/60">
            Browse and claim weather insurance policies to earn by providing coverage
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/create-policy" className="btn btn-primary">
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            Create Policy
          </Link>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Available Policies</p>
              <p className="text-xl font-bold text-base-content">{marketPolicies.length}</p>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Coverage</p>
              <p className="text-xl font-bold text-base-content">
                {marketPolicies.reduce((sum, p) => sum + parseFloat(p.coverage), 0).toFixed(1)} ETH
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-success" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Avg. Expected ROI</p>
              <p className="text-xl font-bold text-base-content">
                {marketPolicies.length > 0
                  ? (marketPolicies.reduce((sum, p) => sum + p.expectedROI, 0) / marketPolicies.length).toFixed(1)
                  : "0"}
                %
              </p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-info" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Avg. Risk Score</p>
              <p className="text-xl font-bold text-base-content">
                {marketPolicies.length > 0
                  ? (marketPolicies.reduce((sum, p) => sum + p.riskScore, 0) / marketPolicies.length).toFixed(1)
                  : "0"}
                /10
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-warning" />
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-base-content/60" />
            <span className="text-sm font-medium text-base-content">Filters & Sorting:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Types</option>
              <option value="temperature">Temperature</option>
              <option value="weather-event">Weather Event</option>
            </select>

            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (1-3)</option>
              <option value="medium">Medium Risk (4-6)</option>
              <option value="high">High Risk (7-10)</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="newest">Newest First</option>
              <option value="roi">Highest ROI</option>
              <option value="premium">Lowest Premium</option>
              <option value="risk">Lowest Risk</option>
              <option value="expiry">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-info/10 to-primary/10 rounded-xl border border-info/20 p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-info mt-0.5" />
          <div>
            <h3 className="font-semibold text-base-content mb-2">How Insurance Claiming Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-base-content/80">
              <div>
                <strong>1. Browse & Analyze:</strong> Review policies, risk scores, and expected returns to find
                opportunities that match your risk tolerance.
              </div>
              <div>
                <strong>2. Claim & Deposit:</strong> Claim a policy by depositing the coverage amount. You&apos;ll
                receive the premium immediately.
              </div>
              <div>
                <strong>3. Earn or Pay:</strong> If the weather condition isn&apos;t met, you keep the coverage. If it
                is met, the policyholder receives the payout.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Policies */}
      <div className="space-y-4">
        {filteredPolicies.length === 0 ? (
          <div className="bg-base-100 rounded-xl border border-base-300 p-8 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">No policies match your filters</h3>
            <p className="text-base-content/60 mb-4">Try adjusting your filters to see more available policies.</p>
            <button
              onClick={() => {
                setSelectedType("all");
                setRiskFilter("all");
                setSortBy("newest");
              }}
              className="btn btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredPolicies.map(policy => {
            const riskBadge = getRiskBadge(policy.riskScore);
            const potentialProfit = calculatePotentialProfit(policy.premium, policy.coverage);

            return (
              <div
                key={`${policy.contractName}-${policy.id}`}
                className="bg-base-100 rounded-xl border border-base-300 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Policy Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {policy.type === "temperature" ? (
                            <FireIcon className="w-8 h-8 text-orange-500" />
                          ) : (
                            <CloudIcon className="w-8 h-8 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base-content">
                            {policy.type === "temperature" ? "Temperature Insurance" : "Weather Event Insurance"}
                          </h3>
                          <p className="text-sm text-base-content/60">Policy ID: #{policy.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`badge ${riskBadge.color}`}>{riskBadge.label}</span>
                        <span className="badge badge-outline">{policy.daysRemaining} days left</span>
                      </div>
                    </div>

                    {/* Policy Holder Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-base-content/60">Policy Holder:</span>
                        <Address address={policy.holder} />
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(policy.holderReputation)}
                        <span className="text-sm text-base-content/60 ml-1">({policy.holderReputation}/5)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4 text-base-content/50" />
                        <span className="text-base-content/70">{policy.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-base-content/50" />
                        <span className="text-base-content/70">
                          {formatDate(policy.startTimestamp)} - {formatDate(policy.expirationTimestamp)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-base-content/50" />
                        <span className="text-base-content/70">Premium: {policy.premium} ETH</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base-content/70">Coverage: {policy.coverage} ETH</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-base-content/60">
                        <strong>Condition:</strong>{" "}
                        {policy.type === "temperature"
                          ? `Temperature < ${policy.minTempThreshold}°C`
                          : `Weather ID ≥ ${policy.weatherIdThreshold}`}
                      </div>
                      <div className="text-success">
                        <strong>Expected ROI:</strong> {policy.expectedROI}%
                      </div>
                      <div className="text-primary">
                        <strong>Potential Profit:</strong> {potentialProfit} ETH
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                      <button className="btn btn-primary">Claim Policy ({policy.coverage} ETH)</button>
                      <button className="btn btn-outline btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Market Tips */}
      {filteredPolicies.length > 0 && (
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">Insurance Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/70">
            <div>
              <h4 className="font-medium text-base-content mb-2">Risk Assessment</h4>
              <ul className="space-y-1">
                <li>• Check historical weather data for the location</li>
                <li>• Consider seasonal patterns and climate trends</li>
                <li>• Review the policy holder&apos;s reputation score</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-base-content mb-2">Portfolio Strategy</h4>
              <ul className="space-y-1">
                <li>• Diversify across different locations and types</li>
                <li>• Balance high-risk/high-reward with stable policies</li>
                <li>• Monitor your total exposure and risk tolerance</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceMarket;
