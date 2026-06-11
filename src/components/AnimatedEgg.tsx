"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedEggProps {
  size?: number;
  className?: string;
  variant?: "hero" | "small" | "glow";
}

const ORBIT_DURATION = 4860; // ms — órbita completa
const RX = 170;
const RY = 55;
const TILT1_DEG = -35; // anillo Claude
const TILT2_DEG = 35; // anillo SAP

// Puntos donde cada elipse cruza el plano del huevo (sy_pantalla = 0),
// precalculados: tanθ = -(RX/RY)·tan(tilt)
const SPLIT = 71.3; // |x| del punto de corte
const SPLIT_Y = 49.93; // |y| del punto de corte

/**
 * Órbitas atómicas con oclusión real: cada anillo se divide en su arco
 * trasero (capa bajo el huevo) y delantero (capa sobre el huevo), y los
 * satélites saltan de capa según su profundidad. Lo que pasa por detrás
 * del huevo, desaparece de verdad.
 */
function AtomOrbit({ size }: { size: number }) {
  const SVG_SIZE = size * 1.1;
  const CX = SVG_SIZE / 2;
  const CY = SVG_SIZE / 2;

  const sat1Ref = useRef<SVGGElement>(null);
  const sat2Ref = useRef<SVGGElement>(null);
  const backContainerRef = useRef<SVGGElement>(null);
  const frontContainerRef = useRef<SVGGElement>(null);
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
      const maxExcursion = Math.sqrt(
        Math.pow(RX * Math.sin(tiltRad), 2) + Math.pow(RY * Math.cos(tiltRad), 2)
      );
      const depth = maxExcursion > 0 ? sy / maxExcursion : 0; // [-1, 1]
      const scale = 0.6 + 0.6 * ((depth + 1) / 2);
      const opacity = 0.45 + 0.55 * ((depth + 1) / 2);
      return { x: CX + sx, y: CY + sy, depth, scale, opacity };
    }

    function place(
      el: SVGGElement,
      p: { x: number; y: number; depth: number; scale: number; opacity: number }
    ) {
      el.setAttribute(
        "transform",
        `translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) scale(${p.scale.toFixed(3)})`
      );
      el.setAttribute("opacity", p.opacity.toFixed(3));
      // Capa según profundidad: detrás del huevo o delante
      const target =
        p.depth < 0 ? backContainerRef.current : frontContainerRef.current;
      if (target && el.parentNode !== target) target.appendChild(el);
    }

    function frame(now: number) {
      const angle1 = ((now - start) / ORBIT_DURATION) * Math.PI * 2;
      const angle2 = angle1 + Math.PI;

      const p1 = getSatProps(angle1, t1Rad);
      const p2 = getSatProps(angle2, t2Rad);

      if (sat1Ref.current) place(sat1Ref.current, p1);
      if (sat2Ref.current) place(sat2Ref.current, p2);

      // Dentro de la capa frontal, el más profundo se pinta encima
      if (
        frontContainerRef.current &&
        sat1Ref.current &&
        sat2Ref.current &&
        sat1Ref.current.parentNode === frontContainerRef.current &&
        sat2Ref.current.parentNode === frontContainerRef.current
      ) {
        if (p1.depth >= p2.depth) {
          frontContainerRef.current.appendChild(sat1Ref.current);
        } else {
          frontContainerRef.current.appendChild(sat2Ref.current);
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [CX, CY]);

  const offset = (SVG_SIZE - size) / 2;
  const svgStyle: React.CSSProperties = {
    position: "absolute",
    top: -offset,
    left: -offset,
    pointerEvents: "none",
  };

  // Arcos: front = mitad que pasa por delante (sweep 1), back = la contraria
  const ring1Front = `M ${SPLIT} ${SPLIT_Y} A ${RX} ${RY} 0 0 1 ${-SPLIT} ${-SPLIT_Y}`;
  const ring1Back = `M ${SPLIT} ${SPLIT_Y} A ${RX} ${RY} 0 0 0 ${-SPLIT} ${-SPLIT_Y}`;
  const ring2Front = `M ${SPLIT} ${-SPLIT_Y} A ${RX} ${RY} 0 0 1 ${-SPLIT} ${SPLIT_Y}`;
  const ring2Back = `M ${SPLIT} ${-SPLIT_Y} A ${RX} ${RY} 0 0 0 ${-SPLIT} ${SPLIT_Y}`;

  return (
    <>
      {/* Capa TRASERA: arcos y satélites que pasan por detrás del huevo */}
      <svg width={SVG_SIZE} height={SVG_SIZE} style={{ ...svgStyle, zIndex: 3 }}>
        <g transform={`translate(${CX},${CY}) rotate(${TILT1_DEG})`}>
          <path d={ring1Back} fill="none" stroke="rgba(217,119,87,0.22)" strokeWidth="1.5" />
        </g>
        <g transform={`translate(${CX},${CY}) rotate(${TILT2_DEG})`}>
          <path d={ring2Back} fill="none" stroke="rgba(10,110,209,0.22)" strokeWidth="1.5" />
        </g>
        <g ref={backContainerRef} />
      </svg>

      {/* Capa DELANTERA: arcos frontales y satélites por delante */}
      <svg width={SVG_SIZE} height={SVG_SIZE} style={{ ...svgStyle, zIndex: 10 }}>
        <defs>
          <filter id="claudeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${CX},${CY}) rotate(${TILT1_DEG})`}>
          <path d={ring1Front} fill="none" stroke="rgba(217,119,87,0.45)" strokeWidth="1.5" />
        </g>
        <g transform={`translate(${CX},${CY}) rotate(${TILT2_DEG})`}>
          <path d={ring2Front} fill="none" stroke="rgba(10,110,209,0.45)" strokeWidth="1.5" />
        </g>

        <g ref={frontContainerRef}>
          {/* Satélite SAP */}
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

          {/* Satélite Claude — la estrella/asterisco de Anthropic en terracota */}
          <g ref={sat1Ref} filter="url(#claudeGlow)">
            <g fill="#D97757">
              {[
                { a: 0, l: 13 },
                { a: 42, l: 10 },
                { a: 80, l: 13 },
                { a: 118, l: 9 },
                { a: 155, l: 12 },
                { a: 200, l: 10 },
                { a: 240, l: 13 },
                { a: 282, l: 9 },
                { a: 320, l: 11 },
              ].map(({ a, l }, i) => (
                <rect
                  key={i}
                  x={-1.9}
                  y={-l}
                  width={3.8}
                  height={l - 1}
                  rx={1.9}
                  transform={`rotate(${a})`}
                />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </>
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
      {/* Halo exterior */}
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

      {/* Órbitas con oclusión (solo hero) */}
      {isHero && <AtomOrbit size={size} />}

      {/* El huevo */}
      <motion.svg
        viewBox="0 0 100 120"
        width={size * 0.65}
        height={size * 0.65 * 1.2}
        style={{ position: "relative", zIndex: 5 }}
        animate={
          isHero ? { y: [0, -8, 0], rotate: [-1, 1, -1] } : { y: [0, -4, 0] }
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
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>

        <ellipse cx="50" cy="63" rx="36" ry="44" fill="url(#eggGrad)" filter="url(#eggShadow)" />
        <ellipse cx="38" cy="46" rx="14" ry="10" fill="url(#eggGloss)" />

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

      {/* Línea de escaneo */}
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
