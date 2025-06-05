"use client";

import React, { useState } from "react";
import { WalkthroughMode, useWalkthrough } from "./WalkthroughContext";
import { CodeBracketIcon, PlayIcon, QuestionMarkCircleIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const WalkthroughTrigger: React.FC = () => {
  const { startWalkthrough, isActive } = useWalkthrough();
  const [showModal, setShowModal] = useState(false);

  const handleStartWalkthrough = (mode: WalkthroughMode) => {
    startWalkthrough(mode);
    setShowModal(false);
  };

  // Don't show trigger if walkthrough is already active
  if (isActive) return null;

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg z-30 hover:shadow-xl transition-all duration-200"
        aria-label="Start walkthrough"
      >
        <QuestionMarkCircleIcon className="w-6 h-6" />
      </button>

      {/* Mode Selection Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-300">
                <h2 className="text-xl font-bold text-base-content">Welcome to Weather Insurance! 🌦️</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-base-content/80 mb-6">
                  Let us show you around! Choose your tour based on your interest level:
                </p>

                <div className="space-y-4">
                  {/* User Tour */}
                  <button
                    onClick={() => handleStartWalkthrough("user")}
                    className="w-full p-6 bg-base-200 hover:bg-primary/10 border border-base-300 hover:border-primary/30 rounded-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <UserIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base-content mb-2">User Tour</h3>
                        <p className="text-sm text-base-content/70 mb-3">
                          Perfect for newcomers! Learn how to create policies, provide insurance, and earn returns with
                          our decentralised weather insurance platform.
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium">
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Start User Tour (7 steps)
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Developer Tour */}
                  <button
                    onClick={() => handleStartWalkthrough("developer")}
                    className="w-full p-6 bg-base-200 hover:bg-primary/10 border border-base-300 hover:border-primary/30 rounded-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <CodeBracketIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base-content mb-2">Developer Tour</h3>
                        <p className="text-sm text-base-content/70 mb-3">
                          Dive deep into the technical implementation! Explore smart contracts, Web2Json oracles, DeFi
                          integrations, and analytics with Ponder.sh.
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium">
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Start Developer Tour (7 steps)
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-6 p-4 bg-info/10 rounded-lg">
                  <p className="text-sm text-info">
                    💡 <strong>Tip:</strong> You can skip or close the tour at any time. The tour will guide you through
                    the interface with interactive highlights and explanations.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 pt-0">
                <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
