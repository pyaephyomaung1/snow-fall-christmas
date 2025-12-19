"use client";

import React from "react";

type TwinkleLightsProps = {
  count?: number;              // number of bulbs
  height?: number;             // vertical space from top
  colors?: string[];           // Tailwind color classes
  zIndex?: number;
  wireOpacity?: number;        // 0–1
};

export default function TwinkleLights({
  count = 24,
  height = 48,
  colors = [
    "bg-red-500",
    "bg-yellow-400",
    "bg-emerald-400",
    "bg-blue-400",
  ],
  zIndex = 30,
  wireOpacity = 0.25,
}: TwinkleLightsProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ height, zIndex }}
      aria-hidden
    >
      {/* wire */}

      {/* bulbs */}
      <div className="relative flex justify-center gap-6 h-full">
        {Array.from({ length: count }).map((_, i) => {
          const color = colors[i % colors.length];

          return (
            <div
              key={i}
              className="relative"
              style={{ marginTop: i % 2 === 0 ? 10 : 18 }}
            >
              {/* hanging wire */}
              <div
                className="absolute -top-6 left-1/2 w-px h-6"
                style={{ backgroundColor: `rgba(255,255,255,${wireOpacity})` }}
              />

              {/* bulb */}
              <div
                className={`w-3 h-3 rounded-full ${color} animate-twinkle`}
                style={{
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-twinkle {
          animation: twinkle 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}