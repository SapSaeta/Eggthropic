import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Eggthropic is, why it exists, and who it's for. An independent experimental project documenting real Claude and Anthropic developer workflows.",
  alternates: { canonical: "https://www.eggthropic.com/about" },
  openGraph: {
    title: "About — Eggthropic",
    description:
      "What Eggthropic is, why it exists, and who it's for. An independent experimental project documenting real Claude and Anthropic developer workflows.",
    url: "https://www.eggthropic.com/about",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Eggthropic",
    description:
      "What Eggthropic is, why it exists, and who it's for. An independent experimental project documenting real Claude and Anthropic developer workflows.",
  },
};

const forList = [
  "Developers who want to understand what Claude Code actually does in practice, not just in marketing copy",
  "Engineers evaluating MCP for internal tooling or agent architectures",
  "Builders curious about Agent Skills and how to structure reusable agent capabilities",
  "Anyone interested in honest, documented AI workflow experiments — including failure analysis",
  "People who want to follow Anthropic and Claude developments with a critical, practical lens",
];

const notList = [
  "An Anthropic product, partner, or official resource",
  "A tutorial site with beginner hand-holding",
  "A platform that glosses over failures or pretends every experiment works perfectly",
  "A place for hype, speculation, or invented feature claims",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-egg-400 uppercase mb-3">
          <span className="w-6 h-px bg-egg-400/50" />
          About
          <span className="w-6 h-px bg-egg-400/50" />
        </span>
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">What is Eggthropic?</h1>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Eggthropic is an independent experimental lab for learning Claude by
          building real experiments — and documenting everything, including what
          fails.
        </p>
      </div>

      <div className="space-y-12">
        {/* What it is */}
        <Section title="What we do">
          <p className="text-zinc-700 leading-relaxed mb-4">
            We build experiments using Claude Code, Agent Skills, MCP servers,
            the Anthropic API, and developer UX patterns. Every experiment is
            fully documented: goal, context, tools used, exact prompts,
            implementation notes, results, and an honest analysis of what worked
            and what didn&apos;t.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            We also publish short notes on Anthropic and Claude updates —
            explaining what changed, why it matters to developers, what it
            enables, and what limitations or risks to consider. No speculation.
            No invented features. Everything is based on official sources.
          </p>
        </Section>

        {/* Why it exists */}
        <Section title="Why Eggthropic exists">
          <p className="text-zinc-700 leading-relaxed mb-4">
            The Claude and Anthropic developer ecosystem is evolving quickly.
            Claude Code, Agent Skills, and MCP are each significant tools — but
            understanding them requires hands-on experience, not just reading
            documentation. Eggthropic exists to bridge that gap: taking the
            documentation seriously, building real things, and publishing what
            actually happens.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            The egg motif is a nod to experimentation: an egg is a beginning,
            not a finished product. That&apos;s the right frame for working with
            fast-moving AI developer tools.
          </p>
        </Section>

        {/* Who it's for */}
        <Section title="Who it's for">
          <ul className="space-y-3">
            {forList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-egg-400/70 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* What it is NOT */}
        <Section title="What Eggthropic is not">
          <ul className="space-y-3">
            {notList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center text-rose-400 font-bold text-xs">
                  ×
                </span>
                <span className="text-sm text-zinc-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-5 border border-amber-400/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                Independent project disclaimer
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Eggthropic is an independent experimental project and is not
                affiliated with, endorsed by, sponsored by, or officially
                connected to Anthropic in any way. Claude, Anthropic, Claude
                Code, and related names are trademarks of Anthropic. All
                references to Anthropic products are for educational and
                informational purposes only. Eggthropic does not claim any
                official relationship with Anthropic.
              </p>
            </div>
          </div>
        </div>

        {/* Get involved */}
        <Section title="Get involved">
          <p className="text-zinc-700 leading-relaxed mb-5">
            Eggthropic is open source. If you spot a factual error, want to
            suggest an experiment, or are interested in contributing to the
            upcoming Community Lab, the best place to start is GitHub.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/sapsaeta/eggthropic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-zinc-200 text-sm text-zinc-900 hover:border-zinc-300 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            <Link
              href="/experiments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors"
            >
              Explore experiments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-mono tracking-widest text-egg-400/70 uppercase mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-egg-400/30" />
        {title}
      </h2>
      {children}
    </div>
  );
}
