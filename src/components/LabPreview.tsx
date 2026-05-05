"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FlaskConical, GitPullRequest, ArrowRight } from "lucide-react";

export function LabPreview() {
  return (
    <motion.div
      className="glass rounded-2xl p-8 text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50 rounded-2xl" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-lab-200/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-lab-500/30 border border-lab-300/20 flex items-center justify-center">
            <FlaskConical className="w-7 h-7 text-lab-100" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-xs font-mono mb-4">
          Coming soon
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">
          Community Lab
        </h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Soon: a controlled public lab where contributors can propose
          Claude-powered experiments through GitHub pull requests.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
            <GitPullRequest className="w-4 h-4 text-slate-400" />
            Submit via PR
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
            <FlaskConical className="w-4 h-4 text-slate-400" />
            Sandboxed environment
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Learn more about the lab
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
