import Link from "next/link";
import { habilidades } from "@/lib/ruta";
import type { ResultadoTitulo } from "@/lib/titulo-cv";

/** Hoja de CV: se usa en la app (con datos locales) y en /cv (con datos publicados). */
export function CvDocumento({
  nombre,
  contacto,
  resultado,
  formacion,
}: {
  nombre?: string;
  contacto?: string;
  resultado: ResultadoTitulo;
  formacion?: { hechas: number; total: number; nivel: string };
}) {
  const { es, en, certificaciones, claims } = resultado;
  // el título ya nombra la certificación; el perfil la detalla una sola vez
  const resumen = [
    "Profesional de SAP HCM orientado a SAP Business AI y agentes de IA.",
    certificaciones.length ? `Certificado: ${certificaciones.join("; ")}.` : null,
    claims.length
      ? `Experiencia demostrada en: ${claims.join("; ")}.`
      : "Perfil en formación hacia agentes de IA en SAP HCM; las competencias se incorporan a medida que se demuestran con pruebas públicas.",
  ]
    .filter(Boolean)
    .join(" ");

  const demostradas = habilidades.filter((h) => h.estado !== "construyendo");
  const enDesarrollo = habilidades.filter((h) => h.estado === "construyendo");

  return (
    <article className="rounded-2xl border border-paper-line bg-white p-6 sm:p-10 shadow-sm print:shadow-none print:border-0 print:p-0 text-ink">
      <header className="border-b-2 border-ink pb-4">
        {nombre && <p className="text-3xl font-bold tracking-tight leading-tight">{nombre}</p>}
        <h2 className={`${nombre ? "mt-2 text-xl" : "text-2xl"} font-semibold leading-snug`}>{es}</h2>
        <p className="text-sm text-ink-soft mt-1">{en}</p>
        {contacto && <p className="mt-2 font-mono text-xs text-ink-soft">{contacto}</p>}
      </header>

      <section className="mt-5" style={{ breakInside: "avoid" }}>
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">PERFIL</h3>
        <p className="text-[15px] leading-relaxed">{resumen}</p>
      </section>

      {certificaciones.length > 0 && (
        <section className="mt-5" style={{ breakInside: "avoid" }}>
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">CERTIFICACIONES</h3>
          <ul className="space-y-1 text-[15px]">
            {certificaciones.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-teja">▸</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {claims.length > 0 && (
        <section className="mt-5" style={{ breakInside: "avoid" }}>
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">EVIDENCIAS DEMOSTRADAS</h3>
          <ul className="space-y-1 text-[15px]">
            {claims.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-teja">▸</span>
                <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">COMPETENCIAS Y PRUEBAS PÚBLICAS</h3>
        <ul className="space-y-3">
          {demostradas.map((h) => (
            <li key={h.titulo} style={{ breakInside: "avoid" }}>
              <p className="text-[15px] font-semibold leading-snug">{h.titulo}</p>
              <p className="text-sm text-ink-soft leading-snug">{h.resumen}</p>
              {h.prueba && (
                <Link href={h.prueba.href} className="text-xs font-mono text-teja underline underline-offset-2">
                  eggthropic.com{h.prueba.href}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {enDesarrollo.length > 0 && (
          <p className="mt-3 text-sm text-ink-soft">
            <b>En desarrollo: </b>
            {enDesarrollo.map((h) => h.titulo).join("; ")}.
          </p>
        )}
      </section>

      {formacion && formacion.hechas > 0 && (
        <section className="mt-5" style={{ breakInside: "avoid" }}>
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">FORMACIÓN CONTINUA</h3>
          <p className="text-[15px] leading-snug">
            Programa de formación en SAP Business AI y agentes sobre HCM (Eggthropic): {formacion.hechas} de {formacion.total} lecciones. Nivel de conocimiento: {formacion.nivel}.
          </p>
        </section>
      )}

      <p className="mt-6 pt-3 border-t border-paper-line text-[11px] text-ink-faint">
        Todos los experimentos usan datos ficticios. Evidencias y casos en eggthropic.com/sap.
      </p>
    </article>
  );
}
