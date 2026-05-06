import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, Lightbulb, Wrench } from "lucide-react";
import { BreadcrumbListJsonLd, ArticleJsonLd } from "@/components/JsonLd";
import { notes, getNoteBySlug } from "@/lib/notes";
import { getExperimentBySlug } from "@/lib/experiments";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  const url = `https://www.eggthropic.com/notes/${slug}`;
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: url },
    openGraph: {
      title: note.title,
      description: note.summary,
      url,
      siteName: "Eggthropic",
      type: "article",
      publishedTime: note.date,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.summary,
    },
  };
}

const categoryColors: Record<string, string> = {
  "Claude Code": "text-violet-400",
  "Agent Skills": "text-fuchsia-400",
  MCP: "text-cyan-400",
  Workflows: "text-amber-400",
  "Claude Design": "text-rose-400",
};

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const catColor = categoryColors[note.category] ?? "text-slate-400";
  const pageUrl = `https://www.eggthropic.com/notes/${slug}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Eggthropic", url: "https://www.eggthropic.com" },
          { name: "Notes", url: "https://www.eggthropic.com/notes" },
          { name: note.title, url: pageUrl },
        ]}
      />
      <ArticleJsonLd
        title={note.title}
        description={note.summary}
        url={pageUrl}
        datePublished={note.date}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link
          href="/notes"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Notes
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate">{note.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-mono font-medium ${catColor}`}>
            {note.category}
          </span>
          <time className="text-xs font-mono text-slate-500">
            {formatDate(note.date)}
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {note.title}
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">{note.summary}</p>
      </div>

      {/* Content */}
      <div className="space-y-10">
        <NoteSection title="What changed">
          <p className="text-slate-300 leading-relaxed">{note.whatChanged}</p>
        </NoteSection>

        <NoteSection title="Why it matters">
          <p className="text-slate-300 leading-relaxed">{note.whyItMatters}</p>
        </NoteSection>

        <NoteSection title="What can be built" icon={<Wrench className="w-4 h-4 text-egg-400/70" />}>
          <ul className="space-y-2.5">
            {note.whatCanBeBuilt.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-egg-400/70 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </NoteSection>

        <NoteSection title="Limitations &amp; risks" icon={<AlertTriangle className="w-4 h-4 text-amber-400/70" />}>
          <ul className="space-y-2.5">
            {note.limitationsOrRisks.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </NoteSection>

        {note.references.length > 0 && (
          <NoteSection title="References">
            <ul className="space-y-2">
              {note.references.map((ref, i) => (
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
          </NoteSection>
        )}
      </div>

      {/* Related experiments */}
      {note.relatedExperiments && note.relatedExperiments.length > 0 && (
        <div className="mt-10 glass rounded-xl p-5 border border-egg-400/10">
          <h2 className="text-xs font-mono tracking-widest text-egg-400/70 uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-egg-400/30" />
            Related experiments
          </h2>
          <ul className="space-y-2">
            {note.relatedExperiments.map((expSlug) => {
              const exp = getExperimentBySlug(expSlug);
              if (!exp) return null;
              return (
                <li key={expSlug}>
                  <Link
                    href={`/experiments/${expSlug}`}
                    className="flex items-center gap-1.5 text-sm text-lab-100 hover:text-egg-300 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    {exp.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Back */}
      <div className="mt-12 pt-8 border-t border-white/5">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all notes
        </Link>
      </div>
    </div>
  );
}

function NoteSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
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
