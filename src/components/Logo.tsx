import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center bg-white rounded-[24%] shadow-[0_12px_30px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full p-[12%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradTop" x1="140" y1="120" x2="380" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="gradMid" x1="180" y1="210" x2="340" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#84CC16" />
          </linearGradient>
          <linearGradient id="gradStem" x1="140" y1="120" x2="220" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Stem */}
        <path
          d="M 148 175 C 148 135 180 125 220 125 L 220 350 C 220 375 195 390 172 390 C 152 390 148 370 148 350 Z"
          fill="url(#gradStem)"
        />

        {/* Top Swoop */}
        <path
          d="M 180 125 C 220 125 350 125 370 125 C 382 125 388 138 378 150 C 340 195 280 200 220 200 L 180 200 Z"
          fill="url(#gradTop)"
        />

        {/* Middle Swoop */}
        <path
          d="M 180 216 C 240 216 330 216 345 216 C 352 216 355 225 348 232 C 310 270 250 280 180 300 Z"
          fill="url(#gradMid)"
        />
      </svg>
    </div>
  );
};
