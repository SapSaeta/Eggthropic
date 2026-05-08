import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";
import SapHrShell from "@/components/SapHrLab/SapHrShell";

export const metadata: Metadata = {
  title: "SAP HR Functional AI Assistant — Lab | Eggthropic",
  description:
    "Interactive demo of an AI assistant for SAP HR On-Premise functional teams. Simulate infotype lookups, process flows, and payroll readiness checks — plus a live Claude API tab backed by an embedded knowledge base.",
  alternates: { canonical: "https://www.eggthropic.com/lab/sap-hr" },
  openGraph: {
    title: "SAP HR Functional AI Assistant — Eggthropic Lab",
    description:
      "Interactive demo of an AI assistant for SAP HR On-Premise functional teams. Simulate infotype lookups, process flows, and payroll readiness checks.",
    url: "https://www.eggthropic.com/lab/sap-hr",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP HR Functional AI Assistant — Eggthropic Lab",
    description:
      "Interactive demo of an AI assistant for SAP HR On-Premise functional teams.",
  },
};

export default function SapHrLabPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "SAP HR Assistant", url: "https://www.eggthropic.com/lab/sap-hr" },
        ]}
      />

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Enterprise AI
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono">
            in-progress · prototype
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          SAP HR Functional AI Assistant
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          An AI assistant for SAP HR On-Premise functional teams — answering infotype questions,
          process flow queries, and payroll readiness checks using a structured Notion knowledge base
          as context.{" "}
          <span className="text-slate-500">
            No SAP system connection. No ABAP generation. Just functional knowledge, made queryable.
          </span>
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {["Claude API", "Notion KB", "SAP HCM", "Streaming"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive shell */}
      <SapHrShell />

      {/* What this is / is not */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-emerald-400/10">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
            What this is
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "A Claude-powered functional knowledge assistant",
              "Backed by a curated Notion knowledge base (infotypes, processes, terms)",
              "Answers questions in plain language using structured context",
              "Explicit about what it doesn't know",
              "Educational prototype — not a production system",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-xl p-5 border border-rose-400/10">
          <p className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-3">
            What this is not
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "Not connected to a live SAP system",
              "Not an ABAP code generator",
              "Not an autonomous SAP agent",
              "Not Anthropic's product — an independent experiment",
              "Not a replacement for a qualified SAP functional consultant",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical note */}
      <div className="mt-8 glass rounded-xl p-5 border border-white/8">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
          How the live tab works
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Each predefined case includes a curated subset of the knowledge base (infotype definitions,
          field lists, process flows) assembled as structured text context. When you click{" "}
          <span className="font-mono text-slate-300">Ask Claude</span>, a POST request goes to{" "}
          <span className="font-mono text-slate-300">/api/sap-hr</span>, which calls the Anthropic
          API with that context as the system prompt. Claude reasons over the provided knowledge only —
          it is explicitly instructed not to invent field names or configuration values.
          Response streams back token by token.
        </p>
      </div>

      {/* Footer nav */}
      <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap gap-3">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lab experiments
        </Link>
        <div className="flex flex-wrap gap-2 ml-auto">
          {[
            { label: "Execution Lab", href: "/lab/execution" },
            { label: "MCP Lab", href: "/lab/mcp" },
            { label: "Skills Lab", href: "/lab/skills" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg glass border border-white/8 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-white/16 transition-all"
            >
              {link.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
