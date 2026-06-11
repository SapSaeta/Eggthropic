"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { AnimatedEgg } from "./AnimatedEgg";
import { EggClickable } from "./EggClickable";
import { ArrowRight, BookOpen } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

interface HeroProps {
  experimentCount: number;
  noteCount: number;
}

export function Hero({ experimentCount, noteCount }: HeroProps) {
  // Foco suave que sigue al cursor
  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const sx = useSpring(mx, { stiffness: 120, damping: 25 });
  const sy = useSpring(my, { stiffness: 120, damping: 25 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgba(255, 224, 77, 0.06), transparent 70%)`;

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      onMouseMove={onMouseMove}
    >
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-egg-400/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-lab-200/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-egg-400/20 text-xs font-mono text-egg-600 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-egg-400 animate-pulse" />
                Laboratorio experimental independiente
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.08] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Un laboratorio práctico para
              <br />
              <span className="gradient-text">aprender Claude</span>
              <br />
              construyendo
              <br />
              experimentos reales.
            </motion.h1>

            <motion.p
              className="text-ink-soft text-lg leading-relaxed mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
            >
              Eggthropic explora Claude Code, Agent Skills, servidores MCP,
              patrones de API y experimentos de UX — todo documentado con
              honestidad: qué funciona, qué falla y qué viene después.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/experiments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-ink font-semibold text-sm hover:bg-egg-300 transition-colors"
              >
                Explorar experimentos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-paper-line text-ink text-sm font-medium hover:border-teja/50 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-ink-soft" />
                Leer las notas
              </Link>
              <a
                href="https://github.com/sapsaeta/eggthropic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-paper-line text-ink text-sm font-medium hover:border-teja/50 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-ink-soft" />
                GitHub
              </a>
            </motion.div>

            {/* Stat row */}
            <motion.div
              className="mt-10 flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                { value: String(experimentCount), label: "Experimentos" },
                { value: String(noteCount), label: "Notas" },
                { value: "100%", label: "Documentado" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-ink">
                    {stat.value}
                  </div>
                  <div className="text-xs text-ink-faint mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Egg visual */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative">
              <EggClickable>
                <AnimatedEgg size={320} variant="hero" />
              </EggClickable>

              {/* Floating labels */}
              <motion.div
                className="absolute top-8 -left-16 glass rounded-lg px-3 py-2 text-xs font-mono text-egg-600 border border-egg-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                claude-code
              </motion.div>
              <motion.div
                className="absolute top-24 -right-20 glass rounded-lg px-3 py-2 text-xs font-mono text-cyan-700 border border-cyan-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                mcp-server
              </motion.div>
              <motion.div
                className="absolute bottom-20 -left-20 glass rounded-lg px-3 py-2 text-xs font-mono text-fuchsia-700 border border-fuchsia-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
              >
                agent-skill
              </motion.div>
              <motion.div
                className="absolute bottom-8 -right-12 glass rounded-lg px-3 py-2 text-xs font-mono text-violet-700 border border-violet-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: 0.8 }}
              >
                api-stream
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
