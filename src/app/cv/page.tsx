import type { Metadata } from "next";
import Link from "next/link";
import { CvDocumento } from "@/components/ruta/CvDocumento";
import { PERFIL_PUBLICO } from "@/lib/perfil-publico";
import { pasosHechos } from "@/lib/ruta";
import { calcularTitulo } from "@/lib/titulo-cv";

export const metadata: Metadata = {
  title: "CV",
  description: "Perfil profesional en SAP HCM y agentes de IA, con certificaciones y pruebas públicas de cada competencia.",
  alternates: { canonical: "https://www.eggthropic.com/cv" },
};

export default function CvPage() {
  const resultado = calcularTitulo(pasosHechos({}), PERFIL_PUBLICO.base);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <CvDocumento nombre={PERFIL_PUBLICO.nombre} contacto={PERFIL_PUBLICO.contacto} resultado={resultado} />
      <p className="no-print mt-6 text-sm text-ink-soft text-center">
        Este CV solo recoge lo certificado o demostrado con pruebas públicas.{" "}
        <Link href="/ruta" className="underline underline-offset-2 text-teja">
          Ver el programa de formación
        </Link>
        .
      </p>
    </div>
  );
}
