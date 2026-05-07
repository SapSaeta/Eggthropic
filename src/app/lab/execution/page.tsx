import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";
import ExecutionShell from "@/components/ExecutionLab/ExecutionShell";

export const metadata: Metadata = {
  title: "Claude Execution Lab — Lab",
  description:
    "An interactive visualization of how a Claude-based agent executes a multi-step task — from analysis through code generation to delivery. Educational experiment by Eggthropic.",
  alternates: { canonical: "https://www.eggthropic.com/lab/execution" },
  openGraph: {
    title: "Claude Execution Lab — Eggthropic",
    description:
      "An interactive visualization of how a Claude-based agent executes a multi-step task — from analysis through code generation to delivery. Educational experiment by Eggthropic.",
    url: "https://www.eggthropic.com/lab/execution",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Execution Lab — Eggthropic",
    description:
      "An interactive visualization of how a Claude-based agent executes a multi-step task — from analysis through code generation to delivery. Educational experiment by Eggthropic.",
  },
};

export default function ExecutionLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "Claude Execution Lab", url: "https://www.eggthropic.com/lab/execution" },
        ]}
      />

      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>

        <div className="flex items-center gap-3 mb-2 mt-6">
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Execution Visualization
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-400/20 text-rose-400 text-[10px] font-mono">
            educational · not official
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Claude Execution Lab</h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          A visual simulation of how a Claude-based agent might break down and execute a multi-step coding task.
          This is an educational experiment by Eggthropic — not an official Anthropic interface, and not a window into Claude&apos;s actual internals.
        </p>
      </div>

      <ExecutionShell />
    </div>
  );
}
