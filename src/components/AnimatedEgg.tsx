"use client";

import { motion } from "framer-motion";

interface AnimatedEggProps {
  size?: number;
  className?: string;
  variant?: "hero" | "small" | "glow";
}

export function AnimatedEgg({
  size = 200,
  className = "",
  variant = "hero",
}: AnimatedEggProps) {
  const isHero = variant === "hero";
  const isGlow = variant === "glow";

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      {(isHero || isGlow) && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.4,
            height: size * 1.4,
            background:
              "radial-gradient(circle, rgba(255,210,26,0.08) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Mid ring */}
      {isHero && (
        <motion.div
          className="absolute rounded-full border border-egg-400/20"
          style={{ width: size * 1.1, height: size * 1.1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbit dot */}
          <div
            className="absolute bg-egg-400 rounded-full"
            style={{
              width: 6,
              height: 6,
              top: "50%",
              left: -3,
              transform: "translateY(-50%)",
            }}
          />
        </motion.div>
      )}

      {/* Egg SVG */}
      <motion.svg
        viewBox="0 0 100 120"
        width={size * 0.65}
        height={size * 0.65 * 1.2}
        animate={
          isHero
            ? { y: [0, -8, 0], rotate: [-1, 1, -1] }
            : { y: [0, -4, 0] }
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="eggGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff5b3" />
            <stop offset="40%" stopColor="#ffd21a" />
            <stop offset="80%" stopColor="#b38d00" />
            <stop offset="100%" stopColor="#4d3c00" />
          </radialGradient>
          <radialGradient id="eggGloss" cx="35%" cy="30%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="eggShadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="rgba(0,0,0,0.4)"
            />
          </filter>
        </defs>

        {/* Egg body */}
        <ellipse
          cx="50"
          cy="63"
          rx="36"
          ry="44"
          fill="url(#eggGrad)"
          filter="url(#eggShadow)"
        />

        {/* Gloss highlight */}
        <ellipse cx="38" cy="46" rx="14" ry="10" fill="url(#eggGloss)" />

        {/* Circuit line decoration */}
        {isHero && (
          <motion.g
            stroke="rgba(255,210,26,0.3)"
            strokeWidth="0.8"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <line x1="20" y1="70" x2="36" y2="70" />
            <line x1="36" y1="70" x2="36" y2="78" />
            <circle cx="20" cy="70" r="1.5" fill="rgba(255,210,26,0.5)" />
            <line x1="64" y1="58" x2="80" y2="58" />
            <line x1="64" y1="58" x2="64" y2="66" />
            <circle cx="80" cy="58" r="1.5" fill="rgba(255,210,26,0.5)" />
          </motion.g>
        )}
      </motion.svg>

      {/* Scan line effect */}
      {isHero && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
          style={{ width: size, height: size }}
        >
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,210,26,0.4), transparent)",
            }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </div>
  );
}
