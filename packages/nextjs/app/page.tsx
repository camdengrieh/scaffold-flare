"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CloudIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Dashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Read data from contracts
  const { data: minTempPolicies } = useScaffoldReadContract({
    contractName: "MinTempAgency",
    functionName: "getAllPolicies",
  });

  const { data: weatherIdPolicies } = useScaffoldReadContract({
    contractName: "WeatherIdAgency",
    functionName: "getAllPolicies",
  });

  // Process contract data
  const allPolicies = [
    ...(minTempPolicies || []).map(policy => ({
      ...policy,
      type: "temperature" as const,
      contractName: "MinTempAgency" as const,
    })),
    ...(weatherIdPolicies || []).map(policy => ({
      ...policy,
      type: "weather-event" as const,
      contractName: "WeatherIdAgency" as const,
    })),
  ];

  // Calculate statistics
  const stats = {
    totalPolicies: allPolicies.length,
    activePolicies: allPolicies.filter(p => Number(p.status) === 1).length, // Open policies
    totalCoverage: allPolicies.reduce((sum, p) => sum + Number(formatEther(p.coverage || 0n)), 0).toFixed(1),
    totalPremiums: allPolicies.reduce((sum, p) => sum + Number(formatEther(p.premium || 0n)), 0).toFixed(2),
    claimsSettled: allPolicies.filter(p => Number(p.status) === 2).length, // Settled policies
    successRate:
      allPolicies.length > 0
        ? Math.round((allPolicies.filter(p => Number(p.status) === 2).length / allPolicies.length) * 100)
        : 0,
  };

  // Recent activity from policies
  const recentActivity = allPolicies.slice(0, 3).map((policy, index) => ({
    id: index + 1,
    type:
      Number(policy.status) === 0
        ? "policy_created"
        : Number(policy.status) === 1
          ? "policy_claimed"
          : "policy_settled",
    description: `${policy.type === "temperature" ? "Temperature" : "Weather event"} policy for ${
      policy.latitude && policy.longitude
        ? `${Number(policy.latitude) / 1_000_000}, ${Number(policy.longitude) / 1_000_000}`
        : "location"
    }`,
    amount: `${formatEther(policy.coverage || 0n)} USDC`,
    time: "Recently",
    status: Number(policy.status) === 0 ? "pending" : Number(policy.status) === 1 ? "active" : "settled",
  }));

  // Mock weather alerts (these would come from a weather service in production)
  const weatherAlerts = [
    {
      location: "New York, NY",
      condition: "Heavy Snow Expected",
      severity: "high" as const,
      affectedPolicies: allPolicies.filter(
        p => Math.abs(Number(p.latitude) - 40774000) < 100000 && Math.abs(Number(p.longitude) + 73962000) < 100000,
      ).length,
    },
    {
      location: "Miami, FL",
      condition: "Storm Warning",
      severity: "medium" as const,
      affectedPolicies: allPolicies.filter(
        p => Math.abs(Number(p.latitude) - 25761700) < 100000 && Math.abs(Number(p.longitude) + 80191800) < 100000,
      ).length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-primary-content">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Welcome to WeatherShield</h1>
            <p className="text-primary-content/80 mb-4">
              Demonstrating decentralised weather insurance powered by Flare Network
            </p>
            {connectedAddress && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Connected as:</span>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Link href="/create-policy" className="btn btn-accent">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Policy
            </Link>
            <Link href="/insurance-market" className="btn btn-outline btn-accent">
              Browse Market
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dashboard-stats">
        <div className="bg-base-100 rounded-xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Policies</p>
              <p className="text-2xl font-bold text-base-content">{stats.totalPolicies}</p>
            </div>
            <DocumentTextIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="mt-3 text-sm text-success">
            <span className="flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              {stats.activePolicies} active
            </span>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Coverage</p>
              <p className="text-2xl font-bold text-base-content">{stats.totalCoverage} USDC</p>
            </div>
            <ShieldCheckIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="mt-3 text-sm text-info">
            <span>{stats.claimsSettled} claims settled</span>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Premiums</p>
              <p className="text-2xl font-bold text-base-content">{stats.totalPremiums} USDC</p>
            </div>
            <CurrencyDollarIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="mt-3 text-sm text-success">
            <span>Paid by policy holders</span>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-base-content">{stats.successRate}%</p>
            </div>
            <BanknotesIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="mt-3 text-sm text-warning">
            <span>Based on settled claims</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-base-100 rounded-xl border border-base-300">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold text-base-content">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.status === "pending"
                            ? "bg-warning"
                            : activity.status === "active"
                              ? "bg-info"
                              : "bg-success"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-base-content">{activity.description}</p>
                        <p className="text-xs text-base-content/60">{activity.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-base-content">{activity.amount}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-base-content/60 text-sm">No recent activity</p>
                  <p className="text-base-content/50 text-xs">Create your first policy to get started</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link href="/my-policies" className="btn btn-outline btn-sm w-full">
                View All Activity
              </Link>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="bg-base-100 rounded-xl border border-base-300">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold text-base-content">Weather Alerts</h2>
            <p className="text-sm text-base-content/60 mt-1">Conditions affecting your policies</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {weatherAlerts.map((alert, index) => (
                <div key={index} className="border border-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-base-content">{alert.location}</h3>
                    <span
                      className={`badge badge-sm ${
                        alert.severity === "high"
                          ? "badge-error"
                          : alert.severity === "medium"
                            ? "badge-warning"
                            : "badge-info"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">{alert.condition}</p>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-4 h-4 text-base-content/50" />
                    <span className="text-xs text-base-content/60">{alert.affectedPolicies} policies affected</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/analytics" className="btn btn-outline btn-sm w-full">
                View Weather Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h2 className="text-xl font-semibold text-base-content mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/create-policy"
            className="p-4 border border-dashed border-base-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <CloudIcon className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium text-base-content">Create New Policy</h3>
                <p className="text-sm text-base-content/60">Start weather protection</p>
              </div>
            </div>
          </Link>

          <Link
            href="/insurance-market"
            className="p-4 border border-dashed border-base-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium text-base-content">Provide Insurance</h3>
                <p className="text-sm text-base-content/60">Earn by covering risks</p>
              </div>
            </div>
          </Link>

          <Link
            href="/debug"
            className="p-4 border border-dashed border-base-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium text-base-content">Debug Contracts</h3>
                <p className="text-sm text-base-content/60">Test contract interactions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
