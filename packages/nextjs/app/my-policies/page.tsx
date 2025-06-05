"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CloudIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  FireIcon,
  FunnelIcon,
  MapPinIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type PolicyStatus = "Unclaimed" | "Open" | "Settled";
type PolicyType = "temperature" | "weather-event";

interface ProcessedPolicy {
  id: number;
  type: PolicyType;
  holder: string;
  latitude: number;
  longitude: number;
  startTimestamp: number;
  expirationTimestamp: number;
  premium: string;
  coverage: string;
  status: PolicyStatus;
  // Type-specific fields
  minTempThreshold?: number;
  weatherIdThreshold?: number;
  // Additional metadata
  location?: string;
  contractName: string;
}

const MyPolicies: NextPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
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

  // Helper function to convert status number to PolicyStatus
  const getStatusFromNumber = (statusNum: number): PolicyStatus => {
    switch (statusNum) {
      case 0:
        return "Unclaimed";
      case 1:
        return "Open";
      case 2:
        return "Settled";
      default:
        return "Unclaimed";
    }
  };

  // Process contract data and filter for connected user's policies
  const processedPolicies: ProcessedPolicy[] = [
    ...(minTempPolicies || [])
      .filter(policy => policy.holder.toLowerCase() === connectedAddress?.toLowerCase())
      .map(policy => ({
        id: Number(policy.id),
        type: "temperature" as const,
        holder: policy.holder,
        latitude: Number(policy.latitude),
        longitude: Number(policy.longitude),
        startTimestamp: Number(policy.startTimestamp),
        expirationTimestamp: Number(policy.expirationTimestamp),
        premium: formatEther(policy.premium),
        coverage: formatEther(policy.coverage),
        status: getStatusFromNumber(Number(policy.status)),
        minTempThreshold: "minTempThreshold" in policy ? Number(policy.minTempThreshold) / 1_000_000 : undefined,
        location: getLocationName(Number(policy.latitude), Number(policy.longitude)),
        contractName: "MinTempAgency",
      })),
    ...(weatherIdPolicies || [])
      .filter(policy => policy.holder.toLowerCase() === connectedAddress?.toLowerCase())
      .map(policy => ({
        id: Number(policy.id),
        type: "weather-event" as const,
        holder: policy.holder,
        latitude: Number(policy.latitude),
        longitude: Number(policy.longitude),
        startTimestamp: Number(policy.startTimestamp),
        expirationTimestamp: Number(policy.expirationTimestamp),
        premium: formatEther(policy.premium),
        coverage: formatEther(policy.coverage),
        status: getStatusFromNumber(Number(policy.status)),
        weatherIdThreshold: "weatherIdThreshold" in policy ? Number(policy.weatherIdThreshold) : undefined,
        location: getLocationName(Number(policy.latitude), Number(policy.longitude)),
        contractName: "WeatherIdAgency",
      })),
  ];

  const filteredPolicies = processedPolicies.filter(policy => {
    const statusMatch = selectedFilter === "all" || policy.status.toLowerCase() === selectedFilter;
    const typeMatch = selectedType === "all" || policy.type === selectedType;
    return statusMatch && typeMatch;
  });

  const getStatusBadge = (status: PolicyStatus) => {
    const statusStyles = {
      Unclaimed: "badge-warning",
      Open: "badge-info",
      Settled: "badge-success",
    };
    return statusStyles[status] || "badge-ghost";
  };

  const getStatusIcon = (status: PolicyStatus) => {
    switch (status) {
      case "Unclaimed":
        return <ClockIcon className="w-4 h-4" />;
      case "Open":
        return <EyeIcon className="w-4 h-4" />;
      case "Settled":
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <XCircleIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const isPolicyActive = (policy: ProcessedPolicy) => {
    const now = Date.now() / 1000;
    return now >= policy.startTimestamp && now <= policy.expirationTimestamp;
  };

  const isPolicyExpired = (policy: ProcessedPolicy) => {
    const now = Date.now() / 1000;
    return now > policy.expirationTimestamp;
  };

  if (!connectedAddress) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-base-content mb-2">Connect Your Wallet</h1>
          <p className="text-base-content/60 mb-6">
            Please connect your wallet to view your weather insurance policies
          </p>
          <Link href="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">My Policies</h1>
          <p className="text-base-content/60">Manage your weather insurance policies and track their status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/create-policy" className="btn btn-primary">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Create New Policy
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Policies</p>
              <p className="text-xl font-bold text-base-content">{processedPolicies.length}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Active Policies</p>
              <p className="text-xl font-bold text-base-content">
                {processedPolicies.filter(p => p.status === "Open").length}
              </p>
            </div>
            <EyeIcon className="w-8 h-8 text-info" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Premium Paid</p>
              <p className="text-xl font-bold text-base-content">
                {processedPolicies.reduce((sum, p) => sum + parseFloat(p.premium), 0).toFixed(2)} ETH
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-warning" />
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Claims Settled</p>
              <p className="text-xl font-bold text-base-content">
                {processedPolicies.filter(p => p.status === "Settled").length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-success" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-base-content/60" />
            <span className="text-sm font-medium text-base-content">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Status</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="open">Open</option>
              <option value="settled">Settled</option>
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Types</option>
              <option value="temperature">Temperature</option>
              <option value="weather-event">Weather Event</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.length === 0 ? (
          <div className="bg-base-100 rounded-xl border border-base-300 p-8 text-center">
            <DocumentTextIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">No policies found</h3>
            <p className="text-base-content/60 mb-4">
              {selectedFilter !== "all" || selectedType !== "all"
                ? "Try adjusting your filters to see more policies."
                : "You haven't created any policies yet."}
            </p>
            <Link href="/create-policy" className="btn btn-primary">
              Create Your First Policy
            </Link>
          </div>
        ) : (
          filteredPolicies.map(policy => (
            <div
              key={`${policy.contractName}-${policy.id}`}
              className="bg-base-100 rounded-xl border border-base-300 p-6"
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
                      {getStatusIcon(policy.status)}
                      <span className={`badge ${getStatusBadge(policy.status)}`}>{policy.status}</span>
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

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-base-content/60">
                      <strong>Condition:</strong>{" "}
                      {policy.type === "temperature"
                        ? `Temperature < ${policy.minTempThreshold}°C`
                        : `Weather ID ≥ ${policy.weatherIdThreshold}`}
                    </div>
                    {isPolicyActive(policy) && <span className="badge badge-success badge-sm">Currently Active</span>}
                    {isPolicyExpired(policy) && <span className="badge badge-error badge-sm">Expired</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <div className="flex space-x-2">
                    <button className="btn btn-outline btn-sm">View Details</button>
                    {policy.status === "Open" && <button className="btn btn-primary btn-sm">Monitor</button>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      {filteredPolicies.length > 0 && (
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">Policy Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/create-policy" className="btn btn-outline">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Create New Policy
            </Link>
            <Link href="/insurance-market" className="btn btn-outline">
              <EyeIcon className="w-5 h-5 mr-2" />
              Browse Market
            </Link>
            <Link href="/analytics" className="btn btn-outline">
              <FunnelIcon className="w-5 h-5 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
