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
      {/* Outer warm glow — large, slow pulse */}
      {isHero && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.5,
            height: size * 1.5,
            background:
              "radial-gradient(circle, rgba(255,210,26,0.10) 0%, rgba(255,180,0,0.05) 40%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Mid glow ring — faster pulse */}
      {isHero && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.15,
            height: size * 1.15,
            background:
              "radial-gradient(circle, rgba(255,224,77,0.12) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      )}

      {/* Orbit ring — slow rotation */}
      {isHero && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.08,
            height: size * 1.08,
            border: "1px dashed rgba(255,210,26,0.25)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Counter-orbit ring — opposite direction */}
      {isHero && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.92,
            height: size * 0.92,
            border: "1px solid rgba(255,180,0,0.12)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbit dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 5,
              height: 5,
              background: "#ffe04d",
              boxShadow: "0 0 6px 2px rgba(255,224,77,0.5)",
              top: "50%",
              right: -2.5,
              transform: "translateY(-50%)",
            }}
          />
        </motion.div>
      )}

      {/* Second orbit dot — larger ring */}
      {isHero && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: size * 1.08, height: size * 1.08 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 4 }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: "#ffd21a",
              boxShadow: "0 0 5px 1px rgba(255,210,26,0.4)",
              bottom: -2,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </motion.div>
      )}

      {/* Egg SVG */}
      <motion.svg
        viewBox="0 0 100 120"
        width={size * 0.62}
        height={size * 0.62 * 1.2}
        animate={
          isHero
            ? { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
            : { y: [0, -5, 0] }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="eggGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="25%" stopColor="#ffe04d" />
            <stop offset="60%" stopColor="#ffd21a" />
            <stop offset="85%" stopColor="#b38d00" />
            <stop offset="100%" stopColor="#4d3c00" />
          </radialGradient>
          <radialGradient id="eggGloss" cx="33%" cy="28%" r="28%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="eggInnerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,240,100,0.3)" />
            <stop offset="100%" stopColor="rgba(255,240,100,0)" />
          </radialGradient>
          <filter id="eggShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="7"
              floodColor="rgba(179,141,0,0.35)"
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

        {/* Inner warmth glow */}
        <ellipse
          cx="50"
          cy="63"
          rx="36"
          ry="44"
          fill="url(#eggInnerGlow)"
        />

        {/* Gloss highlight */}
        <ellipse cx="37" cy="44" rx="13" ry="9" fill="url(#eggGloss)" />

        {/* Small secondary highlight */}
        <ellipse cx="52" cy="37" rx="5" ry="3.5" fill="rgba(255,255,255,0.25)" />

        {/* Circuit line decoration */}
        {isHero && (
          <motion.g
            stroke="rgba(255,210,26,0.35)"
            strokeWidth="0.8"
            fill="none"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="18" y1="68" x2="34" y2="68" />
            <line x1="34" y1="68" x2="34" y2="78" />
            <circle cx="18" cy="68" r="1.5" fill="rgba(255,220,50,0.6)" />
            <circle cx="34" cy="78" r="1.5" fill="rgba(255,220,50,0.5)" />
            <line x1="66" y1="54" x2="82" y2="54" />
            <line x1="66" y1="54" x2="66" y2="64" />
            <circle cx="82" cy="54" r="1.5" fill="rgba(255,220,50,0.6)" />
            <circle cx="66" cy="64" r="1.5" fill="rgba(255,220,50,0.5)" />
          </motion.g>
        )}
      </motion.svg>

      {/* Sparkle particles — only hero */}
      {isHero && (
        <>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4,
              height: 4,
              background: "#ffe04d",
              boxShadow: "0 0 4px 2px rgba(255,224,77,0.4)",
              top: "12%",
              right: "18%",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3,
              height: 3,
              background: "#ffd21a",
              boxShadow: "0 0 4px 2px rgba(255,210,26,0.4)",
              top: "30%",
              left: "10%",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3,
              height: 3,
              background: "#fff5b3",
              boxShadow: "0 0 3px 1px rgba(255,245,179,0.5)",
              bottom: "22%",
              right: "12%",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 2 }}
          />
        </>
      )}
    </div>
  );
}
