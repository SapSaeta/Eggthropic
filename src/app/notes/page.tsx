import type { Metadata } from "next";
import { NoteCard } from "@/components/NoteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short articles on Claude and Anthropic updates — what changed, why it matters, what can be built, and what the limitations are.",
  alternates: { canonical: "https://www.eggthropic.com/notes" },
  openGraph: {
    title: "Notes — Eggthropic",
    description:
      "Short articles on Claude and Anthropic updates — what changed, why it matters, what can be built, and what the limitations are.",
    url: "https://www.eggthropic.com/notes",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes — Eggthropic",
    description:
      "Short articles on Claude and Anthropic updates — what changed, why it matters, what can be built, and what the limitations are.",
  },
};

export default function NotesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        as="h1"
        label="Notes"
        title="Anthropic updates, decoded"
        description="Short, practical articles on Claude and Anthropic developments. Each note covers what changed, why it matters to developers, what can be built with it, and what limitations or risks to watch for."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, i) => (
          <NoteCard key={note.slug} note={note} index={i} />
        ))}
      </div>

      <div className="mt-12 glass rounded-xl p-6 text-center">
        <p className="text-sm text-slate-400">
          Notes are published as meaningful Anthropic and Claude updates happen.
          <br />
          Content is based on official sources — no speculation, no invented features.
        </p>
      </div>
    </div>
  );
}
