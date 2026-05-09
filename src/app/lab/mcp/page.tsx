import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MCPExplainer from "@/components/MCPExplainer";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "MCP Visual Explainer — Lab",
  description:
    "An interactive visual explainer for the Model Context Protocol — architecture diagram, primitives reference, and live JSON-RPC message trace, all in your browser.",
  alternates: { canonical: "https://www.eggthropic.com/lab/mcp" },
  openGraph: {
    title: "MCP Visual Explainer — Eggthropic Lab",
    description:
      "An interactive visual explainer for the Model Context Protocol — architecture diagram, primitives reference, and live JSON-RPC message trace, all in your browser.",
    url: "https://www.eggthropic.com/lab/mcp",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Visual Explainer — Eggthropic Lab",
    description:
      "An interactive visual explainer for the Model Context Protocol — architecture diagram, primitives reference, and live JSON-RPC message trace, all in your browser.",
  },
};

export default function MCPLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Eggthropic", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "MCP Visual Explainer", url: "https://www.eggthropic.com/lab/mcp" },
        ]}
      />

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
            Experiment · MCP
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono">
            interactive
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
          MCP Visual Explainer
        </h1>
        <p className="text-zinc-600 max-w-2xl leading-relaxed">
          An interactive diagram tool that maps how an MCP server, client, and host communicate.
          Explore the architecture, the three core primitives (Tools, Resources, Prompts),
          and a live JSON-RPC 2.0 message trace — all without leaving the browser.
        </p>
        <div className="mt-4">
          <Link
            href="/experiments/mcp-visual-explainer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Read the full experiment write-up
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Explainer */}
      <MCPExplainer />

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-200 flex items-center justify-between">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lab experiments
        </Link>
        <Link
          href="/experiments/mcp-visual-explainer"
          className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Full write-up
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
