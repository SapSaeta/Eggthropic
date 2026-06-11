"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Intensidad del tilt en grados (default 8) */
  intensity?: number;
  /** Color del brillo que sigue al cursor */
  glowColor?: string;
}

/**
 * Tarjeta con tilt 3D y un brillo que sigue al cursor.
 * Hace que cualquier tarjeta sea divertida de tocar.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  glowColor = "rgba(255, 224, 77, 0.10)",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 18,
  });
  const glowX = useTransform(px, (v) => `${(v * 100).toFixed(1)}%`);
  const glowY = useTransform(py, (v) => `${(v * 100).toFixed(1)}%`);
  const glow = useMotionTemplate`radial-gradient(280px circle at ${glowX} ${glowY}, ${glowColor}, transparent 65%)`;

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative will-change-transform ${className ?? ""}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      {children}
    </motion.div>
  );
}
