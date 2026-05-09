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

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle outer ring */}
      {isHero && (
        <motion.div
          className="absolute rounded-full border border-egg-400/15"
          style={{ width: size * 1.1, height: size * 1.1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbit dot */}
          <div
            className="absolute bg-egg-400 rounded-full"
            style={{
              width: 5,
              height: 5,
              top: "50%",
              left: -2.5,
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
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="40%" stopColor="#4338ca" />
            <stop offset="80%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1c52" />
          </radialGradient>
          <radialGradient id="eggGloss" cx="35%" cy="30%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="eggShadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="rgba(55,48,163,0.2)"
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
            stroke="rgba(167,139,250,0.4)"
            strokeWidth="0.8"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <line x1="20" y1="70" x2="36" y2="70" />
            <line x1="36" y1="70" x2="36" y2="78" />
            <circle cx="20" cy="70" r="1.5" fill="rgba(167,139,250,0.6)" />
            <line x1="64" y1="58" x2="80" y2="58" />
            <line x1="64" y1="58" x2="64" y2="66" />
            <circle cx="80" cy="58" r="1.5" fill="rgba(167,139,250,0.6)" />
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
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
            }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </div>
  );
}
