import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentsClient } from "@/components/ExperimentsClient";
import { experiments } from "@/lib/experiments";
import type { ExperimentCategory } from "@/types";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "All Eggthropic experiments — Claude Code, Agent Skills, MCP, and UX/UI. Every experiment documents the goal, prompt, what worked, and what failed.",
  alternates: { canonical: "https://www.eggthropic.com/experiments" },
};

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ExperimentsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const validCategories: Array<"all" | ExperimentCategory> = [
    "all", "claude-code", "skills", "mcp", "api", "ux-ui", "automation",
  ];
  const initialCategory = validCategories.includes(category as ExperimentCategory)
    ? (category as "all" | ExperimentCategory)
    : "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Experiments"
        title="What we've built and documented"
        description="Every experiment includes the goal, context, tools used, prompts, implementation notes, results, and honest failure analysis."
      />
      <ExperimentsClient experiments={experiments} initialCategory={initialCategory} />
    </div>
  );
}
