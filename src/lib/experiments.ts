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
  {
    slug: "sap-abap-clean-code-refactor",
    title: "Refactor de ABAP legacy a Clean ABAP con Claude",
    description:
      "Tomar un report ABAP clásico de ausencias HCM con 13 defectos plantados y pedirle a Claude cuatro cosas en orden: revisión con severidades, refactor completo, riesgos y — la parte que casi nadie pide — cuándo NO refactorizar.",
    category: "sap",
    difficulty: "intermediate",
    status: "in-progress",
    date: "2026-07-06",
    tools: ["Claude", "Cowork", "ABAP", "Clean ABAP"],
    goal: "Comprobar si Claude puede revisar un report ABAP clásico contra la guía Clean ABAP oficial de SAP y producir un refactor completo que preserve la semántica, con riesgos documentados y criterios honestos de cuándo no tocar el código.",
    context:
      "La revisión y refactor de programas Z heredados es una tarea semanal real de cualquier consultor ABAP: SELECT anidados con patrón N+1, tablas con cabecera, fieldcat manual de 16 líneas, números mágicos y lógica imposible de testear. El experimento usa un report ficticio pero realista de ausencias SAP HCM (IT2001 + PA0001 + T554T) con 13 defectos inventariados a propósito antes de la prueba, para poder medir la detección contra una lista cerrada.",
    prompt:
      "Actúa como revisor senior de ABAP aplicando la guía Clean ABAP oficial de SAP. Contexto: release objetivo, módulo, motivo del refactor y restricciones. Haz exactamente esto, en orden: 1) REVISIÓN: problemas clasificados por severidad citando la regla Clean ABAP. 2) REFACTOR: reescribe el programa preservando la semántica; marca cualquier punto donde pueda variar. 3) RIESGOS: qué podría romperse y qué pruebas de regresión harías. 4) NO REFACTORIZAR: di explícitamente si en este caso no conviene tocar el código y por qué. No inventes tablas ni funciones; marca el resultado como pendiente de validación sintáctica en sistema real.",
    implementationNotes:
      "El flujo produce cuatro artefactos: review.md con los hallazgos por severidad, after.abap con el refactor (clase local, un único JOIN en vez de miles de accesos a BD, lógica separada del ALV y testeable, CL_SALV_TABLE, constantes con nombre), un checklist Clean ABAP reutilizable con sección específica HCM (delimitaciones, SPRPS, autorizaciones) y el prompt afinado. La estructura del prompt — revisión antes que refactor, y el paso 4 obligatorio — es lo que evita el sesgo de «refactorizar siempre».",
    result:
      "Detección 13/13 sobre los defectos inventariados, con severidades y regla Clean ABAP citada. El refactor produjo la estructura esperada. Matices honestos: el 13/13 es cota superior porque el mismo modelo escribió el código defectuoso; la primera versión del refactor usó un tipo de datos inadecuado que hubo que corregir en sesión; y sin sistema SAP nada se compila — todo el código va marcado como pendiente de validar en un sistema real.",
    whatWorked: [
      "El orden revisión → refactor → riesgos → cuándo-no-refactorizar produce salidas completas y honestas en una sola pasada",
      "La sección «cuándo NO refactorizar» salió con criterios accionables: sin regresión definida, cerca de cierre de nómina o sobre código estable, no se toca",
      "El refactor eliminó el patrón N+1 con un único JOIN y dejó la lógica de negocio testeable con ABAP Unit",
      "El checklist resultante con sección HCM es reutilizable en revisiones manuales",
    ],
    whatFailed: [
      "La primera versión usó /iwbep/t_cod_select_options como tipo de rango (dependencia innecesaria de Gateway) — corregido a TYPE RANGE OF: la salida necesita revisión humana siempre",
      "El 13/13 de detección tiene sesgo de auto-revisión: el mismo modelo plantó los defectos",
      "Sin sistema SAP no hay validación sintáctica ni comparación de salidas antes/después con datos",
      "El JOIN a PA0001 vigente asume un único registro válido: con delimitaciones no triviales la semántica podría variar",
    ],
    nextIteration:
      "Prueba de control con un report Z real anonimizado que Claude no haya escrito: contar hallazgos correctos, falsos positivos y tiempo frente a una revisión manual. Si supera el control, convertir el flujo en una Agent Skill de revisión ABAP.",
    references: [
      {
        label: "Clean ABAP Style Guide — SAP/styleguides",
        url: "https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md",
      },
      {
        label: "Clean ABAP Cheat Sheet",
        url: "https://github.com/SAP/styleguides/blob/main/clean-abap/cheat-sheet/CheatSheet.md",
      },
    ],
    labPage: "/sap",
    lastVerified: "2026-07-06",
  },
  {
    slug: "sap-abap-legacy-explainer",
    title: "Explicar ABAP legacy a consultores funcionales",
    description:
      "Convertir un cálculo de plus de antigüedad HCM de estilo 2008 — sin un solo comentario útil — en dos explicaciones: una funcional sin jerga y otra técnica con flujo de datos, bugs sospechados y preguntas a verificar.",
    category: "sap",
    difficulty: "intermediate",
    status: "in-progress",
    date: "2026-07-06",
    tools: ["Claude", "Cowork", "ABAP", "SAP HCM"],
    goal: "Comprobar si Claude puede reconstruir la intención funcional de ABAP HCM legacy sin documentación — incluyendo patrones específicos de HR como la LDB PNP, rp_provide_from_last o la estructura DAR/DAT del infotipo 0041 — y servirla a dos audiencias distintas con el mismo análisis.",
    context:
      "Todo consultor SAP conoce la escena: un programa Z de hace quince años, sin comentarios, cuyo autor se fue hace una década, y un funcional preguntando «¿pero esto qué calcula exactamente?». El experimento usa un fragmento ficticio pero realista de cálculo de plus de antigüedad con 7 elementos plantados: un bloque de código muerto, un bug latente (índice sin formatear a dos dígitos en un ASSIGN dinámico), tres exclusiones silenciosas y dos supuestos de configuración del cliente.",
    prompt:
      "Eres un consultor SAP senior técnico-funcional. Te paso un programa ABAP legacy sin documentación. Genera DOS explicaciones separadas: A) FUNCIONAL, para un consultor sin ABAP — qué hace en una frase, paso a paso en lenguaje de negocio, tabla de infotipos usados, riesgos funcionales y preguntas concretas a validar. B) TÉCNICA, para el ABAPer que lo hereda — arquitectura, flujo de datos, puntos delicados y sugerencia breve de refactor. Regla clave: si un comportamiento depende de configuración del cliente (clases de fecha, CC-nóminas, subtipos), NO lo des por hecho — márcalo como pregunta a verificar. Si sospechas un bug, dilo como sospecha y explica cómo verificarlo.",
    implementationNotes:
      "La salida en dos capas permite usar el mismo análisis con dos audiencias sin redactar dos veces. La capa funcional tradujo el código a lenguaje de negocio con tabla de tramos, cinco riesgos (incluido el clásico «hay empleados que desaparecen del listado sin aviso») y cinco preguntas para negocio. La técnica reconstruyó el flujo de datos, señaló el código muerto y levantó la sospecha del bug del índice ('DAR1' vs 'DAR01') con propuesta de verificación.",
    result:
      "7/7 elementos plantados detectados: código muerto, bug latente como sospecha verificable, exclusiones silenciosas traducidas a riesgo funcional, y — lo más importante — las convenciones de configuración marcadas como preguntas, no como hechos. Misma advertencia que el caso de refactor: el modelo explicó código que él mismo construyó, así que es cota superior. La interpretación de los patrones HR está pendiente de contraste con documentación oficial y con la experiencia real del consultor.",
    whatWorked: [
      "El formato de dos capas (funcional/técnica) produce entregables usables tal cual, sin retrabajo",
      "La regla «marcar convenciones de cliente como pregunta a verificar» se cumplió — es la mitigación clave contra la sobreconfianza",
      "Detectó el bug latente del índice dinámico y lo presentó como sospecha con método de verificación, no como certeza",
      "La aclaración «este programa no graba nada en SAP» evita el malentendido funcional más caro",
    ],
    whatFailed: [
      "Sesgo de auto-explicación: el agente conocía los defectos porque diseñó la entrada",
      "La corrección de la interpretación de patrones HR (LDB PNP, HR_HK_DIFF_BT_2_DATES) no se ha contrastado contra un sistema",
      "Sin métrica de tiempo frente a documentar a mano: falta la línea base",
    ],
    nextIteration:
      "Pasar el prompt a un programa Z real del trabajo (anonimizado) y que el consultor puntúe con rúbrica: exactitud funcional, exactitud técnica, errores de interpretación y preguntas útiles generadas. Es el caso con mejor relación esfuerzo/valor: no genera código que deba compilar.",
    references: [
      {
        label: "Clean ABAP Style Guide — SAP/styleguides",
        url: "https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md",
      },
      {
        label: "Roadmap 2026 de Joule for Developers (ABAP AI) — SAP",
        url: "https://community.sap.com/t5/technology-blog-posts-by-sap/our-2026-roadmap-for-joule-for-developers-abap-ai-capabilities/ba-p/14360358",
      },
    ],
    labPage: "/sap",
    lastVerified: "2026-07-06",
  },
  {
    slug: "sap-hcm-excel-validator",
    title: "Un validador de Excel para cargas SAP HCM, probado de verdad",
    description:
      "Reglas de validación → validador Python → Excel con 10 errores plantados → ejecución real con evidencia: 10/10 detecciones, 0 falsos positivos, a la primera. La diferencia entre «la IA me hizo un script» y «tengo un validador fiable».",
    category: "sap",
    difficulty: "intermediate",
    status: "complete",
    date: "2026-07-06",
    tools: ["Claude", "Cowork", "Python", "openpyxl", "SAP HCM"],
    goal: "Comprobar si Claude puede generar un conjunto completo de reglas de validación para una carga masiva del infotipo 2010 y su implementación ejecutable — y verificarlo objetivamente con un Excel de errores plantados y una matriz esperado-vs-real.",
    context:
      "Los Excel que llegan de RRHH para cargas masivas traen fechas imposibles, conceptos no autorizados, duplicados y 250 horas donde debían ser 25. Cada error que entra en SAP es una incidencia; cada error cazado antes, minutos de corrección en el fichero. El experimento define primero 12 reglas numeradas con severidad (formatos, catálogos, condicionales entre campos, duplicados y patrones sospechosos), después el validador, y por último un Excel de prueba con 10 incidencias plantadas ANTES de ejecutar nada.",
    prompt:
      "Actúa como consultor SAP HCM técnico-funcional. Voy a preparar una carga masiva vía Excel para el infotipo indicado y quiero validar el fichero ANTES de cargarlo. Haz esto en orden: 1) REGLAS: tabla de reglas numeradas con severidad ERROR/WARNING — formatos, fechas vs periodo, catálogos, condicionales entre campos, rangos, duplicados y patrones sospechosos. 2) VALIDADOR: script Python (openpyxl) que aplique las reglas, escriba un errores.csv con mensajes EN LENGUAJE FUNCIONAL y devuelva exit code 1 si hay errores. 3) PRUEBA: Excel de prueba con errores plantados conocidos y matriz esperado-vs-real. 4) RESUMEN FUNCIONAL para el usuario no técnico. El catálogo de valores es configuración del cliente: márcalo como parámetro. El validador NO sustituye las validaciones de SAP: es un prefiltro.",
    implementationNotes:
      "Escenario ficticio: carga mensual IT2010 (España), Excel de 6 columnas, catálogo mock de 4 CC-nóminas. Las 12 reglas cubren desde el formato del número de personal hasta la detección de duplicados exactos y avisos por valores sospechosos (más de 80 horas en un registro, mezcla de separadores decimales). El validador genera errores.csv con fila, campo, regla, severidad y mensaje comprensible por un usuario de RRHH, más un veredicto: apto o no apto para carga.",
    result:
      "Ejecutado de verdad en sandbox: 14 filas de datos, 8 errores y 2 avisos detectados — los 10 plantados, cero falsos positivos, y el script funcionó a la primera ejecución sin correcciones. Veredicto automático «NO apto para carga» con exit code 1. Es la única prueba de la primera tanda con verificación objetiva: el código se ejecutó contra datos y la salida se comparó mecánicamente con lo esperado. Lo que NO demuestra: que reduzca errores en cargas reales — el escenario era ficticio.",
    whatWorked: [
      "El patrón reglas → script → errores plantados → matriz esperado-vs-real funciona de punta a punta sin sistema SAP",
      "El script fue correcto a la primera ejecución, sin iteraciones de corrección",
      "Los mensajes en lenguaje funcional permiten que RRHH corrija el fichero sin escalar al técnico",
      "El exit code hace el validador encadenable en automatizaciones",
    ],
    whatFailed: [
      "No demuestra reducción de errores en cargas reales: los errores los plantó el propio experimento",
      "El catálogo de CC-nóminas va hardcodeado: en un cliente real debe venir de configuración exportada",
      "Riesgo de falsa seguridad: «apto» no garantiza que SAP acepte — configuración, bloqueos y autorizaciones quedan fuera",
    ],
    nextIteration:
      "Ejecutar el validador contra el Excel (anonimizado) de una carga real pasada y contar qué habría detectado: esa cifra será la primera métrica real del laboratorio y decidirá si el caso se convierte en Agent Skill.",
    references: [
      {
        label: "openpyxl — documentación oficial",
        url: "https://openpyxl.readthedocs.io",
      },
      {
        label: "Agent Skills — documentación de Anthropic",
        url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
      },
    ],
    labPage: "/sap",
    lastVerified: "2026-07-06",
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
