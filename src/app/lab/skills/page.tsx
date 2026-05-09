import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SkillsExplainer from "@/components/SkillsExplainer";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Agent Skills Visual Explainer — Lab",
  description:
    "An interactive explainer for Claude Agent Skills — file structure, SKILL.md anatomy, and a live invocation trace showing how skills work end to end.",
  alternates: { canonical: "https://www.eggthropic.com/lab/skills" },
  openGraph: {
    title: "Agent Skills Visual Explainer — Eggthropic Lab",
    description:
      "An interactive explainer for Claude Agent Skills — file structure, SKILL.md anatomy, and a live invocation trace showing how skills work end to end.",
    url: "https://www.eggthropic.com/lab/skills",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Skills Visual Explainer — Eggthropic Lab",
    description:
      "An interactive explainer for Claude Agent Skills — file structure, SKILL.md anatomy, and a live invocation trace showing how skills work end to end.",
  },
};

export default function SkillsLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Eggthropic", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "Agent Skills Explainer", url: "https://www.eggthropic.com/lab/skills" },
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
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Agent Skills
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-[10px] font-mono">
            interactive
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
          Agent Skills Explainer
        </h1>
        <p className="text-zinc-600 max-w-2xl leading-relaxed">
          Agent Skills are directories containing a SKILL.md file that give Claude persistent,
          reusable capabilities — invocable as slash commands in Claude Code. Explore how they
          are structured, what each frontmatter field does, and trace a full invocation from
          <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-700 text-sm font-mono">/pr-describe</code>
          to a generated PR description.
        </p>
        <div className="mt-4">
          <Link
            href="/experiments/first-custom-agent-skill"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-egg-400 hover:text-egg-400 transition-colors"
          >
            Read the full experiment write-up
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Explainer */}
      <SkillsExplainer />

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
          href="/experiments/first-custom-agent-skill"
          className="inline-flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-400 transition-colors"
        >
          Full write-up
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
