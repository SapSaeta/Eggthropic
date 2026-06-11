"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useState, type ReactNode } from "react";

const PIOS = ["¡pío!", "¡crac!", "¿hola?", "casi...", "🐣 ¡eclosión!"];
const HATCH_AT = 5;

interface Particle {
  id: number;
  x: number;
  y: number;
  rot: number;
  size: number;
}

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 90 + Math.random() * 110;
    return {
      id: Date.now() + i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      rot: Math.random() * 360,
      size: 6 + Math.random() * 10,
    };
  });
}

/**
 * Envuelve el huevo y lo hace divertido de tocar:
 * cada clic lo hace temblar y suelta un mensaje; al quinto, eclosiona
 * con una lluvia de cáscaras y chispas. Luego vuelve a empezar.
 */
export function EggClickable({ children }: { children: ReactNode }) {
  const [clicks, setClicks] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const controls = useAnimationControls();

  async function onClick() {
    const next = clicks + 1;

    if (next >= HATCH_AT) {
      // Eclosión 🎉
      setClicks(0);
      setBubble(PIOS[HATCH_AT - 1]);
      setParticles(makeParticles(14));
      controls.start({
        scale: [1, 1.18, 0.92, 1.06, 1],
        rotate: [0, -6, 6, -3, 0],
        transition: { duration: 0.7 },
      });
      setTimeout(() => setParticles([]), 1100);
    } else {
      setClicks(next);
      setBubble(PIOS[next - 1] ?? "¡pío!");
      controls.start({
        rotate: [0, -4 - next, 4 + next, -2, 0],
        scale: [1, 1.03, 1],
        transition: { duration: 0.35 },
      });
    }
    setTimeout(() => setBubble(null), 1300);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={controls}
      className="relative cursor-pointer select-none border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-egg-400/50 rounded-full"
      aria-label="Huevo interactivo de Eggthropic — tócalo"
      title="Tócame"
    >
      {children}

      {/* Bocadillo */}
      <AnimatePresence>
        {bubble && (
          <motion.span
            key={bubble + String(clicks)}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-egg-400/30 bg-lab-900/90 px-3 py-1 font-mono text-xs text-egg-300"
          >
            {bubble}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Cáscaras y chispas al eclosionar */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rot, scale: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[2px]"
            style={{
              width: p.size,
              height: p.size,
              background: p.id % 2 === 0 ? "#FFE04D" : "#FCF8EF",
              clipPath:
                p.id % 3 === 0
                  ? "polygon(50% 0%, 100% 100%, 0% 100%)"
                  : undefined,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
