"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CloudIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon as ChartBarIconSolid,
  CloudIcon as CloudIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  HomeIcon as HomeIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from "@heroicons/react/24/solid";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    description: "Overview and statistics",
  },
  {
    name: "Create Policy",
    href: "/create-policy",
    icon: CloudIcon,
    iconSolid: CloudIconSolid,
    description: "Create weather insurance policies",
  },
  {
    name: "My Policies",
    href: "/my-policies",
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
    description: "View and manage your policies",
  },
  {
    name: "Insurance Market",
    href: "/insurance-market",
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckIconSolid,
    description: "Browse and claim policies",
  },
  {
    name: "Earnings",
    href: "/earnings",
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid,
    description: "Track your insurance earnings",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    description: "Market insights and trends",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
    description: "App preferences and settings",
  },
];

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Side navigation */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-base-300">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CloudIcon className="w-5 h-5 text-primary-content" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-base-content">WeatherShield</span>
                <span className="text-xs text-base-content/60">Insurance dApp</span>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden btn btn-ghost btn-sm">
              ✕
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.iconSolid : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content hover:bg-base-200 hover:text-base-content"
                    }
                  `}
                  onClick={() => {
                    // Close mobile menu when navigation item is clicked
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary-content" : "text-base-content/70"}`} />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className={`text-xs ${isActive ? "text-primary-content/80" : "text-base-content/50"}`}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer section */}
          <div className="px-4 py-4 border-t border-base-300">
            <div className="text-xs text-base-content/50 text-center">
              <p>Built on Flare Network</p>
              <p className="mt-1">Powered by Web2Json Oracles</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
