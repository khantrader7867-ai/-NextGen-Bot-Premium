import React from 'react';

interface CyborgGoldLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const CyborgGoldLogo: React.FC<CyborgGoldLogoProps> = ({
  size = 'md',
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', svg: 32 },
    md: { container: 'w-10 h-10', svg: 40 },
    lg: { container: 'w-14 h-14', svg: 56 },
    xl: { container: 'w-20 h-20', svg: 80 },
  }[size];

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 select-none ${
        sizeMap.container
      } ${
        glow
          ? 'drop-shadow-[0_0_12px_rgba(6,182,212,0.45)] drop-shadow-[0_0_16px_rgba(245,158,11,0.35)]'
          : ''
      } ${className}`}
      title="NextGen Premium Trading Shield"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Cyber Shield Outer Gold Gradient */}
          <linearGradient id="shieldGoldGrad" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Electric Neon-Cyan Accent Gradient */}
          <linearGradient id="neonCyanGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Deep Navy/Charcoal Glassmorphism Body */}
          <linearGradient id="shieldBodyGrad" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0e1a2e" />
            <stop offset="45%" stopColor="#091220" />
            <stop offset="100%" stopColor="#040812" />
          </linearGradient>

          {/* Bullish Breakout Candlestick Glow Gradient */}
          <linearGradient id="bullCandleGrad" x1="28" y1="20" x2="36" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Inner Glow Filter */}
          <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Outer Halo */}
        <path
          d="M32 4L54 12V28C54 42.5 44.5 53.5 32 60C19.5 53.5 10 42.5 10 28V12L32 4Z"
          fill="none"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          filter="url(#badgeGlow)"
        />

        {/* Outer Shield Bevel Contour (Cyber/Trading Shield) */}
        <path
          d="M32 6L52 13.5V28C52 41.2 43.2 51.5 32 57.5C20.8 51.5 12 41.2 12 28V13.5L32 6Z"
          fill="url(#shieldBodyGrad)"
          stroke="url(#shieldGoldGrad)"
          strokeWidth="2"
        />

        {/* Inner Facet / Glass Inset Contour with Neon-Cyan Accent */}
        <path
          d="M32 10L48 16V28C48 39 40.5 47.8 32 53C23.5 47.8 16 39 16 28V16L32 10Z"
          fill="#060c18"
          fillOpacity="0.85"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1"
          strokeDasharray="18 2 4 2"
        />

        {/* Micro Cyber Circuit Tracks */}
        <line x1="20" y1="20" x2="26" y2="20" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="20" cy="20" r="1.2" fill="#22d3ee" />
        <line x1="44" y1="20" x2="38" y2="20" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="44" cy="20" r="1.2" fill="#22d3ee" />

        {/* Geometric Golden Chevron Wings */}
        <path
          d="M22 28L32 34L42 28"
          stroke="url(#shieldGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 34L32 38L39 34"
          stroke="url(#shieldGoldGrad)"
          strokeWidth="1.4"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central High-Tech Trading Candlestick & Pulse Vector */}
        {/* Upper Wick */}
        <line x1="32" y1="14" x2="32" y2="21" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" />
        {/* Candle Body */}
        <rect
          x="28.5"
          y="21"
          width="7"
          height="12"
          rx="1.5"
          fill="url(#bullCandleGrad)"
          stroke="#38bdf8"
          strokeWidth="0.8"
        />
        {/* Lower Wick */}
        <line x1="32" y1="33" x2="32" y2="39" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />

        {/* Upward Bullish Strike Arrow Accent */}
        <path
          d="M32 14L28.5 19H35.5L32 14Z"
          fill="#38bdf8"
          filter="url(#badgeGlow)"
        />

        {/* Top Apex Gold Tech Diamond */}
        <polygon points="32,7 35,10 32,13 29,10" fill="url(#shieldGoldGrad)" />

        {/* Subtle Glass Light Glint Reflex */}
        <path
          d="M16 16L32 10L40 13C29 18 20 28 17 38L16 28V16Z"
          fill="#ffffff"
          fillOpacity="0.08"
        />
      </svg>
    </div>
  );
};

export const TradingBadgeLogo = CyborgGoldLogo;
