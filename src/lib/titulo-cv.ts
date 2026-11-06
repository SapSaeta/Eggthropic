// ─── Motor del título de CV ───────────────────────────────────────────────────
// Regla: el título depende de EVIDENCIA (certificaciones y pasos demostrados), no
// de lo estudiado. Las lecciones solo suben el «nivel de conocimiento» y la línea
// de formación. Cada título exige pasos concretos, y la app dice qué falta.

import { todosLosPasos } from "./ruta";

export interface BaseRol {
  id: string;
  es: string;
  en: string;
}

export const BASES: BaseRol[] = [
  { id: "hcm", es: "Consultor SAP HCM", en: "SAP HCM Consultant" },
  { id: "tecnico", es: "Consultor técnico SAP HCM (ABAP)", en: "SAP HCM Technical Consultant (ABAP)" },
  { id: "funcional", es: "Consultor funcional SAP HCM", en: "SAP HCM Functional Consultant" },
  { id: "tecfun", es: "Consultor técnico-funcional SAP HCM", en: "SAP HCM Techno-Functional Consultant" },
];

export interface Tier {
  id: string;
  nivel: string;
  /** Pasos de la ruta que se deben haber demostrado. */
  requisitos: string[];
  es: (base: BaseRol) => string;
  en: (base: BaseRol) => string;
  /** Titular de LinkedIn (≤ 220 caracteres). */
  titular: (base: BaseRol) => string;
  /** Qué NO conviene poner todavía. */
  evitar: string;
}

export const TIERS: Tier[] = [
  {
    id: "t0",
    nivel: "Base",
    requisitos: [],
    es: (b) => b.es,
    en: (b) => b.en,
    titular: (b) => `${b.es} | Interesado en Business AI y agentes sobre SuccessFactors`,
    evitar: "No uses «Joule», «Business AI» ni «agentes» como especialidad: todavía no hay evidencia.",
  },
  {
    id: "t1",
    nivel: "Certificado",
    requisitos: ["c-jsd"],
    es: (b) => `${b.es} · SAP Certified Joule Studio Developer`,
    en: (b) => `${b.en} · SAP Certified Joule Studio Developer`,
    titular: (b) => `${b.es} | SAP Certified Joule Studio Developer | SuccessFactors y agentes de IA`,
    evitar: "Puedes mencionar la certificación, pero no te llames «especialista»: una certificación no es experiencia.",
  },
  {
    id: "t2",
    nivel: "Especialización inicial",
    requisitos: ["c-jsd", "build-trial"],
    es: (b) => `${b.es} con especialización en Business AI (SAP Joule)`,
    en: (b) => `${b.en} specialising in Business AI (SAP Joule)`,
    titular: (b) => `${b.es} | Business AI y SAP Joule | Certificado Joule Studio Developer`,
    evitar: "Aún no te presentes como «consultor Joule»: te falta conocer los agentes de SuccessFactors y sus APIs.",
  },
  {
    id: "t3",
    nivel: "Consultor Joule",
    requisitos: ["c-jsd", "build-trial", "sf-agents", "ec-apis"],
    es: () => "SAP Joule & Business AI Consultant — HCM (SuccessFactors)",
    en: () => "SAP Joule & Business AI Consultant — HCM (SuccessFactors)",
    titular: () => "SAP Joule & Business AI Consultant | HCM (SuccessFactors) | Agentes de IA con permisos y trazas",
    evitar: "No digas «arquitecto»: aún no has construido ni gobernado una integración de agente completa.",
  },
  {
    id: "t4",
    nivel: "Integración y gobierno",
    requisitos: ["c-jsd", "build-trial", "sf-agents", "ec-apis", "mcp-a2a", "mcp-server", "claude-code", "rbp", "rgpd-ai-act"],
    es: () => "SAP Business AI Consultant — HCM · Integración de agentes (MCP) y gobierno",
    en: () => "SAP Business AI Consultant — HCM · Agent Integration (MCP) & Governance",
    titular: () => "SAP Business AI Consultant | HCM · Integración de agentes (MCP) y gobierno | AI Act y RGPD",
    evitar: "Todavía no «Solution Architect»: falta un agente completo, una nota de arquitectura y un caso real.",
  },
  {
    id: "t5",
    nivel: "Especialista en agentes",
    requisitos: ["c-jsd", "build-trial", "sf-agents", "ec-apis", "mcp-a2a", "mcp-server", "claude-code", "rbp", "rgpd-ai-act", "hr-agent", "arch-note", "publish"],
    es: () => "Especialista en agentes de IA para SAP HCM (SAP Business AI Solution Consultant)",
    en: () => "SAP Business AI Solution Consultant — Agentic AI for HCM",
    titular: () => "SAP Business AI Solution Consultant | Agentes de IA para HCM | Arquitectura, riesgos y gobierno",
    evitar: "«Architect» necesita además un caso real en un entorno de cliente.",
  },
  {
    id: "t6",
    nivel: "Arquitecto",
    requisitos: ["c-jsd", "build-trial", "sf-agents", "ec-apis", "mcp-a2a", "mcp-server", "claude-code", "rbp", "rgpd-ai-act", "hr-agent", "arch-note", "publish", "real-case"],
    es: () => "SAP Business AI / Agentic Solutions Architect — HCM",
    en: () => "SAP Business AI / Agentic Solutions Architect — HCM",
    titular: () => "SAP Business AI / Agentic Solutions Architect | HCM (SuccessFactors) | Gobierno y cumplimiento de agentes",
    evitar: "Con la certificación de arquitecto de SAP Business AI Platform el título queda aún más respaldado.",
  },
];

const titulosPaso = Object.fromEntries(todosLosPasos.map((p) => [p.id, p.titulo]));
const claimsPaso = Object.fromEntries(todosLosPasos.map((p) => [p.id, p.claim]));

export interface ResultadoTitulo {
  tier: Tier;
  indice: number;
  siguiente: Tier | null;
  /** Pasos que faltan para el siguiente título (con su texto). */
  faltan: { id: string; titulo: string }[];
  base: BaseRol;
  es: string;
  en: string;
  titular: string;
  /** Evidencias demostradas, redactadas para el CV. */
  claims: string[];
  certificaciones: string[];
}

export function calcularTitulo(hechos: Set<string>, baseId: string): ResultadoTitulo {
  const base = BASES.find((b) => b.id === baseId) ?? BASES[0];
  let indice = 0;
  TIERS.forEach((t, i) => {
    if (t.requisitos.every((r) => hechos.has(r))) indice = i;
  });
  const tier = TIERS[indice];
  const siguiente = TIERS[indice + 1] ?? null;
  const faltan = siguiente
    ? siguiente.requisitos.filter((r) => !hechos.has(r)).map((id) => ({ id, titulo: titulosPaso[id] }))
    : [];
  const claims = todosLosPasos.filter((p) => hechos.has(p.id) && !p.id.startsWith("cert") && p.id !== "c-jsd").map((p) => claimsPaso[p.id]);
  const certificaciones = [
    hechos.has("c-jsd") ? "SAP Certified Joule Studio Developer (C_JSD)" : null,
    hechos.has("cert-arch") ? "SAP Certified – Solution Architect – SAP Business AI Platform" : null,
  ].filter((x): x is string => !!x);

  return {
    tier,
    indice,
    siguiente,
    faltan,
    base,
    es: tier.es(base),
    en: tier.en(base),
    titular: tier.titular(base),
    claims,
    certificaciones,
  };
}
