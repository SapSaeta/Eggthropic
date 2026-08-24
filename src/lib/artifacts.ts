// ─── Artefactos HTML del laboratorio ─────────────────────────────────────────
// Cada artefacto es un HTML autocontenido en public/artifacts/<slug>.html,
// como los que genera Claude: sin dependencias externas, todo corre en el
// navegador y ningún dato sale de la página.

export type Audiencia =
  | "abap"
  | "funcional-hcm"
  | "tecnico-funcional"
  | "todos";

export const AUDIENCIA_META: Record<Audiencia, { label: string; color: string }> = {
  abap: { label: "ABAP developer", color: "#0a6ed1" },
  "funcional-hcm": { label: "Funcional HCM", color: "#c2542b" },
  "tecnico-funcional": { label: "Técnico-funcional", color: "#0d9488" },
  todos: { label: "Todos los perfiles", color: "#7c3aed" },
};

export interface Artefacto {
  slug: string;
  titulo: string;
  descripcion: string;
  audiencia: Audiencia[];
  fecha: string;
  herramientas: string[];
  /** Prompt (resumido) con el que se generó el artefacto */
  prompt: string;
  comoSeHizo: string;
  limitaciones: string[];
  relacionado?: { label: string; href: string };
  /** Altura sugerida del iframe en px */
  altura: number;
}

export const artefactos: Artefacto[] = [
  {
    slug: "validador-it2010",
    titulo: "Validador de carga IT2010",
    descripcion:
      "Valida un fichero de remuneración por empleado antes de que toque SAP: pega tus filas o usa el ejemplo con 10 errores plantados y obtén errores por regla, severidad y veredicto de carga.",
    audiencia: ["tecnico-funcional", "funcional-hcm"],
    fecha: "2026-08-24",
    herramientas: ["Claude", "HTML/JS autocontenido"],
    prompt:
      "Convierte el validador Python del caso 004 (reglas R01–R10 para cargas del infotipo 2010) en un HTML autocontenido: textarea con datos de ejemplo precargados con errores plantados, selector de periodo, validación en el navegador y tabla de resultados con severidad y mensajes en lenguaje funcional. Sin librerías externas, estética papel del laboratorio.",
    comoSeHizo:
      "Es la traducción a JavaScript del validador probado en el caso 004 del SAP Lab (10/10 detecciones, 0 falsos positivos en la prueba original en Python). Las reglas son las mismas: formato de PERNR, fechas contra el periodo, catálogo de CC-nóminas, condicional horas/importe, rangos, duplicados y avisos por patrones sospechosos.",
    limitaciones: [
      "El catálogo de CC-nóminas y los máximos son ficticios: en un cliente real vienen de configuración (T512W) y de las reglas del proyecto",
      "Es un prefiltro: no sustituye las validaciones de SAP (configuración, bloqueos, autorizaciones)",
      "La versión JS no se ha verificado contra la matriz esperado-vs-real con el mismo rigor que la Python original",
    ],
    relacionado: { label: "Caso 004 — Validador de Excel para cargas SAP HCM", href: "/experiments/sap-hcm-excel-validator" },
    altura: 900,
  },
  {
    slug: "alv-vs-fiori",
    titulo: "El mismo report, dos mundos: ALV → Fiori",
    descripcion:
      "El listado de ausencias del caso 001 como ALV de SAP GUI y como su equivalente Fiori Elements List Report, lado a lado. Ordena en ambos, filtra en el lado Fiori y lee qué cambia de verdad más allá del aspecto.",
    audiencia: ["todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude", "HTML/JS autocontenido"],
    prompt:
      "Crea una comparativa interactiva lado a lado del report de ausencias ZHR_AUSENCIAS_LIST: a la izquierda un ALV clásico con estética SAP GUI (barra de menú, toolbar, grid denso), a la derecha su propuesta como Fiori Elements List Report (shell bar, filtros vivos, estados con criticality). Mismos datos ficticios, ordenación compartida, y una nota final honesta con lo que cambia de verdad y cuándo NO migrar.",
    comoSeHizo:
      "Adelanta el caso 005 del backlog (ALV clásico → propuesta Fiori). El lado Fiori imita el floorplan List Report con anotaciones UI conceptuales: filtros de la FilterBar, estados semánticos y navegación a Object Page señalada pero no implementada.",
    limitaciones: [
      "El lado Fiori es un mock visual: no usa SAPUI5 ni Fiori Elements reales",
      "La estimación de esfuerzo (CDS + anotaciones + OData) es cualitativa, no medida",
      "Datos 100% ficticios",
    ],
    relacionado: { label: "Caso 001 — Refactor ABAP a Clean Code", href: "/experiments/sap-abap-clean-code-refactor" },
    altura: 980,
  },
  {
    slug: "checklist-clean-abap",
    titulo: "Checklist Clean ABAP interactivo",
    descripcion:
      "La checklist de revisión del caso 001 convertida en herramienta: marca lo que cumple tu report, descarta lo que no aplique, y copia el resumen en Markdown con puntuación y veredicto para tu revisión o ticket.",
    audiencia: ["abap"],
    fecha: "2026-08-24",
    herramientas: ["Claude", "HTML/JS autocontenido"],
    prompt:
      "Convierte el checklist Clean ABAP del caso 001 (6 grupos: rendimiento/BD, estructura, sintaxis moderna, nombres, robustez y específico HCM) en una herramienta clicable: checkbox por ítem con pista práctica, botón N/A por ítem, barra de cumplimiento sticky con veredicto y botón que copia el resumen completo en Markdown al portapapeles.",
    comoSeHizo:
      "Los 21 ítems salen del artefacto clean_code_checklist.md del caso 001, basado en la guía Clean ABAP oficial (SAP/styleguides) más la sección HCM propia del laboratorio (delimitaciones, SPRPS, autorizaciones, MOLGA).",
    limitaciones: [
      "La puntuación es orientativa: no pondera severidades (un N+1 pesa lo mismo que un nombre pobre)",
      "La sección HCM refleja la experiencia del laboratorio, no un estándar oficial de SAP",
      "No sustituye a ATC/Code Pal: es para revisión humana estructurada",
    ],
    relacionado: { label: "Caso 001 — Refactor ABAP a Clean Code", href: "/experiments/sap-abap-clean-code-refactor" },
    altura: 1100,
  },
  {
    slug: "infotipos-hcm",
    titulo: "Mapa de infotipos SAP HCM",
    descripcion:
      "Los 13 infotipos que más aparecen en el día a día de PA, nómina y tiempos, explicados sin jerga: campos clave, transacciones, relaciones navegables entre ellos y un aviso práctico por infotipo.",
    audiencia: ["funcional-hcm", "todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude", "HTML/JS autocontenido"],
    prompt:
      "Crea un mapa interactivo de los infotipos esenciales de SAP HCM On-Premise (0000, 0001, 0002, 0006, 0007, 0008, 0014, 0015, 0041, 2001, 2002, 2006, 2010) para consultores funcionales: tarjetas por área (maestros/nómina/tiempos) con buscador y filtros, y ficha modal con campos clave, transacciones, infotipos relacionados navegables y una nota de «en la práctica» por cada uno. Marca explícitamente lo que depende de configuración del cliente.",
    comoSeHizo:
      "El contenido cruza el conocimiento HCM del laboratorio con la base sap-hr-knowledge del experimento del asistente funcional. Cada ficha incluye la advertencia clave del caso 002: lo que es configuración del cliente (subtipos, clases de fecha, posiciones de CC-nómina) se señala como tal, no como verdad universal.",
    limitaciones: [
      "Contenido educativo general: los subtipos y catálogos concretos dependen de cada cliente",
      "Cobertura parcial (13 infotipos): no incluye OM, reclutamiento ni país-específicos",
      "Pendiente de revisión por más consultores HCM — las correcciones por PR son bienvenidas",
    ],
    relacionado: { label: "Caso 002 — Explicador de ABAP legacy", href: "/experiments/sap-abap-legacy-explainer" },
    altura: 950,
  },
];

export function getArtefactoBySlug(slug: string): Artefacto | undefined {
  return artefactos.find((a) => a.slug === slug);
}
