"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedEgg } from "./AnimatedEgg";
import { ArrowRight, BookOpen } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-egg-400/20 text-xs font-mono text-egg-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-egg-400 animate-pulse" />
                Independent experimental lab
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6"
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
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                Read notes
              </Link>
              <a
                href="https://github.com/sapsaeta/eggthropic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-slate-400" />
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
                { value: "4", label: "Experiments" },
                { value: "4", label: "Notes" },
                { value: "100%", label: "Documented" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
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
                className="absolute top-8 -left-16 glass rounded-lg px-3 py-2 text-xs font-mono text-egg-300 border border-egg-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                claude-code
              </motion.div>
              <motion.div
                className="absolute top-24 -right-20 glass rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 border border-cyan-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                mcp-server
              </motion.div>
              <motion.div
                className="absolute bottom-20 -left-20 glass rounded-lg px-3 py-2 text-xs font-mono text-fuchsia-300 border border-fuchsia-400/20"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
              >
                agent-skill
              </motion.div>
              <motion.div
                className="absolute bottom-8 -right-12 glass rounded-lg px-3 py-2 text-xs font-mono text-violet-300 border border-violet-400/20"
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
