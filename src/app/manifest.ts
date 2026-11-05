import type { MetadataRoute } from "next";

// Permite "Añadir a pantalla de inicio" y abrir Mi ruta como una app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eggthropic · Mi ruta",
    short_name: "Mi ruta",
    description: "Una lección visual al día hacia SAP Agentic Solutions Architect.",
    start_url: "/ruta",
    scope: "/",
    display: "standalone",
    background_color: "#f4eee2",
    theme_color: "#262019",
    lang: "es",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
