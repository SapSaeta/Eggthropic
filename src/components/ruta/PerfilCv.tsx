"use client";

import Link from "next/link";
import { ExternalLink, Printer } from "lucide-react";
import { lecciones, nivelConocimiento } from "@/lib/lecciones";
import { pasosHechos } from "@/lib/ruta";
import { fijarPerfil, type RutaState } from "@/lib/ruta-store";
import { calcularTitulo } from "@/lib/titulo-cv";
import { CvDocumento } from "./CvDocumento";
import { TituloCv } from "./TituloCv";

/** Pestaña CV: título según evidencia + hoja de CV imprimible con tus datos. */
export function PerfilCv({ estado }: { estado: RutaState }) {
  const resultado = calcularTitulo(pasosHechos(estado.pasos), estado.base);
  const hechas = lecciones.filter((l) => l.id in estado.hechas).length;
  const nivel = nivelConocimiento((hechas / lecciones.length) * 100);

  return (
    <div className="space-y-8">
      <div className="no-print">
        <TituloCv estado={estado} />
      </div>

      <section>
        <div className="no-print mb-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-teja mb-1">HOJA DE CV</p>
          <p className="text-sm text-ink-soft leading-snug mb-3">Añade tus datos para imprimirla o guardarla en PDF. Se guardan solo en este dispositivo.</p>
          <div className="grid gap-2">
            <input
              value={estado.nombre}
              onChange={(e) => fijarPerfil("nombre", e.target.value)}
              placeholder="Nombre y apellidos"
              className="min-h-12 rounded-xl border border-ink/15 bg-white px-3 text-[16px] text-ink"
              aria-label="Nombre y apellidos"
            />
            <input
              value={estado.contacto}
              onChange={(e) => fijarPerfil("contacto", e.target.value)}
              placeholder="Correo · LinkedIn · ciudad"
              className="min-h-12 rounded-xl border border-ink/15 bg-white px-3 text-[16px] text-ink"
              aria-label="Datos de contacto"
            />
          </div>
        </div>

        <CvDocumento nombre={estado.nombre} contacto={estado.contacto} resultado={resultado} formacion={{ hechas, total: lecciones.length, nivel }} />

        <div className="no-print mt-4 grid gap-2">
          <button onClick={() => window.print()} className="min-h-12 rounded-xl bg-ink text-white font-semibold flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" /> Guardar como PDF
          </button>
          <Link href="/cv" className="min-h-12 rounded-xl border-2 border-ink/15 bg-white font-semibold flex items-center justify-center gap-2 text-ink">
            <ExternalLink className="w-4 h-4" /> Ver el CV público
          </Link>
        </div>
      </section>
    </div>
  );
}
