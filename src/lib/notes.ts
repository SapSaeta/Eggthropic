import type { Note } from "@/types";

export const notes: Note[] = [
  {
    slug: "claude-code-agentic-coding-2026",
    title: "Claude Code: cómo es programar con agentes en la práctica",
    summary:
      "Claude Code va mucho más allá del autocompletado: lee tu base de código completa, ejecuta comandos y entrega código commiteado en varios archivos. Esto es lo que significa para el día a día de un desarrollador.",
    date: "2026-04-05",
    category: "Claude Code",
    whatChanged:
      "Claude Code ha evolucionado de simple wrapper de CLI a un sistema de programación completamente agéntico. Capacidades clave: leer bases de código enteras, crear y editar archivos en cualquier directorio, ejecutar tests y comandos de terminal, y hacer commits — todo dentro de un modelo de permisos que pregunta antes de acciones irreversibles. Las actualizaciones de 2026 añadieron tareas programadas (Routines, en research preview) que corren en infraestructura de Anthropic y persisten con tu máquina apagada, además de Remote Control para ejecutar Claude Code en servidores o CI e interactuar vía API o cliente ligero.",
    whyItMatters:
      "La distancia entre «la IA escribe snippets» y «la IA entrega features» se ha acortado de verdad. Claude Code maneja refactors multi-paso, completa features desde un brief e itera según la salida de los tests — comprimiendo trabajo que antes exigía mucho cambio de contexto del desarrollador. El modelo de permisos y los checkpoints humanos explícitos mantienen el control en tus manos. Revisa siempre los cambios generados antes de mergear.",
    whatCanBeBuilt: [
      "Generación automática de descripciones de PR desde el git diff (ver nuestro experimento de Agent Skills)",
      "Refactors multi-paso dirigidos por una especificación de proyecto en CLAUDE.md",
      "Bucles de TDD donde Claude escribe el test, implementa la feature e itera hasta que pasa",
      "Rutinas programadas de higiene de código (actualizar dependencias, arreglar lint) sin disparo manual vía Routines",
      "Pipelines multi-agente con el Claude Agent SDK, con una instancia orquestando sub-agentes en paralelo",
    ],
    limitationsOrRisks: [
      "Claude Code requiere permisos explícitos — los defaults son conservadores, pero revisa siempre antes de commitear o mergear",
      "Las Routines corren en infraestructura de Anthropic: los datos enviados se rigen por su política de privacidad de API",
      "Remote Control funciona por red — úsalo solo en infraestructura de confianza con código sensible",
      "La programación agéntica amplifica los prompts vagos: un brief poco claro puede producir un cambio multi-archivo grande y equivocado",
      "No sustituye la revisión de código crítico de seguridad — valida siempre con tests y revisión humana antes de desplegar",
    ],
    references: [
      {
        label: "Claude Code Overview — Docs de Anthropic",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
      },
      {
        label: "Página de producto de Claude Code",
        url: "https://www.anthropic.com/claude-code",
      },
      {
        label: "Automatiza trabajo con routines — Docs de Claude Code",
        url: "https://code.claude.com/docs/en/routines",
      },
    ],
    relatedExperiments: ["claude-code-landing-page-builder"],
    lastVerified: "2026-05-07",
  },
  {
    slug: "mcp-the-usb-c-for-ai-tools",
    title: "MCP: el USB-C de las herramientas de IA",
    summary:
      "El Model Context Protocol es un estándar abierto para conectar aplicaciones de IA con datos y herramientas externas — adoptado masivamente por el ecosistema desde su lanzamiento en noviembre de 2024.",
    date: "2026-04-22",
    category: "MCP",
    whatChanged:
      "Anthropic lanzó MCP en noviembre de 2024 como protocolo open source basado en JSON-RPC 2.0, inspirado en el Language Server Protocol. Define tres primitivas: Tools (funciones ejecutables que el modelo puede llamar), Resources (datos estructurados para el contexto) y Prompts (plantillas reutilizables). Es un estándar abierto — no exclusivo de Anthropic — con SDKs para todos los lenguajes principales y adopción amplia en la industria. El MCP Registry oficial llegó en septiembre de 2025 (registry.modelcontextprotocol.io) como catálogo centralizado de servidores. Anthropic también lanzó el MCP Connector en la API, que permite conectar con servidores MCP remotos directamente desde la Messages API sin cliente aparte. MCP Apps (SEP-1865), formalizado a principios de 2026, extiende el protocolo para servir interfaces HTML interactivas desde servidores MCP vía iframes aislados. Nota: el transporte SSE quedó obsoleto en la revisión de spec de 2025-03-26; el transporte remoto actual es Streamable HTTP.",
    whyItMatters:
      "MCP elimina el impuesto de las integraciones a medida. Antes, cada herramienta de IA necesitaba su conector propio para cada fuente de datos. Con MCP construyes un servidor por fuente y cualquier host compatible se conecta. Y compone: cuantos más hosts adoptan MCP (Claude, IDEs, agentes propios), más sitios funcionan con tu servidor automáticamente. El conector de la API elimina la necesidad de un cliente MCP local, simplificando mucho las arquitecturas de agentes en servidor.",
    whatCanBeBuilt: [
      "Servidores MCP que exponen APIs internas, bases de datos o sistemas de archivos a agentes Claude",
      "Herramientas de desarrollo que leen contexto vivo del codebase vía resources",
      "Flujos multi-agente donde cada agente tiene su servidor MCP de dominio",
      "Dashboards interactivos servidos desde servidores MCP con MCP Apps (SEP-1865)",
      "Servidores MCP que envuelven APIs REST legacy para hacerlas accesibles a agentes",
      "Servidores MCP locales de desarrollo para probar capacidades antes de desplegar",
    ],
    limitationsOrRisks: [
      "Trata los servidores MCP como integraciones no confiables salvo que controles o hayas auditado su código — un servidor malicioso puede enviar respuestas manipuladas",
      "Inyección de prompts: las respuestas de tools entran en el contexto de Claude; un servidor malicioso puede incrustar instrucciones para secuestrar su comportamiento",
      "Riesgo de exfiltración: un servidor comprometido con permisos amplios puede leer archivos, variables de entorno o API keys y sacarlas por red",
      "Permisos excesivos: concede solo las tools y resources que el servidor necesita de verdad — trata el scoping como permisos de archivos UNIX",
      "Riesgo de RCE en transporte STDIO: investigadores demostraron que el modelo de ejecución STDIO puede explotarse si el binario del servidor no es de confianza; ejecuta solo binarios de fuentes verificadas",
      "La spec de autorización OAuth para MCP (actualización de junio 2025) sigue evolucionando — revísala antes de implementar flujos de auth",
      "El rendimiento del servidor MCP impacta directamente en la latencia del agente — las lecturas lentas bloquean síncronamente",
      "La spec no trae rate limiting de serie — impleméntalo en la capa del servidor",
    ],
    references: [
      {
        label: "Presentación del Model Context Protocol — Anthropic",
        url: "https://www.anthropic.com/news/model-context-protocol",
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
        label: "¿Qué es MCP? — Docs de Anthropic",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp",
      },
      {
        label: "Code Execution with MCP — Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
      },
    ],
    relatedExperiments: ["mcp-visual-explainer"],
    lastVerified: "2026-05-07",
  },
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
