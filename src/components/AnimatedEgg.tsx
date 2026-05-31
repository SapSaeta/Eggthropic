"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedEggProps {
  size?: number;
  className?: string;
  variant?: "hero" | "small" | "glow";
}

const ORBIT_DURATION = 4860; // ms — full orbit
const RX = 170;
const RY = 55;
const TILT1_DEG = -35; // Claude ring
const TILT2_DEG = 35;  // SAP ring

function AtomOrbit({ size }: { size: number }) {
  const SVG_SIZE = size * 1.1;
  const CX = SVG_SIZE / 2;
  const CY = SVG_SIZE / 2;

  const sat1Ref = useRef<SVGGElement>(null);
  const sat2Ref = useRef<SVGGElement>(null);
  const satContainerRef = useRef<SVGGElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const t1Rad = (TILT1_DEG * Math.PI) / 180;
    const t2Rad = (TILT2_DEG * Math.PI) / 180;
    const start = performance.now();

    function getSatProps(angle: number, tiltRad: number) {
      const rawX = RX * Math.cos(angle);
      const rawY = RY * Math.sin(angle);
      const sx = rawX * Math.cos(tiltRad) - rawY * Math.sin(tiltRad);
      const sy = rawX * Math.sin(tiltRad) + rawY * Math.cos(tiltRad);
      // depth: higher sy (lower on screen) = in front
      const maxExcursion = Math.sqrt(
        Math.pow(RX * Math.sin(tiltRad), 2) + Math.pow(RY * Math.cos(tiltRad), 2)
      );
      const depth = maxExcursion > 0 ? sy / maxExcursion : 0; // [-1, 1]
      const scale = 0.6 + 0.6 * ((depth + 1) / 2); // [0.6, 1.2]
      const opacity = 0.45 + 0.55 * ((depth + 1) / 2); // [0.45, 1.0]
      return { x: CX + sx, y: CY + sy, depth, scale, opacity };
    }

    function frame(now: number) {
      const angle1 = ((now - start) / ORBIT_DURATION) * Math.PI * 2;
      const angle2 = angle1 + Math.PI;

      const p1 = getSatProps(angle1, t1Rad);
      const p2 = getSatProps(angle2, t2Rad);

      if (sat1Ref.current) {
        sat1Ref.current.setAttribute(
          "transform",
          `translate(${p1.x.toFixed(2)},${p1.y.toFixed(2)}) scale(${p1.scale.toFixed(3)})`
        );
        sat1Ref.current.setAttribute("opacity", p1.opacity.toFixed(3));
      }
      if (sat2Ref.current) {
        sat2Ref.current.setAttribute(
          "transform",
          `translate(${p2.x.toFixed(2)},${p2.y.toFixed(2)}) scale(${p2.scale.toFixed(3)})`
        );
        sat2Ref.current.setAttribute("opacity", p2.opacity.toFixed(3));
      }

      // Z-ordering: the satellite more "in front" (higher depth) renders last = on top
      if (satContainerRef.current && sat1Ref.current && sat2Ref.current) {
        if (p1.depth >= p2.depth) {
          satContainerRef.current.appendChild(sat1Ref.current);
        } else {
          satContainerRef.current.appendChild(sat2Ref.current);
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [CX, CY]);

  const offset = (SVG_SIZE - size) / 2;

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      style={{
        position: "absolute",
        top: -offset,
        left: -offset,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter id="claudeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sapGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ring 1 — Claude, tilted -35° */}
      <g transform={`translate(${CX},${CY}) rotate(${TILT1_DEG})`}>
        <ellipse
          cx={0}
          cy={0}
          rx={RX}
          ry={RY}
          fill="none"
          stroke="rgba(217,100,66,0.4)"
          strokeWidth="1.5"
        />
      </g>

      {/* Ring 2 — SAP, tilted +35° */}
      <g transform={`translate(${CX},${CY}) rotate(${TILT2_DEG})`}>
        <ellipse
          cx={0}
          cy={0}
          rx={RX}
          ry={RY}
          fill="none"
          stroke="rgba(0,112,242,0.4)"
          strokeWidth="1.5"
        />
      </g>

      {/* Satellites — order controlled by rAF loop */}
      <g ref={satContainerRef}>
        {/* SAP satellite */}
        <g ref={sat2Ref}>
          <circle r={14} fill="#0070F2" filter="url(#sapGlow)" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontFamily="Arial Black, Arial, sans-serif"
            fontWeight="900"
            fontSize="7"
          >
            SAP
          </text>
        </g>

        {/* Claude satellite — Anthropic sunburst mark */}
        <g ref={sat1Ref} filter="url(#claudeGlow)">
          <circle r={14} fill="#1a0f0a" stroke="#D96442" strokeWidth="1.5" />
          {/* 12-ray sunburst, scaled to fit inside r=12 */}
          <g fill="#D96442">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x={-1.3}
                y={-11.5}
                width={2.6}
                height={6.5}
                rx={1.3}
                transform={`rotate(${i * 30})`}
              />
            ))}
            <circle cx={0} cy={0} r={3.5} />
          </g>
        </g>
      </g>
    </svg>
  );
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

      {/* Dual-ring atom orbit (hero only) */}
      {isHero && <AtomOrbit size={size} />}

      {/* Egg SVG */}
      <motion.svg
        viewBox="0 0 100 120"
        width={size * 0.65}
        height={size * 0.65 * 1.2}
        style={{ position: "relative", zIndex: 5 }}
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
