"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWalkthrough } from "./WalkthroughContext";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  ForwardIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const WalkthroughPopup: React.FC = () => {
  const {
    isActive,
    mode,
    currentStep,
    totalSteps,
    currentStepData,
    nextStep,
    previousStep,
    skipWalkthrough,
    closeWalkthrough,
  } = useWalkthrough();

  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(currentStepData.target);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const position: Position = {
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft,
          width: rect.width,
          height: rect.height,
        };

        setTargetPosition(position);

        // Get actual popup dimensions if available
        const popupElement = popupRef.current;
        const popupWidth = popupElement?.offsetWidth || 400;
        const popupHeight = popupElement?.offsetHeight || 300;
        const offset = 20;

        let popupTop = position.top;
        let popupLeft = position.left;

        switch (currentStepData.position) {
          case "top":
            popupTop = position.top - popupHeight - offset;
            popupLeft = position.left + position.width / 2 - popupWidth / 2;
            break;
          case "bottom":
            popupTop = position.top + position.height + offset;
            popupLeft = position.left + position.width / 2 - popupWidth / 2;
            break;
          case "left":
            popupTop = position.top + position.height / 2 - popupHeight / 2;
            popupLeft = position.left - popupWidth - offset;
            break;
          case "right":
            popupTop = position.top + position.height / 2 - popupHeight / 2;
            popupLeft = position.left + position.width + offset;
            break;
        }

        // Ensure popup stays within viewport with proper margins
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 20;

        // Horizontal bounds checking
        if (popupLeft < margin) {
          popupLeft = margin;
        } else if (popupLeft + popupWidth > viewportWidth - margin) {
          popupLeft = viewportWidth - popupWidth - margin;
        }

        // Vertical bounds checking - this is the key fix
        if (popupTop < margin) {
          // If popup would be above viewport, place it below the target
          popupTop = position.top + position.height + offset;
        }

        if (popupTop + popupHeight > viewportHeight - margin) {
          // If popup would be below viewport, place it above the target
          popupTop = position.top - popupHeight - offset;

          // If still doesn't fit above, place it at the top of viewport
          if (popupTop < margin) {
            popupTop = margin;
          }
        }

        setPopupPosition({ top: popupTop, left: popupLeft });

        // Scroll target into view if needed, but with a delay to ensure popup positioning is complete
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }, 100);
      } else {
        // If target not found, center the popup in viewport
        setTargetPosition(null);
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupElement = popupRef.current;
        const popupWidth = popupElement?.offsetWidth || 400;
        const popupHeight = popupElement?.offsetHeight || 300;

        setPopupPosition({
          top: Math.max(20, (viewportHeight - popupHeight) / 2),
          left: Math.max(20, (viewportWidth - popupWidth) / 2),
        });
      }
    };

    // Initial positioning
    updatePosition();

    // Add event listeners with debouncing
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 10);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("scroll", debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("scroll", debouncedUpdate);
    };
  }, [isActive, currentStepData]);

  if (!isActive || !currentStepData) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={closeWalkthrough} />

      {/* Highlight overlay */}
      {targetPosition && (
        <div
          className="fixed bg-transparent border-4 border-primary rounded-lg z-50 animate-pulse"
          style={{
            top: targetPosition.top - 4,
            left: targetPosition.left - 4,
            width: targetPosition.width + 8,
            height: targetPosition.height + 8,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}

      {/* Walkthrough Popup */}
      <div
        ref={popupRef}
        className="fixed z-50 bg-base-100 rounded-xl border border-base-300 shadow-2xl w-96 max-w-[calc(100vw-2rem)]"
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center space-x-2">
            {mode === "developer" ? (
              <CodeBracketIcon className="w-5 h-5 text-primary" />
            ) : (
              <UserIcon className="w-5 h-5 text-primary" />
            )}
            <span className="text-sm font-medium text-base-content">
              {mode === "developer" ? "Developer" : "User"} Tour
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-base-content/60">
              {currentStep + 1} of {totalSteps}
            </span>
            <button
              onClick={closeWalkthrough}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close walkthrough"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-200 h-1">
          <div
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-base-content mb-3">{currentStepData.title}</h3>
          <p className="text-base-content/80 text-sm leading-relaxed mb-6">{currentStepData.content}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className="btn btn-ghost btn-sm"
                aria-label="Previous step"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={skipWalkthrough} className="btn btn-ghost btn-sm text-base-content/60">
                <ForwardIcon className="w-4 h-4 mr-1" />
                Skip Tour
              </button>

              <button onClick={nextStep} className="btn btn-primary btn-sm">
                {currentStep === totalSteps - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointing to target (optional visual enhancement) */}
        {targetPosition && (
          <div
            className="absolute w-0 h-0 border-8"
            style={{
              ...getArrowStyles(currentStepData.position),
              borderTopColor: currentStepData.position === "bottom" ? "hsl(var(--color-base-100))" : "transparent",
              borderBottomColor: currentStepData.position === "top" ? "hsl(var(--color-base-100))" : "transparent",
              borderLeftColor: currentStepData.position === "right" ? "hsl(var(--color-base-100))" : "transparent",
              borderRightColor: currentStepData.position === "left" ? "hsl(var(--color-base-100))" : "transparent",
            }}
          />
        )}
      </div>
    </>
  );
};

function getArrowStyles(position: string) {
  switch (position) {
    case "top":
      return {
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "bottom":
      return {
        top: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "left":
      return {
        right: "-16px",
        top: "50%",
        transform: "translateY(-50%)",
      };
    case "right":
      return {
        left: "-16px",
        top: "50%",
        transform: "translateY(-50%)",
      };
    default:
      return {};
  }
}
