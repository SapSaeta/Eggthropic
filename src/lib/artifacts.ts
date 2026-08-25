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
  {
    slug: "claude-code-landing-builder",
    titulo: "Sesión Claude Code: de un prompt a una landing completa",
    descripcion:
      "Recorre turno a turno la sesión que generó la landing de \"Stackr\" con Claude Code: 23 turnos, 14 archivos, una vista previa que se va montando sección a sección según el turno que selecciones.",
    audiencia: ["todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude Code", "HTML/JS autocontenido"],
    prompt:
      "Reconstruye como línea de tiempo interactiva la sesión de Claude Code del caso 'landing page builder': lista de turnos clave a la izquierda (scaffold, hero, features, pricing, instalación de Framer Motion, animaciones, revisión responsive) y a la derecha una vista previa tipo navegador que se va completando según el turno seleccionado.",
    comoSeHizo:
      "Los turnos y hallazgos (14 archivos, 23 turnos, ~4 minutos de generación activa, mejoras de accesibilidad espontáneas) son los descritos en el caso. La vista previa es una reconstrucción ilustrativa de las secciones reales que produjo la sesión, no una grabación literal.",
    limitaciones: [
      "No es una grabación real turno a turno: es una reconstrucción basada en las notas de la sesión",
      "El contenido y código de \"Stackr\" son ficticios",
      "No refleja tiempos reales de generación por turno",
    ],
    relacionado: { label: "Caso — Una landing page completa con Claude Code", href: "/experiments/claude-code-landing-page-builder" },
    altura: 760,
  },
  {
    slug: "agent-skill-anatomy",
    titulo: "Anatomía de una Agent Skill — pr-describe",
    descripcion:
      "Explora los tres archivos de la skill pr-describe (SKILL.md, get-diff.sh, ejemplo de salida) y pruébala: genera una descripción de PR estructurada a partir de un git diff de ejemplo.",
    audiencia: ["todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude Code", "Agent Skills", "HTML/JS autocontenido"],
    prompt:
      "Convierte la skill pr-describe del caso 'first custom agent skill' en un explorador interactivo: árbol de archivos de .claude/skills/pr-describe/ con SKILL.md, get-diff.sh y un ejemplo de salida, más una demo que a partir de un git diff de ejemplo genera una descripción de PR con título conventional commits, Summary, Test Plan y Breaking Changes.",
    comoSeHizo:
      "El contenido de SKILL.md, el script auxiliar y el formato de salida reproducen los descritos en el caso (frontmatter YAML, regla de conventional commits, límite de 3 bullets en el Summary). La demo de generación está simulada en el navegador con una salida fija representativa del comportamiento medido (9/10 títulos correctos en conventional commits).",
    limitaciones: [
      "La demo 'generar descripción' no llama a la API de Claude: la salida es fija e ilustrativa",
      "No incluye el guard MAX_DIFF_LINES pendiente identificado como mejora en el caso",
      "El árbol de archivos es una recreación, no el repositorio real",
    ],
    relacionado: { label: "Caso — Mi primera Agent Skill a medida", href: "/experiments/first-custom-agent-skill" },
    altura: 760,
  },
  {
    slug: "ai-ux-playground",
    titulo: "Playground de patrones UI para IA",
    descripcion:
      "Cuatro patrones de interfaz para IA más allá del chat, simulados en el navegador: streaming con velocidad ajustable, mapa de confianza, traza de tool calls expandible y fases de pensamiento por timing.",
    audiencia: ["todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude API", "React", "HTML/JS autocontenido"],
    prompt:
      "Construye un playground con pestañas para los 4 patrones del caso 'ai ux interface playground': máquina de escribir con velocidad ajustable, mapa de calor de confianza por token (marcado como simulado), traza de tool calls con tarjetas expandibles, e indicador de fases leyendo/razonando/escribiendo con un botón de reproducción.",
    comoSeHizo:
      "Los cuatro patrones y sus hallazgos (la traza de tool calls como el más valioso para depurar, la latencia percibida cayendo con el primer token a los 300ms) reproducen los del caso original, construido contra la Messages API con streaming real.",
    limitaciones: [
      "El mapa de confianza no usa logprobs reales: la API de Anthropic no los expone públicamente, tal y como advierte el caso",
      "El streaming y las fases de pensamiento están simulados con temporizadores fijos, no con una conexión SSE real",
      "Los datos de las tool calls son de ejemplo, no de una sesión real",
    ],
    relacionado: { label: "Caso — Playground de interfaces para IA", href: "/experiments/ai-ux-interface-playground" },
    altura: 760,
  },
  {
    slug: "design-to-code-handoff",
    titulo: "Claude Design → Claude Code: el handoff en vivo",
    descripcion:
      "Mueve los mandos de ajuste (glow, elevación, opacidad de badges) sobre el prototipo de ExperimentCard y observa cómo el código React/Tailwind generado cambia con ellos — el ciclo diseño-a-código del caso.",
    audiencia: ["todos"],
    fecha: "2026-08-24",
    herramientas: ["Claude Design", "Claude Code", "HTML/JS autocontenido"],
    prompt:
      "Recrea el flujo de handoff del caso 'Claude Design: del prototipo al código': un prototipo de ExperimentCard con mandos de ajuste (intensidad del glow, elevación al hover, opacidad de badges) que actualizan en vivo tanto la vista previa como un fragmento de código Tailwind representativo del componente real.",
    comoSeHizo:
      "Los tres mandos de ajuste y el flujo brief → Claude Design → bundle de handoff → Claude Code son los descritos en el caso, donde el traspaso completo tomó unos 18 minutos y el componente resultante necesitó solo ajustes de espaciado.",
    limitaciones: [
      "El código mostrado es representativo del componente real, no una captura literal de la sesión de Claude Code",
      "No reproduce el editor real de Claude Design ni sus comentarios inline",
      "Los valores de los mandos son ilustrativos, no los exactos usados en la sesión original",
    ],
    relacionado: { label: "Caso — Claude Design: del prototipo al código", href: "/experiments/claude-design-prototype-to-code" },
    altura: 720,
  },
  {
    slug: "sap-hr-assistant-demo",
    titulo: "Asistente funcional SAP HR — demo de preguntas",
    descripcion:
      "Tres preguntas de ejemplo al asistente funcional de SAP HR: una que la base de conocimiento cubre bien, y dos donde se niega correctamente a inventar porque dependen de configuración del cliente.",
    audiencia: ["funcional-hcm", "tecnico-funcional"],
    fecha: "2026-08-24",
    herramientas: ["Claude", "Notion", "HTML/JS autocontenido"],
    prompt:
      "Crea una demo de preguntas y respuestas para el asistente funcional de SAP HR del caso: al elegir una pregunta de ejemplo, resalta la página de la base de conocimiento de Notion consultada y muestra la respuesta — incluida la negativa explícita a inventar cuando la pregunta depende de configuración del cliente (p. ej. la feature LGMST) o cruza varios infotipos sin cobertura suficiente.",
    comoSeHizo:
      "Las tres preguntas y sus respuestas reproducen el comportamiento medido en el caso: 0 alucinaciones en 40 consultas de prueba sobre definiciones de campos, y negativas correctas y explícitas ante dependencias de configuración del cliente o interacciones multi-infotipo sin cobertura.",
    limitaciones: [
      "No hay conexión real a Notion ni a la API de Claude: las tres respuestas están fijadas de antemano",
      "La base de conocimiento representada es un subconjunto (infotipos 0001-0008, PA40) del caso original",
      "No demuestra la estrategia de retrieval pendiente identificada como siguiente paso en el caso",
    ],
    relacionado: { label: "Caso — Un asistente funcional con IA para SAP HR legacy", href: "/experiments/sap-hr-functional-ai-assistant" },
    altura: 760,
  },
];

export function getArtefactoBySlug(slug: string): Artefacto | undefined {
  return artefactos.find((a) => a.slug === slug);
}
