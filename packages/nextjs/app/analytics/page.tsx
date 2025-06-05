"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import {
  ArchiveBoxIcon,
  ChartBarIcon,
  ClockIcon,
  CubeIcon,
  DocumentMagnifyingGlassIcon,
  LightBulbIcon,
  MapIcon,
  ServerIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

/* eslint-disable react/jsx-no-comment-textnodes */

const AnalyticsPage: NextPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Weather Insurance Analytics</h1>
        <p className="text-base-content/60">
          Build comprehensive analytics with real-time event indexing and data visualization
        </p>
      </div>

      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-info/10 to-primary/10 rounded-xl border border-info/20 p-6">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="w-8 h-8 text-info mt-1" />
          <div>
            <h2 className="text-xl font-bold text-base-content mb-2">🔍 Event Indexing with Ponder.sh</h2>
            <p className="text-base-content/80 mb-3">
              Transform your weather insurance platform with powerful analytics! Use Ponder.sh to index blockchain
              events and create real-time dashboards that provide deep insights into policy performance and market
              trends.
            </p>
            <div className="bg-info/10 rounded-lg p-4">
              <h3 className="font-semibold text-info mb-2">💡 Why Ponder.sh?</h3>
              <p className="text-sm text-base-content/70">
                Ponder is a backend framework for crypto apps that syncs and serves user data. Perfect for building
                analytics dashboards that need to track complex blockchain events across multiple contracts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Monitoring */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ClockIcon className="w-6 h-6 text-success" />
            <h3 className="text-lg font-semibold text-base-content">Real-time Monitoring</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-success/10 rounded-lg p-4">
              <h4 className="font-medium text-success mb-2">Live Policy Events</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Track policy creation, claims, and settlements in real-time across both contracts.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• PolicyCreated events from both agencies</p>
                <p>• PolicyClaimed events with insurer details</p>
                <p>• PolicySettled events with payout amounts</p>
                <p>• Policy expiration and retirement tracking</p>
              </div>
            </div>

            <div className="bg-info/10 rounded-lg p-4">
              <h4 className="font-medium text-info mb-2">Market Activity Feed</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Create a live feed of all market activities with detailed transaction data.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Real-time updates using WebSockets</p>
                <p>• Transaction hash linking for verification</p>
                <p>• User-friendly event descriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Analysis */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ChartBarIcon className="w-6 h-6 text-warning" />
            <h3 className="text-lg font-semibold text-base-content">Historical Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-warning/10 rounded-lg p-4">
              <h4 className="font-medium text-warning mb-2">Market Trends</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Analyze policy creation patterns, coverage amounts, and premium trends over time.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Daily/weekly/monthly policy volume</p>
                <p>• Average premium and coverage trends</p>
                <p>• Geographic distribution of policies</p>
                <p>• Seasonal weather insurance patterns</p>
              </div>
            </div>

            <div className="bg-error/10 rounded-lg p-4">
              <h4 className="font-medium text-error mb-2">Risk Analytics</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Calculate risk scores, claim frequencies, and profitability metrics.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Claim settlement ratios by region</p>
                <p>• Weather condition correlation analysis</p>
                <p>• Insurer performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Insights */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapIcon className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-base-content">Geographic Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Heat Maps</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Visualize policy density and claim frequency across different geographical regions.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Policy concentration by coordinates</p>
                <p>• Claim hotspots identification</p>
                <p>• Risk assessment by location</p>
              </div>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-medium text-accent mb-2">Weather Correlation</h4>
              <p className="text-sm text-base-content/70 mb-3">
                Combine policy data with weather APIs to predict future risks.
              </p>
              <div className="text-xs text-base-content/60 space-y-1">
                <p>• Historical weather vs claims</p>
                <p>• Predictive risk modeling</p>
                <p>• Climate change impact analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ponder.sh Implementation Guide */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ServerIcon className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-base-content">Ponder.sh Implementation Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-3">Step 1: Setup & Configuration</h4>
              <div className="space-y-2 text-sm text-base-content/70">
                <div className="bg-base-200 rounded p-2 font-mono text-xs">
                  <p>npm create ponder@latest</p>
                  <p>cd your-analytics-app</p>
                  <p>npm install</p>
                </div>
                <p>
                  Configure your contracts in <code className="bg-base-200 px-1 rounded">ponder.config.ts</code>:
                </p>
                <div className="bg-base-200 rounded p-2 font-mono text-xs">
                  <p>contracts: &#123;</p>
                  <p>&nbsp;&nbsp;MinTempAgency: &#123;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;address: &quot;0x...&quot;,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;abi: MinTempAgencyAbi,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;startBlock: 123456</p>
                  <p>&nbsp;&nbsp;&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h4 className="font-semibold text-secondary mb-3">Step 2: Event Handlers</h4>
              <div className="space-y-2 text-sm text-base-content/70">
                <p>Create handlers for each contract event:</p>
                <div className="bg-base-200 rounded p-2 font-mono text-xs">
                  <p>// src/MinTempAgency.ts</p>
                  <p>
                    ponder.on(&quot;MinTempAgency:PolicyCreated&quot;, async (&#123; event, context &#125;) =&gt; &#123;
                  </p>
                  <p>&nbsp;&nbsp;await context.db.Policy.create(&#123;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;id: event.args.id,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;type: &quot;temperature&quot;,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;// ... other fields</p>
                  <p>&nbsp;&nbsp;&#125;);</p>
                  <p>&#125;);</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-semibold text-accent mb-3">Step 3: Database Schema</h4>
              <div className="space-y-2 text-sm text-base-content/70">
                <p>
                  Define your analytics schema in <code className="bg-base-200 px-1 rounded">ponder.schema.ts</code>:
                </p>
                <div className="bg-base-200 rounded p-2 font-mono text-xs">
                  <p>export const Policy = createTable(&#123;</p>
                  <p>&nbsp;&nbsp;id: bigint(),</p>
                  <p>&nbsp;&nbsp;type: text(),</p>
                  <p>&nbsp;&nbsp;holder: hex(),</p>
                  <p>&nbsp;&nbsp;latitude: bigint(),</p>
                  <p>&nbsp;&nbsp;longitude: bigint(),</p>
                  <p>&nbsp;&nbsp;premium: bigint(),</p>
                  <p>&nbsp;&nbsp;coverage: bigint(),</p>
                  <p>&nbsp;&nbsp;status: text(),</p>
                  <p>&nbsp;&nbsp;createdAt: timestamp()</p>
                  <p>&#125;);</p>
                </div>
              </div>
            </div>

            <div className="bg-success/10 rounded-lg p-4">
              <h4 className="font-semibold text-success mb-3">Step 4: API & Frontend</h4>
              <div className="space-y-2 text-sm text-base-content/70">
                <p>Query your indexed data via GraphQL:</p>
                <div className="bg-base-200 rounded p-2 font-mono text-xs">
                  <p>query &#123;</p>
                  <p>&nbsp;&nbsp;policies(orderBy: &#123; createdAt: desc &#125;) &#123;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;id, type, premium, status</p>
                  <p>&nbsp;&nbsp;&#125;</p>
                  <p>&#125;</p>
                </div>
                <p>Integrate with your React components using GraphQL client</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Analytics Dashboard */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">📊 Analytics Dashboard Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <DocumentMagnifyingGlassIcon className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">2,847</p>
            <p className="text-sm text-base-content/60">Total Events Indexed</p>
          </div>
          <div className="bg-info/10 rounded-lg p-4 text-center">
            <ArchiveBoxIcon className="w-8 h-8 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-info">156</p>
            <p className="text-sm text-base-content/60">Active Policies</p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 text-center">
            <MapIcon className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">23</p>
            <p className="text-sm text-base-content/60">Cities Covered</p>
          </div>
          <div className="bg-error/10 rounded-lg p-4 text-center">
            <SparklesIcon className="w-8 h-8 text-error mx-auto mb-2" />
            <p className="text-2xl font-bold text-error">89.2%</p>
            <p className="text-sm text-base-content/60">Claim Success Rate</p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm text-base-content/70">
            <strong>💡 Build Challenge:</strong> Create a comprehensive analytics dashboard using Ponder.sh to index and
            visualize your weather insurance data. Build real-time charts, geographic heat maps, and predictive
            analytics that help users make informed decisions about risk and coverage.
          </p>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-xl font-semibold text-base-content mb-4">🚀 Advanced Analytics Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Machine Learning Integration</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Predict claim likelihood using historical data</li>
                <li>• Dynamic pricing based on risk analysis</li>
                <li>• Weather pattern recognition for proactive alerts</li>
                <li>• Fraud detection algorithms</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-medium text-accent mb-2">Real-time Notifications</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• WebSocket connections for live updates</li>
                <li>• Push notifications for weather alerts</li>
                <li>• Email/SMS integration for claim settlements</li>
                <li>• Slack/Discord bot for community updates</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-info/10 rounded-lg p-4">
              <h4 className="font-medium text-info mb-2">Data Visualization</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Interactive charts with Chart.js/D3.js</li>
                <li>• Geographic maps with Mapbox/Leaflet</li>
                <li>• Time-series analysis dashboards</li>
                <li>• Custom reporting tools</li>
              </ul>
            </div>

            <div className="bg-success/10 rounded-lg p-4">
              <h4 className="font-medium text-success mb-2">API & Integrations</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• RESTful API for external integrations</li>
                <li>• Weather API connections (OpenWeather, etc.)</li>
                <li>• Export data to CSV/JSON formats</li>
                <li>• Third-party analytics platform connections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-gradient-to-r from-info/10 to-secondary/10 rounded-xl border border-info/20 p-6">
        <h3 className="text-xl font-semibold text-base-content mb-4">📚 Learning Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-base-content mb-3">Ponder.sh Resources:</h4>
            <ul className="text-sm text-base-content/70 space-y-2">
              <li>
                •{" "}
                <Link href="https://ponder.sh" className="text-primary hover:underline">
                  Ponder.sh Official Docs
                </Link>{" "}
                - Complete framework documentation
              </li>
              <li>
                •{" "}
                <Link href="https://github.com/ponder-sh/ponder" className="text-primary hover:underline">
                  GitHub Repository
                </Link>{" "}
                - Source code and examples
              </li>
              <li>
                •{" "}
                <Link href="https://ponder.sh/docs/getting-started" className="text-primary hover:underline">
                  Getting Started Guide
                </Link>{" "}
                - Step-by-step tutorial
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-base-content mb-3">Analytics & Visualization:</h4>
            <ul className="text-sm text-base-content/70 space-y-2">
              <li>• Chart.js / Recharts for React charts</li>
              <li>• D3.js for advanced data visualization</li>
              <li>• Mapbox for geographic visualizations</li>
              <li>• GraphQL for efficient data querying</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-base-100 rounded-xl border border-base-300 p-8">
        <h3 className="text-2xl font-bold text-base-content mb-4">Ready to Build Analytics? 📈</h3>
        <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
          Your weather insurance contracts are generating valuable data. Use Ponder.sh to unlock insights that will help
          users make better decisions and improve the overall platform experience!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="https://ponder.sh" className="btn btn-primary">
            <CubeIcon className="w-5 h-5 mr-2" />
            Start with Ponder.sh
          </Link>
          <Link href="/debug" className="btn btn-outline">
            Debug Contracts
          </Link>
          <Link href="/my-policies" className="btn btn-ghost">
            View Test Data
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
