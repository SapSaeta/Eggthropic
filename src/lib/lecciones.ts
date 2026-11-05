// ─── Lecciones diarias ────────────────────────────────────────────────────────
// Una lección = 1-2 minutos: una idea, un visual, tres puntos y un quiz.
// Cada afirmación lleva etiqueta como en el resto del laboratorio:
//   HECHO = documentado con fuente · HIPÓTESIS = razonable pero por probar.
// Para añadir una lección: nueva entrada al final (la app la ofrece sola).

export type Eje =
  | "agentes"
  | "protocolos"
  | "datos"
  | "arquitectura"
  | "seguridad"
  | "normativa";

export const EJES: Record<Eje, { nombre: string; color: string }> = {
  agentes: { nombre: "Agentes", color: "#0a6ed1" },
  protocolos: { nombre: "Protocolos", color: "#7a4fd6" },
  datos: { nombre: "Datos HCM", color: "#0d9488" },
  arquitectura: { nombre: "Arquitectura", color: "#c2542b" },
  seguridad: { nombre: "Seguridad", color: "#d6455d" },
  normativa: { nombre: "Normativa", color: "#c79b00" },
};

export type VisualKey =
  | "bucle"
  | "pila"
  | "mcp"
  | "a2a"
  | "cleancore"
  | "hcm"
  | "odata"
  | "permisos"
  | "flujo"
  | "trazas"
  | "riesgo"
  | "anonimizar"
  | "plataforma"
  | "pitch";

export interface Leccion {
  id: string;
  n: number;
  eje: Eje;
  titulo: string;
  gancho: string;
  minutos: number;
  puntos: [string, string, string];
  visual: VisualKey;
  etiqueta: "HECHO" | "HIPÓTESIS";
  fuente?: { label: string; href?: string };
  quiz: {
    pregunta: string;
    opciones: string[];
    correcta: number;
    explicacion: string;
  };
}

export const lecciones: Leccion[] = [
  {
    id: "agente-vs-chatbot",
    n: 1,
    eje: "agentes",
    titulo: "Agente ≠ chatbot",
    gancho: "Un chatbot contesta. Un agente hace cosas hasta cumplir el objetivo.",
    minutos: 1,
    puntos: [
      "El agente recibe un objetivo, no solo una pregunta.",
      "Planifica, usa herramientas y mira el resultado antes de seguir.",
      "Ese bucle es lo que hay que vigilar: permisos, trazas y límites.",
    ],
    visual: "bucle",
    etiqueta: "HECHO",
    quiz: {
      pregunta: "¿Qué distingue a un agente de un chatbot?",
      opciones: [
        "Que habla con más educación",
        "Que usa herramientas en un bucle hasta cumplir un objetivo",
        "Que siempre es más rápido",
      ],
      correcta: 1,
      explicacion:
        "Lo que define al agente es el bucle objetivo → plan → herramienta → resultado. Por eso hay que gobernar lo que puede tocar.",
    },
  },
  {
    id: "cuatro-capas",
    n: 2,
    eje: "arquitectura",
    titulo: "La empresa autónoma en 4 capas",
    gancho: "Dónde encaja cada pieza que SAP presentó en TechEd 2026.",
    minutos: 2,
    puntos: [
      "Joule Work es la interfaz; Joule Studio es donde se crean y amplían agentes.",
      "Datos y contexto (Business Data Cloud, Knowledge Graph) alimentan a los agentes.",
      "Gobierno (AI Gateway, Agent Hub) controla permisos, costes y cumplimiento.",
    ],
    visual: "pila",
    etiqueta: "HECHO",
    fuente: { label: "aancos.com · SAP TechEd 2026 (05/11/2026). Fechas según SAP y el autor." },
    quiz: {
      pregunta: "¿En qué capa viven el AI Gateway y la auditoría?",
      opciones: ["Joule Work", "Datos y contexto", "Gobierno"],
      correcta: 2,
      explicacion:
        "Gobierno: Enterprise AI Gateway, AI Agent Hub y AI Governance Assistant. El Gateway se anunció para Q1 2027.",
    },
  },
  {
    id: "mcp",
    n: 3,
    eje: "protocolos",
    titulo: "MCP en 60 segundos",
    gancho: "El enchufe estándar entre un agente y sus herramientas.",
    minutos: 1,
    puntos: [
      "MCP es un protocolo abierto: un cliente (el agente) habla con servidores MCP.",
      "Cada servidor expone herramientas, recursos y prompts.",
      "Un mismo servidor sirve a muchos agentes: lo escribes una vez.",
    ],
    visual: "mcp",
    etiqueta: "HECHO",
    fuente: { label: "modelcontextprotocol.io", href: "https://modelcontextprotocol.io" },
    quiz: {
      pregunta: "¿Qué expone un servidor MCP?",
      opciones: [
        "Herramientas, recursos y prompts",
        "Solo ficheros de texto",
        "Modelos de lenguaje",
      ],
      correcta: 0,
      explicacion:
        "Tools (acciones), resources (datos que leer) y prompts (plantillas). El agente decide cuándo usarlos.",
    },
  },
  {
    id: "a2a",
    n: 4,
    eje: "protocolos",
    titulo: "A2A: agentes que hablan con agentes",
    gancho: "MCP baja a las herramientas. A2A va de lado, hacia otros agentes.",
    minutos: 1,
    puntos: [
      "A2A define cómo un agente descubre y delega tareas a otro agente.",
      "Cada agente se describe con una ficha (Agent Card).",
      "No compiten: MCP = agente ↔ herramienta · A2A = agente ↔ agente.",
    ],
    visual: "a2a",
    etiqueta: "HECHO",
    fuente: { label: "a2a-protocol.org", href: "https://a2a-protocol.org" },
    quiz: {
      pregunta: "Un agente de nómina pide ayuda a un agente de contratos. ¿Qué protocolo encaja?",
      opciones: ["MCP", "A2A", "OData"],
      correcta: 1,
      explicacion:
        "Es comunicación entre agentes: A2A. Si el agente llamara a una API o una base de datos, sería MCP.",
    },
  },
  {
    id: "clean-core",
    n: 5,
    eje: "arquitectura",
    titulo: "Clean Core",
    gancho: "Un núcleo limpio es lo que permite que un agente sea fiable.",
    minutos: 2,
    puntos: [
      "Clean core: no modificar el estándar; extender por APIs liberadas.",
      "Un agente necesita APIs estables, no RFC sin control ni atajos.",
      "Cuanto más limpio el núcleo, más fácil darle permisos mínimos al agente.",
    ],
    visual: "cleancore",
    etiqueta: "HECHO",
    fuente: { label: "aancos.com · RFC sin control y atajos no encajan con agentes fiables" },
    quiz: {
      pregunta: "¿Cómo debería un agente acceder a SAP en un núcleo limpio?",
      opciones: [
        "Con RFC directas a tablas",
        "A través de APIs liberadas y controladas",
        "Modificando el estándar",
      ],
      correcta: 1,
      explicacion:
        "APIs liberadas: estables, versionadas y con permisos. Es el cimiento donde está la oportunidad.",
    },
  },
  {
    id: "modelo-ec",
    n: 6,
    eje: "datos",
    titulo: "El modelo de datos de Employee Central",
    gancho: "Persona → empleo → puesto → departamento. Cuatro saltos.",
    minutos: 2,
    puntos: [
      "PerPerson es la persona; EmpEmployment, su relación laboral.",
      "EmpJob guarda la información del puesto; FODepartment, el departamento.",
      "Las entidades se enlazan por propiedades de navegación (…Nav).",
    ],
    visual: "hcm",
    etiqueta: "HECHO",
    fuente: {
      label: "SAP Learning · Exploring EC OData API",
      href: "https://learning.sap.com/courses/exploring-sap-successfactors-employee-central-odata-api",
    },
    quiz: {
      pregunta: "¿Qué propiedad lleva de PerPerson a EmpEmployment?",
      opciones: ["jobInfoNav", "employmentNav", "departmentNav"],
      correcta: 1,
      explicacion:
        "employmentNav. Luego jobInfoNav te lleva a EmpJob y departmentNav al departamento. Verifica siempre el $metadata de tu instancia.",
    },
  },
  {
    id: "odata",
    n: 7,
    eje: "datos",
    titulo: "Anatomía de una llamada OData",
    gancho: "Una URL bien construida trae solo lo necesario, en una llamada.",
    minutos: 2,
    puntos: [
      "$select limita columnas; $filter limita filas; $top limita cuántas.",
      "$expand trae entidades relacionadas en la misma llamada.",
      "Pedir menos datos también es seguridad: mínimo necesario.",
    ],
    visual: "odata",
    etiqueta: "HECHO",
    fuente: {
      label: "SAP Learning · ejemplo con employmentNav/jobInfoNav",
      href: "https://learning.sap.com/courses/exploring-sap-successfactors-employee-central-odata-api",
    },
    quiz: {
      pregunta: "¿Para qué sirve $expand?",
      opciones: [
        "Para ordenar los resultados",
        "Para traer entidades relacionadas en la misma llamada",
        "Para borrar registros",
      ],
      correcta: 1,
      explicacion:
        "Evita hacer una llamada por cada entidad relacionada. Úsalo con $select para no traer de más.",
    },
  },
  {
    id: "permisos-minimos",
    n: 8,
    eje: "seguridad",
    titulo: "Permisos mínimos",
    gancho: "El agente solo puede tocar lo que necesita. Nada más.",
    minutos: 2,
    puntos: [
      "El agente tiene su propia identidad, no la de una persona.",
      "Empieza en solo lectura; la escritura se gana caso a caso.",
      "En SuccessFactors se controla con roles y permisos (RBP).",
    ],
    visual: "permisos",
    etiqueta: "HECHO",
    fuente: { label: "aancos.com · identidad del agente y permisos mínimos como cimientos" },
    quiz: {
      pregunta: "¿Con qué permisos arrancas un agente nuevo de HR?",
      opciones: ["Administrador, por si acaso", "Solo lectura de lo imprescindible", "Los de su jefe"],
      correcta: 1,
      explicacion:
        "Mínimo privilegio: solo lectura y solo lo imprescindible. Los permisos se amplían con una razón escrita.",
    },
  },
  {
    id: "humano-en-el-bucle",
    n: 9,
    eje: "seguridad",
    titulo: "Humano en el bucle",
    gancho: "Leer es barato. Escribir necesita un 'sí' humano.",
    minutos: 2,
    puntos: [
      "Las acciones de lectura pueden ser automáticas.",
      "Las de escritura se detienen en una puerta de aprobación.",
      "Cada paso queda en el registro: quién pidió, quién aprobó, qué se hizo.",
    ],
    visual: "flujo",
    etiqueta: "HIPÓTESIS",
    fuente: { label: "Patrón de diseño propuesto en el plan: aprobación humana + registro" },
    quiz: {
      pregunta: "Un agente quiere cambiar la dirección de un empleado. ¿Qué haces?",
      opciones: [
        "Dejo que lo haga solo",
        "Lo paro en una puerta de aprobación humana",
        "Prohíbo todos los agentes",
      ],
      correcta: 1,
      explicacion:
        "Las escrituras en datos de RRHH pasan por aprobación humana y se registran. Es el equilibrio entre utilidad y control.",
    },
  },
  {
    id: "trazas",
    n: 10,
    eje: "seguridad",
    titulo: "Trazas: lo que no se registra no ocurrió",
    gancho: "Cuando algo sale mal, la traza responde: ¿quién, qué, cuándo, por qué?",
    minutos: 1,
    puntos: [
      "Registra la petición, la herramienta usada, los parámetros y el resultado.",
      "Guarda quién aprobó y cuándo.",
      "Sin traza no hay auditoría, ni mejora, ni defensa ante un incidente.",
    ],
    visual: "trazas",
    etiqueta: "HECHO",
    fuente: { label: "aancos.com · AI Gateway: auditoría, permisos, costes y cumplimiento" },
    quiz: {
      pregunta: "¿Qué debe poder responder una buena traza?",
      opciones: [
        "Solo la hora",
        "Quién, qué, cuándo y por qué",
        "Cuánto costó el café",
      ],
      correcta: 1,
      explicacion:
        "Actor, acción, momento y motivo (más el resultado). Con eso se reconstruye cualquier incidente.",
    },
  },
  {
    id: "ai-act",
    n: 11,
    eje: "normativa",
    titulo: "AI Act: RRHH es alto riesgo",
    gancho: "Tu nicho está en la zona más regulada. Es una oportunidad.",
    minutos: 2,
    puntos: [
      "El Reglamento de IA clasifica por riesgo: inaceptable, alto, limitado y mínimo.",
      "Empleo y gestión de trabajadores figuran entre los usos de alto riesgo (Anexo III).",
      "Alto riesgo exige gestión de riesgos, registro, supervisión humana y calidad de datos.",
    ],
    visual: "riesgo",
    etiqueta: "HECHO",
    fuente: {
      label: "AI Act · Anexo III",
      href: "https://artificialintelligenceact.eu/annex/3/",
    },
    quiz: {
      pregunta: "Un agente que ayuda a evaluar el rendimiento de empleados, ¿qué nivel de riesgo tiene?",
      opciones: ["Mínimo", "Limitado", "Alto"],
      correcta: 2,
      explicacion:
        "Alto riesgo: el Anexo III incluye empleo, selección y evaluación de trabajadores. Pide supervisión humana y trazabilidad.",
    },
  },
  {
    id: "rgpd-datos-reales",
    n: 12,
    eje: "normativa",
    titulo: "Datos reales, nunca en pruebas",
    gancho: "Los experimentos usan datos ficticios. Siempre.",
    minutos: 1,
    puntos: [
      "Nombre, documento de identidad, IBAN y salario son datos personales.",
      "Minimiza: usa solo lo necesario y sustituye lo demás por datos ficticios.",
      "Anonimizar antes de salir del sistema, no después.",
    ],
    visual: "anonimizar",
    etiqueta: "HECHO",
    fuente: { label: "RGPD", href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj" },
    quiz: {
      pregunta: "¿Con qué datos pruebas tu agente de HR?",
      opciones: [
        "Con los de la plantilla real, en pequeño",
        "Con datos ficticios o de un tenant de pruebas",
        "Con los del cliente si me deja",
      ],
      correcta: 1,
      explicacion:
        "Datos ficticios o tenant de pruebas autorizado. Nunca datos reales de empleados en experimentos personales.",
    },
  },
  {
    id: "joule-vs-propio",
    n: 13,
    eje: "agentes",
    titulo: "Joule Studio o servidor MCP propio",
    gancho: "Cuánto control necesitas decide cuánto construyes.",
    minutos: 2,
    puntos: [
      "Joule Studio: rápido y declarativo, para agentes dentro del ecosistema SAP.",
      "Servidor MCP propio: más control sobre herramientas, permisos y pruebas.",
      "Lo habitual será una mezcla: Studio por fuera, MCP propio por dentro.",
    ],
    visual: "plataforma",
    etiqueta: "HIPÓTESIS",
    fuente: { label: "aancos.com · Joule Studio: lenguaje natural, CLI, MCP, n8n" },
    quiz: {
      pregunta: "Necesitas control fino de permisos y pruebas automáticas. ¿Qué pesa más?",
      opciones: ["Todo en Studio, sin código", "Un servidor MCP propio", "Un chatbot genérico"],
      correcta: 1,
      explicacion:
        "Con control fino de herramientas y pruebas, un servidor propio gana. Es una heurística: valídala en tu caso.",
    },
  },
  {
    id: "mi-pitch",
    n: 14,
    eje: "arquitectura",
    titulo: "Tu frase de 30 segundos",
    gancho: "Cómo explicar en una línea qué haces y por qué importa.",
    minutos: 2,
    puntos: [
      "Quién: empresas con SAP HCM. Qué: agentes de IA fiables.",
      "Cómo: APIs limpias, permisos mínimos y trazas.",
      "Por qué: RRHH es alto riesgo, y ahí casi nadie sabe hacerlo bien.",
    ],
    visual: "pitch",
    etiqueta: "HIPÓTESIS",
    quiz: {
      pregunta: "¿Cuál NO es un cimiento para agentes fiables?",
      opciones: ["Permisos mínimos", "Trazas y pruebas", "Un prompt muy largo y confiado"],
      correcta: 2,
      explicacion:
        "Un prompt largo no sustituye a permisos, trazas y pruebas. Los cimientos están fuera del modelo.",
    },
  },
];

export const lecciones_por_id = Object.fromEntries(lecciones.map((l) => [l.id, l]));
