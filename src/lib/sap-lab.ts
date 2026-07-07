// ─── SAP x Claude Lab — datos del laboratorio ────────────────────────────────
// Fuente: repositorio interno sap-claude-lab (primera ejecución: 2026-07-06).
// Regla del laboratorio: todo se etiqueta como hecho, hipótesis, resultado
// propio o pendiente. Las puntuaciones del backlog son estimación inicial.

export type SapLinea = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type SapEstado = "desarrollado" | "probado" | "backlog";

export type SapClasificacion =
  | "prioridad-maxima"
  | "muy-interesante"
  | "explorar";

export interface SapCaso {
  id: string;
  titulo: string;
  linea: SapLinea;
  score: number; // sobre 50 (10 criterios × 5)
  clasificacion: SapClasificacion;
  estado: SapEstado;
  slug?: string; // experimento publicado en /experiments
}

export const LINEAS: Record<SapLinea, { nombre: string; icon: string; color: string }> = {
  A: { nombre: "ABAP / Clean Code", icon: "⬡", color: "#0a6ed1" },
  B: { nombre: "SAP HCM / HR", icon: "◈", color: "#c2542b" },
  C: { nombre: "Fiori / UI5", icon: "◉", color: "#0aa1d1" },
  D: { nombre: "CAP / BTP", icon: "⬢", color: "#7c3aed" },
  E: { nombre: "RAP / CDS", icon: "▣", color: "#0d9488" },
  F: { nombre: "Claude Skills", icon: "✦", color: "#c79b00" },
  G: { nombre: "Automatización", icon: "⌁", color: "#5c5347" },
  H: { nombre: "Negocio / Métricas", icon: "◎", color: "#9e3f1d" },
};

export const CLASIFICACION_META: Record<SapClasificacion, { label: string; min: number }> = {
  "prioridad-maxima": { label: "PRIORIDAD MÁXIMA", min: 45 },
  "muy-interesante": { label: "MUY INTERESANTE", min: 38 },
  explorar: { label: "EXPLORAR", min: 30 },
};

export const sapCasos: SapCaso[] = [
  { id: "001", titulo: "Refactor ABAP a Clean Code", linea: "A", score: 49, clasificacion: "prioridad-maxima", estado: "desarrollado", slug: "sap-abap-clean-code-refactor" },
  { id: "002", titulo: "Explicador de ABAP legacy para funcionales", linea: "A", score: 47, clasificacion: "prioridad-maxima", estado: "desarrollado", slug: "sap-abap-legacy-explainer" },
  { id: "003", titulo: "Requisito funcional → especificación técnica", linea: "A", score: 44, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "004", titulo: "Validador de Excel para cargas SAP HCM", linea: "B", score: 47, clasificacion: "prioridad-maxima", estado: "probado", slug: "sap-hcm-excel-validator" },
  { id: "005", titulo: "ALV clásico → propuesta Fiori", linea: "C", score: 44, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "006", titulo: "Mini app Fiori Elements desde requisito", linea: "C", score: 43, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "007", titulo: "Servicio CAP desde caso funcional", linea: "D", score: 43, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "008", titulo: "Asistente ABAP Unit (generación de tests)", linea: "A", score: 45, clasificacion: "prioridad-maxima", estado: "backlog" },
  { id: "009", titulo: "Diagnóstico de dumps y errores SAP", linea: "A", score: 38, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "010", titulo: "Claude Skill para revisión ABAP", linea: "F", score: 47, clasificacion: "prioridad-maxima", estado: "backlog" },
  { id: "011", titulo: "CLAUDE.md para proyecto SAP", linea: "G", score: 44, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "012", titulo: "Ejemplo RAP CRUD paso a paso (incidencias HR)", linea: "E", score: 41, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "013", titulo: "Plan de pruebas para infotipos", linea: "B", score: 42, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "014", titulo: "Mapeo campo origen → campo SAP (cargas)", linea: "B", score: 43, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "015", titulo: "Documentador de programas Z HCM", linea: "B", score: 41, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "016", titulo: "Análisis de impacto de cambios en reports HCM", linea: "B", score: 36, clasificacion: "explorar", estado: "backlog" },
  { id: "017", titulo: "Checklist Clean ABAP aplicable en revisión", linea: "A", score: 44, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "018", titulo: "Comparativa RAP vs CAP en un caso simple", linea: "D", score: 38, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "019", titulo: "CDS View desde requisito de reporting", linea: "E", score: 42, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "020", titulo: "GitHub Actions de revisión de PR ABAP", linea: "G", score: 39, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "021", titulo: "Detección de código duplicado en Z-programas", linea: "A", score: 36, clasificacion: "explorar", estado: "backlog" },
  { id: "022", titulo: "Generador de datos de prueba HCM ficticios", linea: "B", score: 38, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "023", titulo: "Métrica antes/después: explicar ABAP legacy", linea: "H", score: 38, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "024", titulo: "Demo dashboard SAP para dirección", linea: "C", score: 38, clasificacion: "muy-interesante", estado: "backlog" },
  { id: "025", titulo: "Traductor de IDocs/estructuras a lenguaje funcional", linea: "B", score: 36, clasificacion: "explorar", estado: "backlog" },
];

// ─── Etiquetas de rigor (regla no negociable del laboratorio) ────────────────

export const etiquetas = [
  {
    tag: "HECHO",
    color: "#0d9488",
    descripcion: "Documentado con fuente clara: URL y fecha de consulta.",
  },
  {
    tag: "HIPÓTESIS",
    color: "#0a6ed1",
    descripcion: "Creencia razonable que todavía debe probarse.",
  },
  {
    tag: "RESULTADO PROPIO",
    color: "#c2542b",
    descripcion: "Obtenido en una prueba reproducible del laboratorio, con evidencia guardada.",
  },
  {
    tag: "PENDIENTE",
    color: "#8a7e6d",
    descripcion: "Aún no se puede afirmar. Se dice claramente, y no pasa nada.",
  },
];

// ─── Fases del roadmap ────────────────────────────────────────────────────────

export type FaseEstado = "completada" | "en-curso" | "pendiente";

export const fases: { n: number; nombre: string; estado: FaseEstado; detalle: string }[] = [
  {
    n: 1,
    nombre: "Base del laboratorio",
    estado: "completada",
    detalle:
      "Estructura, modelo de scoring, reglas de investigación, backlog de 25 casos y los 3 primeros casos desarrollados (001, 002, 004).",
  },
  {
    n: 2,
    nombre: "Casos ABAP / HCM",
    estado: "en-curso",
    detalle:
      "Especificaciones técnicas, ABAP Unit y pruebas de control con código real anonimizado. Primera métrica real del laboratorio.",
  },
  {
    n: 3,
    nombre: "Fiori / RAP / CAP",
    estado: "pendiente",
    detalle:
      "ALV → Fiori, app Fiori Elements desde requisito, servicio CAP con datos mock y modelo RAP de incidencias HR.",
  },
  {
    n: 4,
    nombre: "Claude Skills",
    estado: "pendiente",
    detalle:
      "Convertir los mejores casos en skills: revisor ABAP, validador de cargas HCM, escritor de especificaciones técnicas.",
  },
  {
    n: 5,
    nombre: "Automatización y portfolio",
    estado: "pendiente",
    detalle:
      "CLAUDE.md para proyectos SAP, workflows de revisión de PR, demos y métricas de productividad publicadas.",
  },
];

// ─── Stats de cabecera ────────────────────────────────────────────────────────

export const sapStats = [
  { valor: "25", etiqueta: "casos en backlog" },
  { valor: "3", etiqueta: "casos desarrollados" },
  { valor: "10/10", etiqueta: "detecciones en la prueba ejecutada" },
  { valor: "4", etiqueta: "etiquetas de rigor obligatorias" },
];
