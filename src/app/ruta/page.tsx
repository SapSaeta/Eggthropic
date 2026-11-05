import type { Metadata, Viewport } from "next";
import { RutaApp } from "@/components/ruta/RutaApp";

export const metadata: Metadata = {
  title: "Mi ruta",
  description:
    "De SAP HCM a SAP Business AI / Agentic Solutions Architect: una lección visual al día, un radar de conocimiento y el CV con pruebas públicas.",
  alternates: { canonical: "https://www.eggthropic.com/ruta" },
  openGraph: {
    title: "Mi ruta — Eggthropic",
    description:
      "Una lección visual al día para llegar a SAP Agentic Solutions Architect, con pruebas públicas de cada habilidad.",
    url: "https://www.eggthropic.com/ruta",
    siteName: "Eggthropic",
    type: "website",
  },
  appleWebApp: { capable: true, title: "Mi ruta", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#262019",
};

export default function RutaPage() {
  return <RutaApp />;
}
