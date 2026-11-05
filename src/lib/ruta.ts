// ─── Mi ruta: SAP HCM → SAP Business AI / Agentic Solutions Architect ────────
// Para avanzar un paso: cambia su estado a "hecho" y marca el siguiente "ahora".
// Solo puede haber UN paso en "ahora" (la página enseña una sola cosa a la vez).

export type PasoEstado = "hecho" | "ahora" | "pendiente";

export interface Paso {
  id: string;
  titulo: string; // corto: una acción
  detalle?: string;
  estado: PasoEstado;
  prueba?: { label: string; href: string }; // evidencia pública cuando exista
}

export interface FaseRuta {
  n: number;
  nombre: string;
  cuando: string;
  color: string;
  pasos: Paso[];
}

export const fasesRuta: FaseRuta[] = [
  {
    n: 1,
    nombre: "Consolidar",
    cuando: "Nov – Dic 2026",
    color: "#0a6ed1",
    pasos: [
      {
        id: "c-jsd",
        titulo: "Certificación Joule Studio Developer (C_JSD)",
        estado: "hecho",
      },
      {
        id: "build-trial",
        titulo: "Abrir el trial de SAP Build y crear un agente en Studio",
        detalle: "Un agente pequeño, de punta a punta. Nada más.",
        estado: "ahora",
      },
      {
        id: "sf-agents",
        titulo: "Probar los agentes Joule de SuccessFactors",
        detalle: "HR Service, nómina, talento.",
        estado: "pendiente",
      },
      {
        id: "ec-apis",
        titulo: "Explorar las APIs de Employee Central",
        detalle: "En la Business Accelerator Hub.",
        estado: "pendiente",
      },
      {
        id: "mcp-a2a",
        titulo: "Entender MCP y A2A",
        detalle: "Cómo se conectan los agentes con SAP.",
        estado: "pendiente",
      },
    ],
  },
  {
    n: 2,
    nombre: "Laboratorio",
    cuando: "Enero 2027",
    color: "#0d9488",
    pasos: [
      {
        id: "mcp-server",
        titulo: "Servidor MCP propio, solo lectura",
        detalle: "Sobre APIs de ejemplo, sin datos reales.",
        estado: "pendiente",
      },
      {
        id: "claude-code",
        titulo: "Conectarlo a Claude Code con aprobación humana",
        detalle: "Con registro de lo que hace el agente.",
        estado: "pendiente",
      },
      {
        id: "rbp",
        titulo: "Roles y permisos (RBP) sobre datos sensibles",
        estado: "pendiente",
      },
      {
        id: "rgpd-ai-act",
        titulo: "RGPD y AI Act: la IA en RRHH es de alto riesgo",
        estado: "pendiente",
      },
    ],
  },
  {
    n: 3,
    nombre: "Demostrar",
    cuando: "Feb – Mar 2027",
    color: "#7a4fd6",
    pasos: [
      {
        id: "hr-agent",
        titulo: "Agente de HR Service en Joule Studio con aprobación humana",
        estado: "pendiente",
      },
      {
        id: "arch-note",
        titulo: "Nota de arquitectura y riesgos",
        detalle: "Permisos, trazas y AI Act en una página.",
        estado: "pendiente",
      },
      {
        id: "publish",
        titulo: "Publicar el repo y un post",
        estado: "pendiente",
      },
      {
        id: "cert-arch",
        titulo: "Certificación AI Platform Solution Architect",
        estado: "pendiente",
      },
    ],
  },
];

// ─── Derivados ────────────────────────────────────────────────────────────────

export const todosLosPasos: (Paso & { fase: FaseRuta })[] = fasesRuta.flatMap(
  (fase) => fase.pasos.map((p) => ({ ...p, fase }))
);

export const pasoActual = todosLosPasos.find((p) => p.estado === "ahora");

export const progreso = {
  hechos: todosLosPasos.filter((p) => p.estado === "hecho").length,
  total: todosLosPasos.length,
};

// ─── Perfil: qué sé hacer y dónde está la prueba ─────────────────────────────
// Solo entra lo que tiene prueba pública o certificado. Lo demás va como "en construcción".

export type PerfilEstado = "certificado" | "probado" | "construyendo";

export interface Habilidad {
  titulo: string;
  resumen: string;
  estado: PerfilEstado;
  prueba?: { label: string; href: string };
  color: string;
}

export const habilidades: Habilidad[] = [
  {
    titulo: "Agentes en Joule Studio",
    resumen: "Certificado SAP Joule Studio Developer (C_JSD).",
    estado: "certificado",
    color: "#0a6ed1",
  },
  {
    titulo: "ABAP limpio",
    resumen: "Revisión y refactor de un report legacy: 13 de 13 defectos detectados.",
    estado: "probado",
    prueba: { label: "SAP-001", href: "/experiments/sap-abap-clean-code-refactor" },
    color: "#c2542b",
  },
  {
    titulo: "Explicar código legacy a funcionales",
    resumen: "Cálculo de antigüedad en HCM explicado sin jerga, con un bug latente.",
    estado: "probado",
    prueba: { label: "SAP-002", href: "/experiments/sap-abap-legacy-explainer" },
    color: "#9e3f1d",
  },
  {
    titulo: "Calidad de datos en cargas HCM",
    resumen: "Validador de Excel: 10 de 10 errores, 0 falsos positivos, ejecutado de verdad.",
    estado: "probado",
    prueba: { label: "SAP-004", href: "/experiments/sap-hcm-excel-validator" },
    color: "#0d9488",
  },
  {
    titulo: "Asistente funcional de HR",
    resumen: "Demo de preguntas y respuestas sobre SAP HR.",
    estado: "probado",
    prueba: { label: "Ver demo", href: "/artefactos/sap-hr-assistant-demo" },
    color: "#c79b00",
  },
  {
    titulo: "Agentes gobernados sobre SuccessFactors",
    resumen: "MCP de solo lectura, permisos, trazas y AI Act. Es el objetivo de la fase 2.",
    estado: "construyendo",
    color: "#7a4fd6",
  },
];
