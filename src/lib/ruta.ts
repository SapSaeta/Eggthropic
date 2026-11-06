// ─── Ruta: SAP HCM → SAP Business AI / Agentic Solutions Architect ───────────
// Cada paso es un hecho verificable (algo que has hecho y puedes enseñar).
// `hecho: true` aquí es lo que ve la web pública (/cv). En la app, cada persona
// puede marcar pasos en su dispositivo; eso solo afecta a su vista privada.

export interface Paso {
  id: string;
  titulo: string;
  detalle?: string;
  hecho?: boolean;
  /** Frase para el CV cuando el paso está hecho (solo afirma lo demostrado). */
  claim: string;
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
        titulo: "Certificación SAP Certified Joule Studio Developer (C_JSD)",
        hecho: true,
        claim: "Certificado SAP Joule Studio Developer (C_JSD)",
      },
      {
        id: "build-trial",
        titulo: "Crear un agente en Joule Studio (trial de SAP Build)",
        detalle: "Un agente pequeño, de punta a punta.",
        claim: "agente construido de punta a punta en Joule Studio",
      },
      {
        id: "sf-agents",
        titulo: "Probar los agentes Joule de SuccessFactors",
        detalle: "Autoservicio de HR, nómina, talento.",
        claim: "conocimiento práctico de los agentes Joule de SuccessFactors",
      },
      {
        id: "ec-apis",
        titulo: "Explorar las APIs de Employee Central",
        detalle: "En la Business Accelerator Hub.",
        claim: "manejo de las APIs OData de Employee Central",
      },
      {
        id: "mcp-a2a",
        titulo: "Dominar MCP y A2A",
        detalle: "Cómo se conectan los agentes con SAP.",
        claim: "conocimiento de los protocolos MCP y A2A",
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
        claim: "servidor MCP propio de solo lectura (laboratorio con datos ficticios)",
      },
      {
        id: "claude-code",
        titulo: "Conectarlo a un agente con aprobación humana y registro",
        claim: "agente conectado con aprobación humana y registro de acciones",
      },
      {
        id: "rbp",
        titulo: "Roles y permisos (RBP) sobre datos sensibles",
        claim: "diseño de permisos mínimos y RBP para agentes",
      },
      {
        id: "rgpd-ai-act",
        titulo: "RGPD y AI Act: la IA en RRHH es de alto riesgo",
        claim: "análisis de AI Act y RGPD aplicado a IA en RRHH",
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
        claim: "agente de HR Service con aprobación humana",
      },
      {
        id: "arch-note",
        titulo: "Nota de arquitectura y riesgos",
        detalle: "Permisos, trazas y AI Act en una página.",
        claim: "nota de arquitectura y riesgos publicada",
      },
      {
        id: "publish",
        titulo: "Publicar el repositorio y un artículo",
        claim: "repositorio y artículo técnico públicos",
      },
      {
        id: "real-case",
        titulo: "Caso real en un entorno de pruebas del cliente",
        claim: "caso real ejecutado en un entorno de pruebas de cliente",
      },
      {
        id: "cert-arch",
        titulo: "Certificación SAP Certified – Solution Architect – SAP Business AI Platform",
        detalle: "El código C_BAIPA procede de una web de preparación: confírmalo en SAP.",
        claim: "Certificado SAP Solution Architect – SAP Business AI Platform",
      },
    ],
  },
];

export type EstadoPaso = "hecho" | "ahora" | "pendiente";

export const todosLosPasos: (Paso & { fase: FaseRuta })[] = fasesRuta.flatMap((fase) =>
  fase.pasos.map((p) => ({ ...p, fase }))
);

/** Pasos hechos: lo estático, con las marcas locales (true/false) por encima. */
export function pasosHechos(local: Record<string, boolean> = {}): Set<string> {
  const s = new Set<string>();
  for (const p of todosLosPasos) {
    const marca = local[p.id];
    if (marca === true || (marca === undefined && p.hecho)) s.add(p.id);
  }
  return s;
}

/** Estado de cada paso: el primero sin hacer es «ahora». */
export function estadosPasos(local: Record<string, boolean> = {}): Record<string, EstadoPaso> {
  const hechos = pasosHechos(local);
  const out: Record<string, EstadoPaso> = {};
  let ahora = false;
  for (const p of todosLosPasos) {
    if (hechos.has(p.id)) out[p.id] = "hecho";
    else if (!ahora) {
      out[p.id] = "ahora";
      ahora = true;
    } else out[p.id] = "pendiente";
  }
  return out;
}

// ─── Perfil: qué sé hacer y dónde está la prueba ─────────────────────────────
// Solo entra lo que tiene prueba pública o certificado.

export type PerfilEstado = "certificado" | "probado" | "construyendo";

export interface Habilidad {
  titulo: string;
  resumen: string;
  estado: PerfilEstado;
  prueba?: { label: string; href: string };
}

export const habilidades: Habilidad[] = [
  {
    titulo: "Agentes en Joule Studio",
    resumen: "Certificación SAP Certified Joule Studio Developer (C_JSD).",
    estado: "certificado",
  },
  {
    titulo: "ABAP limpio",
    resumen: "Revisión y refactor de un report legacy: 13 de 13 defectos detectados.",
    estado: "probado",
    prueba: { label: "Caso SAP-001", href: "/experiments/sap-abap-clean-code-refactor" },
  },
  {
    titulo: "Explicar código legacy a funcionales",
    resumen: "Cálculo de antigüedad en HCM explicado sin jerga, con un bug latente detectado.",
    estado: "probado",
    prueba: { label: "Caso SAP-002", href: "/experiments/sap-abap-legacy-explainer" },
  },
  {
    titulo: "Calidad de datos en cargas HCM",
    resumen: "Validador de Excel: 10 de 10 errores, 0 falsos positivos, ejecutado con evidencia.",
    estado: "probado",
    prueba: { label: "Caso SAP-004", href: "/experiments/sap-hcm-excel-validator" },
  },
  {
    titulo: "Asistente funcional de HR",
    resumen: "Demo de preguntas y respuestas sobre SAP HR.",
    estado: "probado",
    prueba: { label: "Ver demo", href: "/artefactos/sap-hr-assistant-demo" },
  },
  {
    titulo: "Agentes gobernados sobre SuccessFactors",
    resumen: "MCP de solo lectura, permisos, trazas y AI Act. Objetivo de la fase 2.",
    estado: "construyendo",
  },
];
