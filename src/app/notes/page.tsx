import type { Metadata } from "next";
import { NoteCard } from "@/components/NoteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notas",
  description:
    "Artículos cortos sobre las novedades de Claude y Anthropic: qué ha cambiado, por qué importa, qué se puede construir y qué límites tiene.",
  alternates: { canonical: "https://www.eggthropic.com/notes" },
  openGraph: {
    title: "Notas — Eggthropic",
    description:
      "Artículos cortos sobre las novedades de Claude y Anthropic: qué ha cambiado, por qué importa, qué se puede construir y qué límites tiene.",
    url: "https://www.eggthropic.com/notes",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notas — Eggthropic",
    description:
      "Artículos cortos sobre las novedades de Claude y Anthropic: qué ha cambiado, por qué importa, qué se puede construir y qué límites tiene.",
  },
};

export default function NotesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        as="h1"
        label="Notes"
        title="Las novedades de Anthropic, descifradas"
        description="Artículos cortos y prácticos sobre las novedades de Claude y Anthropic. Cada nota cubre qué ha cambiado, por qué le importa a quien desarrolla, qué se puede construir y qué limitaciones o riesgos vigilar."
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
