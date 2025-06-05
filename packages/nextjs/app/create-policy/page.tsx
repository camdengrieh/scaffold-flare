"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { parseUnits } from "viem";
import {
  CalendarIcon,
  CloudIcon,
  CurrencyDollarIcon,
  FireIcon,
  InformationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { USDCInput } from "~~/components/scaffold-eth/Input";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type PolicyType = "temperature" | "weather-event";

interface PolicyForm {
  type: PolicyType;
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
  premium: string;
  coverage: string;
  // Temperature specific
  minTemperature?: string;
  // Weather event specific
  weatherIdThreshold?: string;
}

const CreatePolicy: NextPage = () => {
  const router = useRouter();
  const [policyForm, setPolicyForm] = useState<PolicyForm>({
    type: "temperature",
    latitude: "",
    longitude: "",
    startDate: "",
    endDate: "",
    premium: "",
    coverage: "",
    minTemperature: "",
    weatherIdThreshold: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart contract write hooks
  const { writeContractAsync: writeMinTempContract } = useScaffoldWriteContract("MinTempAgency");
  const { writeContractAsync: writeWeatherIdContract } = useScaffoldWriteContract("WeatherIdAgency");

  const weatherIdOptions = [
    { value: "200", label: "Thunderstorms (200-299)", description: "Severe weather conditions" },
    { value: "300", label: "Drizzle (300-399)", description: "Light precipitation" },
    { value: "500", label: "Rain (500-599)", description: "Moderate to heavy rain" },
    { value: "600", label: "Snow (600-699)", description: "Snow conditions" },
    { value: "700", label: "Atmosphere (700-799)", description: "Fog, dust, haze" },
    { value: "801", label: "Clouds (801-804)", description: "Cloudy conditions" },
  ];

  const handleInputChange = (field: keyof PolicyForm, value: string) => {
    setPolicyForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!policyForm.latitude || !policyForm.longitude) {
      return "Please provide latitude and longitude coordinates";
    }
    if (!policyForm.startDate || !policyForm.endDate) {
      return "Please select start and end dates";
    }
    if (!policyForm.premium || parseFloat(policyForm.premium) <= 0) {
      return "Please enter a valid premium amount";
    }
    if (!policyForm.coverage || parseFloat(policyForm.coverage) <= 0) {
      return "Please enter a valid coverage amount";
    }
    if (parseFloat(policyForm.premium) >= parseFloat(policyForm.coverage)) {
      return "Coverage amount must be greater than premium";
    }
    if (policyForm.type === "temperature" && (!policyForm.minTemperature || policyForm.minTemperature === "")) {
      return "Please enter a minimum temperature threshold";
    }
    if (policyForm.type === "weather-event" && !policyForm.weatherIdThreshold) {
      return "Please select a weather event type";
    }

    const startDate = new Date(policyForm.startDate);
    const endDate = new Date(policyForm.endDate);
    if (startDate >= endDate) {
      return "End date must be after start date";
    }
    if (startDate < new Date()) {
      return "Start date cannot be in the past";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert coordinates to the required format (multiply by 10^6)
      const latitudeFormatted = Math.round(parseFloat(policyForm.latitude) * 1_000_000);
      const longitudeFormatted = Math.round(parseFloat(policyForm.longitude) * 1_000_000);

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(policyForm.startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(policyForm.endDate).getTime() / 1000);

      // Convert USDC amounts to proper units (6 decimals)
      const premiumUnits = parseUnits(policyForm.premium, 6);
      const coverageUnits = parseUnits(policyForm.coverage, 6);

      console.log("USDC amounts:", {
        premium: policyForm.premium,
        premiumUnits: premiumUnits.toString(),
        coverage: policyForm.coverage,
        coverageUnits: coverageUnits.toString(),
      });

      if (policyForm.type === "temperature") {
        // Convert temperature to contract format (multiply by 10^6)
        const minTempFormatted = Math.round(parseFloat(policyForm.minTemperature || "0") * 1_000_000);

        console.log("Creating MinTemp Policy:", {
          latitude: latitudeFormatted,
          longitude: longitudeFormatted,
          startTimestamp,
          endTimestamp,
          minTempThreshold: minTempFormatted,
          coverage: coverageUnits.toString(),
          premium: premiumUnits.toString(),
        });

        await writeMinTempContract({
          functionName: "createPolicy",
          args: [
            BigInt(latitudeFormatted),
            BigInt(longitudeFormatted),
            BigInt(startTimestamp),
            BigInt(endTimestamp),
            BigInt(minTempFormatted),
            premiumUnits,
            coverageUnits,
          ],
        });
      } else {
        console.log("Creating WeatherEvent Policy:", {
          latitude: latitudeFormatted,
          longitude: longitudeFormatted,
          startTimestamp,
          endTimestamp,
          weatherIdThreshold: parseInt(policyForm.weatherIdThreshold || "200"),
          coverage: coverageUnits.toString(),
          premium: premiumUnits.toString(),
        });

        await writeWeatherIdContract({
          functionName: "createPolicy",
          args: [
            BigInt(latitudeFormatted),
            BigInt(longitudeFormatted),
            BigInt(startTimestamp),
            BigInt(endTimestamp),
            BigInt(parseInt(policyForm.weatherIdThreshold || "200")),
            premiumUnits,
            coverageUnits,
          ],
        });
      }

      // Success - redirect to my policies page
      alert("Policy created successfully! Your policy is now available for insurers to claim.");
      router.push("/my-policies");
    } catch (error) {
      console.error("Error creating policy:", error);
      alert("Failed to create policy. Please check your wallet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">Create Weather Insurance Policy</h1>
          <p className="text-base-content/60">
            Create a policy and set your coverage terms. Insurers can then claim your policy to provide coverage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Policy Type Selection */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Policy Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange("type", "temperature")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  policyForm.type === "temperature"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-base-300 bg-base-200 text-base-content hover:border-primary/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FireIcon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Temperature Insurance</div>
                    <div className="text-sm opacity-70">Covers extreme cold temperatures</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange("type", "weather-event")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  policyForm.type === "weather-event"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-base-300 bg-base-200 text-base-content hover:border-primary/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CloudIcon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Weather Event Insurance</div>
                    <div className="text-sm opacity-70">Covers storms, rain, snow, etc.</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPinIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={policyForm.latitude}
                  onChange={e => handleInputChange("latitude", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={policyForm.longitude}
                  onChange={e => handleInputChange("longitude", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="-74.0060"
                />
              </div>
            </div>
            <p className="text-sm text-base-content/60 mt-2">
              Specify the exact coordinates where the weather conditions will be monitored
            </p>
          </div>

          {/* Time Period */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Coverage Period</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={policyForm.startDate}
                  onChange={e => handleInputChange("startDate", e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={policyForm.endDate}
                  onChange={e => handleInputChange("endDate", e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          {policyForm.type === "temperature" ? (
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FireIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-base-content">Temperature Conditions</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Minimum Temperature Threshold (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={policyForm.minTemperature}
                  onChange={e => handleInputChange("minTemperature", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="0"
                />
                <p className="text-sm text-base-content/60 mt-1">
                  Policy pays out if the minimum temperature drops below this threshold
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CloudIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-base-content">Weather Event Conditions</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Weather Event Type</label>
                <select
                  value={policyForm.weatherIdThreshold}
                  onChange={e => handleInputChange("weatherIdThreshold", e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select weather condition...</option>
                  {weatherIdOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-base-content/60 mt-1">
                  Policy pays out when this type of weather event occurs at the specified location
                </p>
              </div>
            </div>
          )}

          {/* Financial Terms */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CurrencyDollarIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Financial Terms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Premium (USDC)</label>
                <USDCInput
                  value={policyForm.premium}
                  onChange={(value: string) => handleInputChange("premium", value)}
                  placeholder="100"
                />
                <p className="text-sm text-base-content/60 mt-1">Amount you pay upfront for coverage</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Coverage Amount (USDC)</label>
                <USDCInput
                  value={policyForm.coverage}
                  onChange={(value: string) => handleInputChange("coverage", value)}
                  placeholder="1000"
                />
                <p className="text-sm text-base-content/60 mt-1">Amount you receive if conditions are met</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-warning/10 rounded-lg">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="w-5 h-5 text-warning mt-0.5" />
                <div className="text-sm text-warning">
                  <p className="font-medium">Note:</p>
                  <p>
                    The premium will be paid immediately when creating the policy. The coverage amount represents the
                    maximum payout you can receive if the weather conditions are met.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary and Submit */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Policy Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Type:</span>
                  <span className="font-medium text-base-content">
                    {policyForm.type === "temperature" ? "Temperature Insurance" : "Weather Event Insurance"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Location:</span>
                  <span className="font-medium text-base-content">
                    {policyForm.latitude && policyForm.longitude
                      ? `${policyForm.latitude}, ${policyForm.longitude}`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Premium:</span>
                  <span className="font-medium text-base-content">{policyForm.premium || "0"} USDC</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Coverage:</span>
                  <span className="font-medium text-base-content">{policyForm.coverage || "0"} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Duration:</span>
                  <span className="font-medium text-base-content">
                    {policyForm.startDate && policyForm.endDate
                      ? `${Math.ceil((new Date(policyForm.endDate).getTime() - new Date(policyForm.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Condition:</span>
                  <span className="font-medium text-base-content">
                    {policyForm.type === "temperature"
                      ? `< ${policyForm.minTemperature || "0"}°C`
                      : weatherIdOptions.find(opt => opt.value === policyForm.weatherIdThreshold)?.label || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Policy...
                </>
              ) : (
                "Create Policy"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePolicy;
