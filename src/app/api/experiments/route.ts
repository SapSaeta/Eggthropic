import { NextResponse } from "next/server";
import { experiments } from "@/lib/experiments";

export const dynamic = "force-static";

/**
 * JSON público con los experimentos del laboratorio.
 * Lo consume SaetaIA (saetaia.com/laboratorio) y cualquiera que lo quiera:
 * GET https://www.eggthropic.com/api/experiments
 */
export async function GET() {
  const payload = {
    proyecto: "Eggthropic",
    url: "https://www.eggthropic.com",
    actualizado: new Date().toISOString().slice(0, 10),
    experimentos: experiments.map((e) => ({
      slug: e.slug,
      titulo: e.title,
      descripcion: e.description,
      categoria: e.category,
      dificultad: e.difficulty,
      estado: e.status,
      fecha: e.date,
      herramientas: e.tools,
      objetivo: e.goal,
      url: `https://www.eggthropic.com/experiments/${e.slug}`,
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
