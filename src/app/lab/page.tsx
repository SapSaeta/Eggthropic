import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, GitPullRequest, Shield, Cpu, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "The Eggthropic Community Lab — a future controlled space for contributors to propose and run Claude-powered experiments via GitHub pull requests.",
};

const planned = [
  {
    icon: GitPullRequest,
    title: "PR-based submissions",
    description:
      "Propose an experiment by opening a pull request. If accepted, it runs in the controlled lab environment and results are published.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Sandboxed execution",
    description:
      "Experiments run in isolated containers — no access to production systems, no persistent state between runs.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Cpu,
    title: "Claude-powered",
    description:
      "All lab experiments use the Anthropic API with a shared API key — contributors don't need their own key to submit an experiment.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: FlaskConical,
    title: "Documented results",
    description:
      "Every accepted experiment is fully documented using the same format as our own experiments — goal, prompt, result, and honest failure analysis.",
    color: "text-egg-400",
    bg: "bg-egg-400/10",
    border: "border-egg-400/20",
  },
];

export default function LabPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-lab-500/30 border border-lab-300/20 flex items-center justify-center">
            <FlaskConical className="w-8 h-8 text-lab-100" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-xs font-mono mb-5">
          Coming soon
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Community Lab</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Soon: a controlled public lab where contributors can propose
          Claude-powered experiments through GitHub pull requests.
        </p>
      </div>

      {/* Current status */}
      <div className="glass rounded-2xl p-6 mb-10 border border-egg-400/10">
        <h2 className="text-sm font-semibold text-white mb-2">Current status</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The Community Lab is in early design. Before opening contributions, we
          need to establish the submission format, review process, execution
          sandbox, and result publication pipeline. If you're interested in
          contributing to the lab infrastructure itself, open an issue on GitHub.
        </p>
        <div className="mt-4">
          <a
            href="https://github.com/sapsaeta/eggthropic/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            Discuss on GitHub
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Planned features */}
      <h2 className="text-xs font-mono tracking-widest text-egg-400/70 uppercase mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-egg-400/30" />
        Planned features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {planned.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="glass rounded-xl p-5">
              <div
                className={`w-10 h-10 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-slate-500 mb-4">
          In the meantime, explore the experiments we've already published.
        </p>
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors"
        >
          View experiments
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
