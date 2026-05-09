"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedEgg } from "./AnimatedEgg";
import { ArrowRight, BookOpen } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

interface HeroProps {
  experimentCount: number;
  noteCount: number;
}

export function Hero({ experimentCount, noteCount }: HeroProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-zinc-200">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-egg-400/30 bg-egg-400/5 text-xs font-mono text-egg-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-egg-400" />
                Independent experimental lab
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              A practical lab for
              <br />
              <span className="gradient-text">learning Claude</span>
              <br />
              by building real
              <br />
              experiments.
            </motion.h1>

            <motion.p
              className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
            >
              Eggthropic explores Claude Code, Agent Skills, MCP servers, API
              patterns, and UX experiments — all documented honestly: what
              works, what fails, and what comes next.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/experiments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors"
              >
                Explore experiments
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 text-sm font-medium hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                Read notes
              </Link>
              <a
                href="https://github.com/sapsaeta/eggthropic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 text-sm font-medium hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-zinc-400" />
                GitHub
              </a>
            </motion.div>

            {/* Stat row */}
            <motion.div
              className="mt-10 flex gap-8 pt-8 border-t border-zinc-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                { value: String(experimentCount), label: "Experiments" },
                { value: String(noteCount), label: "Notes" },
                { value: "100%", label: "Documented" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold text-zinc-900"
                    style={{ fontFamily: "var(--font-playfair, serif)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 font-mono">
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
              <AnimatedEgg size={320} variant="hero" />

              {/* Floating labels */}
              <motion.div
                className="absolute top-8 -left-16 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-egg-400 shadow-sm"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                claude-code
              </motion.div>
              <motion.div
                className="absolute top-24 -right-20 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-cyan-600 shadow-sm"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                mcp-server
              </motion.div>
              <motion.div
                className="absolute bottom-20 -left-20 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-fuchsia-600 shadow-sm"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
              >
                agent-skill
              </motion.div>
              <motion.div
                className="absolute bottom-8 -right-12 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-violet-600 shadow-sm"
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
