"use client";

import React, { useState } from "react";
import { SideNavigation } from "./SideNavigation";
import { WeatherHeader } from "./WeatherHeader";

interface WeatherLayoutProps {
  children: React.ReactNode;
}

export const WeatherLayout: React.FC<WeatherLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Side Navigation */}
      <SideNavigation isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <WeatherHeader onMenuToggle={handleMenuToggle} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
