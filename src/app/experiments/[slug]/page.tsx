import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, FlaskConical } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ToolBadge } from "@/components/ToolBadge";
import { BreadcrumbListJsonLd, ExperimentJsonLd } from "@/components/JsonLd";
import { experiments, getExperimentBySlug } from "@/lib/experiments";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperimentBySlug(slug);
  if (!exp) return {};
  const url = `https://www.eggthropic.com/experiments/${slug}`;
  return {
    title: exp.title,
    description: exp.description,
    alternates: { canonical: url },
    openGraph: {
      title: exp.title,
      description: exp.description,
      url,
      siteName: "Eggthropic",
      type: "article",
      publishedTime: exp.date,
    },
    twitter: {
      card: "summary_large_image",
      title: exp.title,
      description: exp.description,
    },
  };
}

const categoryLabel: Record<string, string> = {
  "claude-code": "Claude Code",
  skills: "Agent Skills",
  mcp: "MCP",
  api: "API",
  "ux-ui": "UX/UI",
  automation: "Automation",
  "enterprise-ai": "Enterprise AI",
};

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperimentBySlug(slug);
  if (!exp) notFound();

  const pageUrl = `https://www.eggthropic.com/experiments/${slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Eggthropic", url: "https://www.eggthropic.com" },
          { name: "Experiments", url: "https://www.eggthropic.com/experiments" },
          { name: exp.title, url: pageUrl },
        ]}
      />
      <ExperimentJsonLd
        title={exp.title}
        description={exp.description}
        url={pageUrl}
        datePublished={exp.date}
        tools={exp.tools}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link
          href="/experiments"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Experiments
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate">{exp.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-mono text-slate-500">
            {categoryLabel[exp.category]}
          </span>
          <StatusBadge status={exp.status} />
          <span className="text-xs font-mono text-slate-500 capitalize">
            {exp.difficulty}
          </span>
          <time className="text-xs font-mono text-slate-500 ml-auto">
            {formatDate(exp.date)}
          </time>
        </div>
        {exp.lastVerified && (
          <p className="text-[10px] font-mono text-slate-600 mb-4">
            Content verified {exp.lastVerified} · Eggthropic experiment
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {exp.title}
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">{exp.description}</p>

        <div className="flex flex-wrap gap-2 mt-5">
          {exp.tools.map((tool) => (
            <ToolBadge key={tool} tool={tool} />
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        <Section title="Goal">
          <p className="text-slate-300 leading-relaxed">{exp.goal}</p>
        </Section>

        <Section title="Context">
          <p className="text-slate-300 leading-relaxed">{exp.context}</p>
        </Section>

        {exp.prompt && (
          <Section title="Prompt used">
            <div className="glass rounded-xl p-5 border border-egg-400/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-egg-400/70 uppercase tracking-widest">
                  prompt
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {exp.prompt}
              </p>
            </div>
          </Section>
        )}

        <Section title="Implementation notes">
          <p className="text-slate-300 leading-relaxed">
            {exp.implementationNotes}
          </p>
        </Section>

        <Section title="Result">
          <p className="text-slate-300 leading-relaxed">{exp.result}</p>
        </Section>

        {/* What worked / failed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Section title="What worked">
            <ul className="space-y-2.5">
              {exp.whatWorked.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="What failed">
            <ul className="space-y-2.5">
              {exp.whatFailed.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Next iteration">
          <p className="text-slate-300 leading-relaxed">{exp.nextIteration}</p>
        </Section>

        {/* References */}
        {exp.references.length > 0 && (
          <Section title="References">
            <ul className="space-y-2">
              {exp.references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-lab-100 hover:text-egg-300 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {/* Lab page link */}
      {exp.labPage && (
        <div className="mt-10 glass rounded-xl p-5 border border-egg-400/10">
          <div className="flex items-start gap-3">
            <FlaskConical className="w-5 h-5 text-egg-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-300 mb-2">
                This experiment has an interactive version in the Lab.
              </p>
              <Link
                href={exp.labPage}
                className="inline-flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors font-mono"
              >
                Open interactive lab
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="mt-12 pt-8 border-t border-white/5">
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all experiments
        </Link>
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
      <h2 className="text-xs font-mono tracking-widest text-egg-400/70 uppercase mb-3 flex items-center gap-2">
        <span className="w-4 h-px bg-egg-400/30" />
        {title}
      </h2>
      {children}
    </div>
  );
}
