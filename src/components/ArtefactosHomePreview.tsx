import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artefactos } from "@/lib/artifacts";

export function ArtefactosHomePreview() {
  const destacados = artefactos.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {destacados.map((a) => (
        <Link
          key={a.slug}
          href={`/artefactos/${a.slug}`}
          className="glass glass-hover rounded-xl overflow-hidden flex flex-col group"
        >
          <div className="relative h-40 overflow-hidden border-b border-paper-line bg-[#f4eee2]">
            <iframe
              src={`/artifacts/${a.slug}.html`}
              title={`Vista previa de ${a.titulo}`}
              loading="lazy"
              sandbox="allow-scripts"
              tabIndex={-1}
              aria-hidden
              className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
              style={{ width: "220%", height: "220%", transform: "scale(0.45)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c2620]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="text-sm font-semibold text-ink group-hover:text-teja transition-colors leading-snug">
              {a.titulo}
            </h3>
            <p className="text-xs text-ink-faint leading-relaxed flex-1 line-clamp-2">
              {a.descripcion}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-teja mt-1">
              Abrir
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
