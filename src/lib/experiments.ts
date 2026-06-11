import type { Experiment } from "@/types";

export const experiments: Experiment[] = [
  {
    slug: "claude-code-landing-page-builder",
    title: "Una landing page completa con Claude Code",
    description:
      "Usar Claude Code para montar, diseñar e iterar una landing page de marketing completa desde un único prompt — layout con Tailwind, textos y diseño responsive incluidos.",
    category: "claude-code",
    difficulty: "beginner",
    status: "complete",
    date: "2026-04-10",
    tools: ["Claude Code", "Next.js", "Tailwind CSS", "Framer Motion"],
    goal: "Comprobar hasta dónde llega una sola sesión de Claude Code desde el lienzo en blanco hasta una landing desplegable, sin cambiar de herramienta ni salir del terminal.",
    context:
      "Claude Code es el CLI de programación agéntica de Anthropic: lee tu base de código, propone cambios en varios archivos, ejecuta tests y hace commits. Este experimento lo trata como pair programmer para un flujo completo de diseño a código — sin Figma, sin scaffolding manual. La sesión arrancó con un brief de una línea: construir la landing de un producto SaaS ficticio para desarrolladores llamado «Stackr».",
    prompt:
      'Build a production-ready Next.js landing page for a developer tool called "Stackr" — a CLI that auto-generates API documentation from TypeScript source. Include a hero, features grid, pricing table (3 tiers), and a footer. Use Tailwind CSS, dark mode by default, and add subtle Framer Motion entrance animations. Keep the copy technical but accessible. No placeholder images.',
    implementationNotes:
      "Claude Code creó 14 archivos en una sola sesión: el scaffold de Next.js, la configuración de Tailwind, 6 componentes reutilizables y todas las secciones de la página. Instaló Framer Motion por su cuenta, escribió un hook propio para animaciones al hacer scroll y validó el layout responsive listando todos los breakpoints. La sesión completa: 23 turnos y unos 4 minutos de generación activa.",
    result:
      "Una landing completamente funcional y visualmente terminada con todas las secciones pedidas. Las animaciones de Framer Motion quedaron correctamente condicionadas a prefers-reduced-motion sin pedirlo. La tabla de precios incluyó el destacado del plan recomendado. Tiempo equivalente estimado a mano: 2-4 horas.",
    whatWorked: [
      "Un solo prompt generó una estructura multi-archivo coherente",
      "Claude añadió mejoras de accesibilidad por iniciativa propia (aria-label, reduced-motion)",
      "Los nombres de componentes fueron consistentes durante toda la sesión",
      "Los textos generados sonaban a producto developer sin darle ningún ejemplo",
    ],
    whatFailed: [
      "La navegación móvil inicial necesitó dos prompts de revisión",
      "El timing del stagger de Framer Motion en la grid de features hubo que ajustarlo a mano",
      "Claude no añadió og:image ni meta tags de Twitter sin pedírselo",
    ],
    nextIteration:
      "Probar el mismo prompt con el flag --plan de Claude Code para comparar generación planificada vs. reactiva. Explorar también un brief de proyecto en CLAUDE.md para reducir ciclos de revisión.",
    references: [
      {
        label: "Claude Code Overview — Docs de Anthropic",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
      },
      {
        label: "Referencia del CLI de Claude Code",
        url: "https://docs.anthropic.com/en/docs/claude-code/cli-reference",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "first-custom-agent-skill",
    title: "Mi primera Agent Skill a medida",
    description:
      "Construir una Agent Skill para Claude Code que automatiza la descripción de pull requests a partir del git diff — empaquetada como un SKILL.md reutilizable con frontmatter YAML.",
    category: "skills",
    difficulty: "intermediate",
    status: "complete",
    date: "2026-04-18",
    tools: ["Claude Code", "Agent Skills", "Git", "Bash"],
    goal:
      "Entender el formato de Agent Skills construyendo una skill práctica desde cero: generar descripciones estructuradas de pull request desde los cambios staged.",
    context:
      "Las Agent Skills son directorios con un archivo SKILL.md y frontmatter YAML que dan capacidades adicionales a los agentes. Funcionan en Claude.ai, Claude Code, el Agent SDK y la plataforma de desarrolladores. Este experimento construye una skill llamada pr-describe que lee la salida de git diff y produce una descripción de PR estandarizada siguiendo conventional commits.",
    prompt:
      "Given the output of `git diff --staged`, generate a structured pull request description with: a one-line title following conventional commits format, a Summary section (3 bullet points max), a Test Plan (numbered checklist), and a Breaking Changes section (or 'None'). Be concise and technical.",
    implementationNotes:
      "El SKILL.md usa el frontmatter YAML obligatorio (name, description) más campos opcionales de herramientas y ejemplos. El directorio .claude/skills/pr-describe/ contiene el SKILL.md, un script auxiliar get-diff.sh que prepara y canaliza el git diff, y una salida de ejemplo como referencia para Claude. Claude Code carga la skill automáticamente cuando el directorio de trabajo es un repo git y se invoca su nombre.",
    result:
      "La skill genera descripciones de PR que cumplen conventional commits de forma fiable. En 10 ejecuciones sobre repos distintos, el formato del título fue correcto 9/10 veces. La calidad del resumen varía con el tamaño del diff: por encima de ~500 líneas pierde precisión.",
    whatWorked: [
      "El frontmatter YAML es mínimo y la skill cargó sin problemas",
      "Claude invocó el script get-diff.sh correctamente sin indicárselo",
      "El formato de salida fue consistente entre ejecuciones",
      "La skill es portable: copiar el directorio a otro proyecto simplemente funciona",
    ],
    whatFailed: [
      "Los diffs muy grandes (500+ líneas) saturan la skill y degradan el resumen",
      "No hay lógica de truncado: el script auxiliar necesita un guard MAX_DIFF_LINES",
      "La skill aún no trata los merge commits de forma distinta a los de feature",
    ],
    nextIteration:
      "Añadir troceado de diffs al script auxiliar. Publicar la skill en GitHub — el repositorio oficial anthropics/skills es la referencia canónica para skills de la comunidad.",
    references: [
      {
        label: "Equipping Agents with Agent Skills — Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
      },
      {
        label: "Presentación de Agent Skills — Anthropic",
        url: "https://www.anthropic.com/news/skills",
      },
      {
        label: "Agent Skills — documentación oficial",
        url: "https://code.claude.com/docs/en/skills",
      },
      {
        label: "anthropics/skills — repositorio oficial",
        url: "https://github.com/anthropics/skills",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "mcp-visual-explainer",
    title: "Explicador visual de MCP",
    description:
      "Una herramienta de diagramas interactivos construida con React y MCP que muestra cómo se comunican servidor, cliente y host — renderizada en vivo desde un servidor MCP local real.",
    category: "mcp",
    difficulty: "intermediate",
    status: "experimental",
    date: "2026-04-26",
    tools: ["MCP", "TypeScript", "React", "Next.js", "Zod"],
    goal:
      "Construir un explicador para desarrolladores que se conecte a un servidor MCP real y visualice las primitivas Tools/Resources/Prompts en un diagrama vivo e interactivo.",
    context:
      "El Model Context Protocol (MCP) es el estándar abierto presentado por Anthropic en noviembre de 2024 para conectar aplicaciones de IA con datos y herramientas externas. Tiene tres primitivas: Tools (funciones ejecutables), Resources (datos estructurados) y Prompts (plantillas). Este experimento construye un servidor MCP local que expone metadatos sobre sí mismo y los renderiza en un diagrama React. El objetivo: hacer tangible la arquitectura de MCP para quien la ve por primera vez.",
    implementationNotes:
      "Servidor MCP en Node.js con el SDK oficial de TypeScript que expone tres tools: list-tools, list-resources y list-prompts — cada una devuelve JSON describiendo las capacidades del propio servidor. El frontend Next.js se conecta vía transporte SSE y renderiza un grafo de nodos en vivo con un renderer SVG propio y ligero. Zod valida todas las respuestas MCP antes de renderizar.",
    result:
      "El explicador renderiza correctamente el árbol de capacidades de un servidor MCP en vivo. La conexión SSE es estable en desarrollo local. El diagrama se actualiza en tiempo real cuando cambia la lista de tools del servidor — útil para demostrar flujos de desarrollo de servidores MCP.",
    whatWorked: [
      "El SDK oficial de TypeScript hizo trivial el montaje del servidor",
      "El transporte SSE funcionó de forma fiable en local",
      "La validación con Zod cazó dos definiciones de tools malformadas durante las pruebas",
      "El grafo SVG se renderizó bien en todos los tamaños de pantalla probados",
    ],
    whatFailed: [
      "La configuración CORS del endpoint SSE requirió cabeceras manuales",
      "No hay protocolo oficial de descubrimiento de servidores: la URL va hardcodeada",
      "El diagrama se satura con más de 15 tools — necesita paginación o agrupación",
    ],
    nextIteration:
      "Migrar de SSE a transporte Streamable HTTP (SSE quedó obsoleto en la revisión de la spec de 2025-03-26). Conectar con el MCP Registry oficial (registry.modelcontextprotocol.io) para descubrir servidores en vez de URLs fijas. Añadir un modo «traza de peticiones» que muestre el flujo crudo de mensajes JSON-RPC 2.0.",
    references: [
      {
        label: "Model Context Protocol — docs oficiales",
        url: "https://modelcontextprotocol.io",
      },
      {
        label: "Especificación MCP (2025-11-25)",
        url: "https://modelcontextprotocol.io/specification/2025-11-25",
      },
      {
        label: "MCP Registry oficial",
        url: "https://registry.modelcontextprotocol.io",
      },
      {
        label: "Buenas prácticas de seguridad MCP — docs oficiales",
        url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
      },
      {
        label: "Code Execution with MCP — Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "ai-ux-interface-playground",
    title: "Playground de interfaces para IA",
    description:
      "Explorar patrones de interfaz nativos de IA: texto en streaming, indicadores de confianza, visualización de tool calls y trazas de razonamiento — en un playground React a medida.",
    category: "ux-ui",
    difficulty: "advanced",
    status: "in-progress",
    date: "2026-05-01",
    tools: ["Claude API", "React", "TypeScript", "Framer Motion", "SSE"],
    goal:
      "Identificar y prototipar los patrones de UI que hacen que una interfaz con IA se sienta rápida, transparente y fiable — más allá de la burbuja de chat de siempre.",
    context:
      "Casi todas las interfaces de IA caen en la metáfora del chat: el usuario escribe, el modelo responde en streaming. Este experimento pregunta: ¿qué otros patrones de interacción aparecen cuando expones más de lo que el modelo está haciendo? Inspirado en las trazas de extended thinking, la visibilidad de tool calls y los displays de probabilidad de tokens de las interfaces de investigación, el playground implementa cuatro patrones experimentales usando el streaming de la API de Anthropic.",
    implementationNotes:
      "Construido contra la Messages API con streaming. Cuatro patrones: (1) Máquina de escribir con velocidad ajustable — simula distintas tasas de tokens. (2) Mapa de calor de confianza — colorea tokens por certeza estimada (de momento simulada, no salen de logprobs reales). (3) Traza de tool calls — cada invocación es una tarjeta expandible con el JSON de entrada/salida. (4) Indicador de fases de pensamiento — muestra «leyendo», «razonando», «escribiendo» según el timing de eventos SSE. Todos los patrones se combinan desde un panel de configuración.",
    result:
      "La traza de tool calls resultó el patrón más valioso para depurar flujos agénticos. La máquina de escribir reveló que la latencia percibida cae en picado cuando aparece un solo token en los primeros 300 ms. El mapa de confianza es experimental y no usa datos reales del modelo — está etiquetado claramente como prototipo.",
    whatWorked: [
      "El streaming SSE de la API de Anthropic es fiable y está bien documentado",
      "La traza de tool calls redujo el tiempo de depuración en tests multi-paso",
      "AnimatePresence de Framer Motion gestionó los appends de tokens sin saltos de layout",
      "El panel de configuración facilitó comparar patrones lado a lado",
    ],
    whatFailed: [
      "El mapa de confianza no usa logprobs reales: la API de Anthropic no expone probabilidades por token públicamente",
      "Detectar fases de pensamiento por el timing de SSE es una heurística, no una característica del protocolo",
      "Renderizar 1000+ tokens en streaming causó sobrecoste de re-render en React sin virtualización",
    ],
    nextIteration:
      "Implementar virtualización de tokens para streams largos. Investigar si las trazas de extended thinking (disponibles en los modelos Claude con modo thinking) pueden alimentar el indicador de fases de forma más fiable.",
    references: [
      {
        label: "Anthropic Messages API — Streaming",
        url: "https://docs.anthropic.com/en/api/messages-streaming",
      },
      {
        label: "Extended Thinking de Claude",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "claude-design-prototype-to-code",
    title: "Claude Design: del prototipo al código en un solo ciclo",
    description:
      "Usar Claude Design (research preview de Anthropic Labs) para convertir un brief escrito en prototipo interactivo y pasárselo a Claude Code para la implementación — cerrando el ciclo diseño-desarrollo.",
    category: "ux-ui",
    difficulty: "intermediate",
    status: "experimental",
    date: "2026-05-05",
    tools: ["Claude Design", "Claude Code", "Claude Opus 4.7", "Figma"],
    goal:
      "Comprobar si el traspaso Claude Design → Claude Code produce un componente usable en producción desde un único brief escrito, sin traducción manual diseño-desarrollo.",
    context:
      "Claude Design es un producto de Anthropic Labs (research preview, abril 2026) que crea diseños, prototipos interactivos, slides y one-pagers conversando. Funciona con Claude Opus 4.7 para suscriptores Pro, Max, Team y Enterprise. Su diferencial es el mecanismo de handoff: cuando el diseño está listo, Claude lo empaqueta en un bundle que se pasa directamente a Claude Code. Este experimento prueba el ciclo completo con un brief real: el componente ExperimentCard de Eggthropic.",
    prompt:
      "Design an ExperimentCard UI component for a developer lab website called Eggthropic. Dark mode, glassmorphism aesthetic, dark navy background (#080c14). The card shows: title, one-line description, category tag, difficulty badge (beginner/intermediate/advanced), status badge (complete/in-progress/experimental), date, and a list of tool badges. Should feel like a futuristic lab report card — technical, not decorative. Make it interactive: hover lifts the card with a subtle glow. Output a ready-to-hand-off prototype.",
    implementationNotes:
      "Claude Design construyó el prototipo inicial en una pasada, infiriendo la estética glassmorphism de la descripción sin darle valores hex. Los mandos de ajuste que generó (intensidad del glow, elevación, opacidad de badges) resultaron útiles de verdad para iterar rápido. El bundle de handoff incluía HTML/CSS anotado, specs del componente y un prompt pre-escrito para Claude Code, que lo consumió y produjo un componente React/Tailwind funcional en dos turnos. Tiempo total del brief al componente: unos 18 minutos.",
    result:
      "El ciclo de handoff funcionó de punta a punta. El componente resultante quedó tan cerca de nuestro ExperimentCard real que solo hubo que ajustar espaciados. La extracción de design system no se probó (requiere vincular el codebase durante el onboarding). El prototipo compartible por URL fue útil para recibir feedback antes de codificar.",
    whatWorked: [
      "Claude Design infirió la estética visual con precisión desde una descripción en prosa",
      "Los mandos de ajuste sustituyeron varios prompts de revisión de espaciado y color",
      "El bundle de handoff traía el prompt de Claude Code ya escrito: cero traducción manual",
      "La URL del prototipo permitió feedback asíncrono antes de comprometerse con el código",
      "Claude Code consumió el bundle correctamente al primer intento",
    ],
    whatFailed: [
      "Claude Design es research preview: los comentarios inline desaparecieron dos veces durante la iteración (bug conocido; workaround: pegar el comentario en el chat)",
      "La extracción de design system requiere acceso al codebase en el onboarding — no probada aquí",
      "El consumo de tokens fue significativo: Claude Design corre sobre Opus 4.7 y cuenta contra los límites de la suscripción",
      "El prototipo usó píxeles absolutos en algunos puntos; Claude Code tuvo que convertirlos a clases responsive de Tailwind",
      "Las funciones 3D y de shaders aún no aportan en trabajo de componentes UI estándar",
    ],
    nextIteration:
      "Probar el flujo completo de extracción de design system vinculando el codebase de Eggthropic en el onboarding. Medir con qué precisión aplica los tokens de Tailwind existentes a diseños nuevos sin especificarlos a mano.",
    references: [
      {
        label: "Presentación de Claude Design — Anthropic Labs",
        url: "https://www.anthropic.com/news/claude-design-anthropic-labs",
      },
      {
        label: "Primeros pasos con Claude Design — Help Center",
        url: "https://support.claude.com/en/articles/14604416-get-started-with-claude-design",
      },
      {
        label: "Claude for Creative Work — Anthropic",
        url: "https://www.anthropic.com/news/claude-for-creative-work",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "sap-hr-functional-ai-assistant",
    title: "Un asistente funcional con IA para SAP HR legacy",
    description:
      "Usar Claude y Notion para construir un asistente de conocimiento estructurado para equipos funcionales de SAP HR On-Premise — convirtiendo conocimiento disperso de configuración en contexto consultable.",
    category: "enterprise-ai",
    difficulty: "intermediate",
    status: "in-progress",
    date: "2026-05-08",
    tools: ["Claude", "Notion", "Anthropic API"],
    goal: "Comprobar si un asistente con Claude respaldado por una base de conocimiento estructurada en Notion puede responder con fiabilidad preguntas funcionales de SAP HR — infotipos, lógica de configuración, flujos de proceso — sin acceso directo al sistema SAP ni conocimientos de ABAP.",
    context:
      "SAP HR On-Premise (HCM) arrastra décadas de configuración acumulada: infotipos, jerarquías de features, lógica de esquemas, exits de cliente y reglas de proceso sin documentar que solo existen en hojas de cálculo, Words y la memoria de consultores que ya no están. Los equipos funcionales pierden horas buscando respuestas que técnicamente están en el sistema pero son inaccesibles en la práctica sin expertise profundo o contratos de soporte caros. Este experimento explora si Notion — como base de conocimiento estructurada — más Claude como capa de razonamiento pueden hacer ese conocimiento consultable en lenguaje natural, sin conectar con ningún sistema SAP vivo.",
    prompt:
      "You are a functional assistant for SAP HR On-Premise. You have access to a structured knowledge base containing infotype definitions, configuration notes, process flows, and known system behaviors. Answer the following question accurately and concisely. If the answer requires distinguishing between standard SAP behavior and customer-specific configuration, say so explicitly. If the answer is not in the knowledge base, say you don't know — do not invent configuration values.\n\nQuestion: {user_question}",
    implementationNotes:
      "El prototipo usa Notion como base de conocimiento con una estructura de página consistente por infotipo: definición, campos clave, transacciones estándar, errores de configuración habituales y dependencias de integración conocidas. Las páginas se obtienen vía API de Notion y se ensamblan en un bloque de contexto para la Messages API de Claude, con instrucción explícita de razonar SOLO sobre el contexto y no inventar valores de configuración. Cobertura actual: infotipos 0001–0008 (asignación organizativa, datos personales, nómina), el marco de medidas PA40 y un subconjunto de objetos de OM. No hay conexión con SAP: todo el conocimiento está curado a mano desde documentación funcional y notas de proyecto.",
    result:
      "Con infotipos y transacciones bien documentados, el asistente responde correctamente y cita la página de Notion correspondiente. Ante preguntas dependientes de configuración (p. ej. «¿qué controla la feature LGMST en nuestro sistema?») marca correctamente que depende del cliente y se niega a adivinar. Alucinaciones en definiciones de campos de infotipos: 0 observadas en 40 consultas de prueba. Donde sufre es en dependencias cruzadas (p. ej. interacciones del esquema de nómina) donde la cobertura en Notion es fina.",
    whatWorked: [
      "Notion como base de conocimiento es fácil de curar y actualizar sin ingeniería",
      "Claude aplica bien la instrucción de no inventar valores: sus negativas son precisas y útiles",
      "El parseo de preguntas en lenguaje natural maneja bien la jerga SAP sin preprocesado",
      "El ensamblado de contexto desde la API de Notion es suficientemente rápido para uso interactivo (<2 s)",
      "El asistente distingue comportamiento estándar de personalización del proyecto cuando la página de Notion lo distingue",
    ],
    whatFailed: [
      "La cobertura de la base de conocimiento es el cuello de botella: el asistente vale lo que valga lo documentado",
      "Las consultas entre infotipos (p. ej. «¿cómo afecta IT0001 a IT0007?») requieren contexto multi-página que supera la lógica actual",
      "Sin estrategia de retrieval: se pasa todo el contexto completo, lo que se encarece a escala",
      "Las preguntas de features y esquemas requieren un formato estructurado aparte, difícil de mantener en Notion",
      "No hay bucle de corrección: cuando el asistente falla, no hay mecanismo para marcar y corregir la página origen",
    ],
    nextIteration:
      "Implementar una capa de retrieval (búsqueda vectorial o índice por títulos y tags) que sustituya al contexto completo. Ampliar cobertura a básicos del esquema de nómina y las medidas de personal más comunes. Prototipar el flujo de corrección: si el usuario marca una respuesta como errónea, abrir la página de Notion origen para editar. Evaluar si el modo extended thinking mejora el razonamiento de configuración multi-paso.",
    references: [
      {
        label: "Anthropic Messages API — Tool Use",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
      },
      {
        label: "API de Notion — Retrieve a Page",
        url: "https://developers.notion.com/reference/retrieve-a-page",
      },
      {
        label: "Claude for Enterprise — Anthropic",
        url: "https://www.anthropic.com/enterprise",
      },
    ],
    lastVerified: "2026-05-08",
  },
];

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}

export function getExperimentsByCategory(
  category: string
): Experiment[] {
  if (category === "all") return experiments;
  return experiments.filter((e) => e.category === category);
}
