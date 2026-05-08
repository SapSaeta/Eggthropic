import type { Experiment } from "@/types";

export const experiments: Experiment[] = [
  {
    slug: "claude-code-landing-page-builder",
    title: "Claude Code Landing Page Builder",
    description:
      "Using Claude Code to scaffold, design, and iterate on a complete marketing landing page from a single prompt — including Tailwind layout, copy, and responsive design.",
    category: "claude-code",
    difficulty: "beginner",
    status: "complete",
    date: "2026-04-10",
    tools: ["Claude Code", "Next.js", "Tailwind CSS", "Framer Motion"],
    goal: "Determine how far a single Claude Code session can take you from blank canvas to a deployable landing page without switching tools or leaving the terminal.",
    context:
      "Claude Code is Anthropic's agentic coding CLI that reads your codebase, proposes changes across files, runs tests, and commits code. This experiment treats Claude Code as a pair programmer for a full design-to-code workflow — no Figma, no manual scaffolding. The session started with a one-line brief: build a SaaS landing page for a fictional developer tool called 'Stackr'.",
    prompt:
      'Build a production-ready Next.js landing page for a developer tool called "Stackr" — a CLI that auto-generates API documentation from TypeScript source. Include a hero, features grid, pricing table (3 tiers), and a footer. Use Tailwind CSS, dark mode by default, and add subtle Framer Motion entrance animations. Keep the copy technical but accessible. No placeholder images.',
    implementationNotes:
      "Claude Code created 14 files in a single session: the Next.js app scaffold, Tailwind config, 6 reusable components, and all page sections. It independently installed Framer Motion, wrote a custom hook for scroll-triggered animations, and validated the responsive layout by listing all breakpoints. The entire session took 23 turns and approximately 4 minutes of active generation.",
    result:
      "A fully functional, visually complete landing page with all requested sections. The Framer Motion animations were correctly gated behind a prefers-reduced-motion check without being asked. The pricing table included a recommended-tier highlight. Estimated equivalent manual development time: 2-4 hours.",
    whatWorked: [
      "Single prompt generated a coherent multi-file structure",
      "Claude spontaneously added accessibility improvements (aria-label, reduced-motion)",
      "Component naming was consistent across the session",
      "The generated copy was on-brand for a developer tool without any examples provided",
    ],
    whatFailed: [
      "The initial mobile nav required two revision prompts to get right",
      "Framer Motion stagger timing needed manual tweaking for the features grid",
      "Claude did not add og:image or Twitter card meta tags without being asked",
    ],
    nextIteration:
      "Test the same prompt with Claude Code's --plan flag to compare planned vs. reactive generation. Also explore using a CLAUDE.md project brief to reduce revision cycles.",
    references: [
      {
        label: "Claude Code Overview — Anthropic Docs",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
      },
      {
        label: "Claude Code CLI Reference",
        url: "https://docs.anthropic.com/en/docs/claude-code/cli-reference",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "first-custom-agent-skill",
    labPage: "/lab/skills",
    title: "First Custom Agent Skill",
    description:
      "Building a custom Agent Skill for Claude Code that automates PR description generation from git diff output — packaged as a reusable SKILL.md with YAML frontmatter.",
    category: "skills",
    difficulty: "intermediate",
    status: "complete",
    date: "2026-04-18",
    tools: ["Claude Code", "Agent Skills", "Git", "Bash"],
    goal:
      "Understand the Agent Skills format by building a practical skill from scratch: auto-generating structured pull request descriptions from staged changes.",
    context:
      "Agent Skills are directories containing a SKILL.md file with YAML frontmatter that give agents additional capabilities. Skills are supported across Claude.ai, Claude Code, the Claude Agent SDK, and the Claude Developer Platform. This experiment builds a skill called pr-describe that reads git diff output and produces a standardized PR description following conventional commits.",
    prompt:
      "Given the output of `git diff --staged`, generate a structured pull request description with: a one-line title following conventional commits format, a Summary section (3 bullet points max), a Test Plan (numbered checklist), and a Breaking Changes section (or 'None'). Be concise and technical.",
    implementationNotes:
      "The SKILL.md file uses required YAML frontmatter (name, description) plus optional fields for tools and examples. The skill directory at .claude/skills/pr-describe/ contains SKILL.md, a helper script get-diff.sh that stages and pipes git diff, and a sample output for Claude to reference. Claude Code automatically loads the skill when the working directory contains a git repo and the skill name is invoked.",
    result:
      "The skill reliably generates PR descriptions matching the conventional commits specification. After 10 test runs on different repositories, the title format was correct 9/10 times. The summary quality varied based on diff verbosity — very large diffs (500+ lines) produced less precise summaries.",
    whatWorked: [
      "YAML frontmatter is minimal and the skill loaded without issues",
      "Claude correctly invoked the get-diff.sh helper without being told to",
      "Output format was consistent across runs",
      "Skill is portable — copying the directory to a new project just works",
    ],
    whatFailed: [
      "Very large diffs (500+ lines) overwhelm the skill — summary quality degrades",
      "No built-in truncation logic; needs a MAX_DIFF_LINES guard in the helper script",
      "The skill does not yet handle merge commits differently from feature commits",
    ],
    nextIteration:
      "Add a diff-chunking mechanism to the helper script. Publish the skill to a public GitHub repo — the official anthropics/skills repository on GitHub is the canonical reference for community-contributed skills.",
    references: [
      {
        label: "Equipping Agents with Agent Skills — Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
      },
      {
        label: "Introducing Agent Skills — Anthropic",
        url: "https://www.anthropic.com/news/skills",
      },
      {
        label: "Agent Skills Overview — Official Docs",
        url: "https://code.claude.com/docs/en/skills",
      },
      {
        label: "anthropics/skills — Official Skills Repository",
        url: "https://github.com/anthropics/skills",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "mcp-visual-explainer",
    labPage: "/lab/mcp",
    title: "MCP Visual Explainer",
    description:
      "An interactive diagram tool built with React and MCP that visually maps how an MCP server, client, and host communicate — rendered live from a running local MCP server.",
    category: "mcp",
    difficulty: "intermediate",
    status: "experimental",
    date: "2026-04-26",
    tools: ["MCP", "TypeScript", "React", "Next.js", "Zod"],
    goal:
      "Build a developer-facing explainer tool that connects to a real MCP server and visualizes the Tools/Resources/Prompts primitives in a live, interactive diagram.",
    context:
      "The Model Context Protocol (MCP) is an open standard introduced by Anthropic in November 2024 for connecting AI applications to external data sources and tools. MCP has three core primitives: Tools (executable functions), Resources (structured data), and Prompts (templates). This experiment builds a local MCP server that exposes metadata about itself, then renders that metadata in a React diagram. The goal is to make MCP's architecture tangible for developers encountering it for the first time.",
    implementationNotes:
      "Built a Node.js MCP server using the official TypeScript SDK that exposes three tools: list-tools, list-resources, and list-prompts — each returning JSON describing the server's own capabilities. The Next.js frontend connects via the MCP connector (SSE transport) and renders a live node graph using a lightweight custom SVG renderer. Zod validates all incoming MCP responses before rendering.",
    result:
      "The visual explainer successfully renders a live diagram of an MCP server's capabilities tree. The SSE connection is stable for local development. The diagram updates in real time when the server's tools list changes — useful for demonstrating MCP server development workflows.",
    whatWorked: [
      "The official MCP TypeScript SDK made server setup straightforward",
      "SSE transport worked reliably for local connections",
      "Zod validation caught two malformed tool definitions during testing",
      "The SVG node graph rendered correctly on all tested screen sizes",
    ],
    whatFailed: [
      "CORS configuration required manual header setup for the SSE endpoint",
      "No official MCP server discovery protocol yet — server URL must be hardcoded",
      "The diagram becomes cluttered with more than 15 tools — needs pagination or grouping",
    ],
    nextIteration:
      "Upgrade from SSE to Streamable HTTP transport (SSE was deprecated in the 2025-03-26 spec revision). Connect to the official MCP Registry (registry.modelcontextprotocol.io) for server discovery instead of hardcoded URLs. Add a 'request trace' mode that shows the raw JSON-RPC 2.0 message flow.",
    references: [
      {
        label: "Model Context Protocol — Official Docs",
        url: "https://modelcontextprotocol.io",
      },
      {
        label: "MCP Specification (2025-11-25)",
        url: "https://modelcontextprotocol.io/specification/2025-11-25",
      },
      {
        label: "Official MCP Registry",
        url: "https://registry.modelcontextprotocol.io",
      },
      {
        label: "MCP Security Best Practices — Official Docs",
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
    title: "AI UX Interface Playground",
    description:
      "Exploring AI-native interface patterns: streaming text, confidence indicators, tool-call visualizations, and reasoning traces — rendered in a custom React playground.",
    category: "ux-ui",
    difficulty: "advanced",
    status: "in-progress",
    date: "2026-05-01",
    tools: ["Claude API", "React", "TypeScript", "Framer Motion", "SSE"],
    goal:
      "Identify and prototype the UI patterns that make AI-powered interfaces feel fast, transparent, and trustworthy — going beyond the standard chat bubble.",
    context:
      "Most AI interfaces default to a chat metaphor: user sends message, model streams text back. This experiment asks: what other interaction patterns emerge when you expose more of what the model is doing? Inspired by extended thinking traces, tool-call visibility, and token-probability displays seen in research interfaces, this playground implements four experimental UI patterns using the Anthropic API's streaming capabilities.",
    implementationNotes:
      "Built against the Anthropic Messages API with streaming enabled. Four UI patterns implemented: (1) Streaming typewriter with adjustable speed — simulates different token rates. (2) Confidence heatmap — colors tokens by estimated certainty (currently simulated, not from real logprobs). (3) Tool-call trace — renders each tool invocation as an expandable card showing input/output JSON. (4) Thinking stage indicator — shows 'reading', 'reasoning', 'writing' phases based on SSE event timing. All patterns are composable via a playground config panel.",
    result:
      "The tool-call trace pattern proved most valuable for debugging agentic workflows. The streaming typewriter revealed that perceived latency drops significantly when even a single token appears within 300ms of submission. The confidence heatmap is experimental and not based on real model data — labeled clearly as a prototype.",
    whatWorked: [
      "SSE streaming from the Anthropic API is reliable and well-documented",
      "The tool-call trace component reduced debugging time noticeably in multi-step agent tests",
      "Framer Motion AnimatePresence handled streaming token appends without layout jank",
      "The config panel made it easy to compare patterns side-by-side",
    ],
    whatFailed: [
      "The confidence heatmap is not based on real logprob data — Anthropic API does not expose per-token probabilities publicly",
      "Thinking stage detection based on SSE timing is a heuristic, not a protocol feature",
      "Rendering 1000+ streaming tokens caused noticeable React re-render overhead without virtualization",
    ],
    nextIteration:
      "Implement proper token virtualization for long streams. Investigate whether extended thinking traces (available on Claude models with thinking mode) can power the stage indicator more reliably.",
    references: [
      {
        label: "Anthropic Messages API — Streaming",
        url: "https://docs.anthropic.com/en/api/messages-streaming",
      },
      {
        label: "Claude Extended Thinking",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "claude-design-prototype-to-code",
    labPage: "/lab",
    title: "Claude Design: Prototype to Code in One Loop",
    description:
      "Using Claude Design (Anthropic Labs research preview) to turn a written brief into an interactive prototype, then handing it off to Claude Code for production implementation — closing the design-to-dev loop.",
    category: "ux-ui",
    difficulty: "intermediate",
    status: "experimental",
    date: "2026-05-05",
    tools: ["Claude Design", "Claude Code", "Claude Opus 4.7", "Figma"],
    goal:
      "Test whether the Claude Design → Claude Code handoff produces a usable production component from a single written brief, with zero manual design-to-dev translation.",
    context:
      "Claude Design is an Anthropic Labs product (research preview, launched April 2026) that creates designs, interactive prototypes, slides, and one-pagers through conversation. It is powered by Claude Opus 4.7 and available to Pro, Max, Team, and Enterprise subscribers. A key differentiator is its handoff mechanism: when a design is ready, Claude packages everything into a bundle that can be passed directly to Claude Code. This experiment tests that full loop using a real brief — the ExperimentCard component for Eggthropic.",
    prompt:
      "Design an ExperimentCard UI component for a developer lab website called Eggthropic. Dark mode, glassmorphism aesthetic, dark navy background (#080c14). The card shows: title, one-line description, category tag, difficulty badge (beginner/intermediate/advanced), status badge (complete/in-progress/experimental), date, and a list of tool badges. Should feel like a futuristic lab report card — technical, not decorative. Make it interactive: hover lifts the card with a subtle glow. Output a ready-to-hand-off prototype.",
    implementationNotes:
      "Claude Design built the initial prototype in one pass, correctly inferring the glassmorphism aesthetic from the description without being given hex values. The adjustment knobs it generated (glow intensity, card elevation, badge opacity) were genuinely useful for quick iteration. The handoff bundle included annotated HTML/CSS, component specs, and a prompt pre-written for Claude Code. Claude Code consumed the bundle and produced a working React/Tailwind component in two turns. The total time from brief to production-ready component: approximately 18 minutes.",
    result:
      "The handoff loop worked end-to-end. The resulting component was close enough to our existing ExperimentCard that only spacing adjustments were needed. The design system extraction feature was not tested in this experiment (requires linking a codebase during Claude Design onboarding). The interactive prototype was shareable via a URL — useful for async feedback before building.",
    whatWorked: [
      "Claude Design inferred the visual aesthetic accurately from a prose description alone",
      "Adjustment knobs replaced multiple revision prompts for spacing and color tweaks",
      "The handoff bundle pre-wrote the Claude Code prompt — zero manual translation",
      "The shareable prototype URL enabled feedback before committing to code",
      "Claude Code consumed the handoff bundle correctly on the first attempt",
    ],
    whatFailed: [
      "Claude Design is a research preview — inline comments disappeared twice during iteration (known bug; workaround: paste comment into chat)",
      "The design system extraction feature requires codebase access during onboarding — not tested here",
      "Token usage was significant: Claude Design runs on Opus 4.7 and counts against subscription limits",
      "The prototype used absolute pixel values in places; Claude Code had to convert to Tailwind responsive classes",
      "3D and shader features (available in Claude Design) are not yet useful for standard UI component work",
    ],
    nextIteration:
      "Test the full design system extraction flow by linking the Eggthropic codebase during Claude Design onboarding. Measure how accurately Claude applies existing Tailwind tokens to new designs without manual specification.",
    references: [
      {
        label: "Introducing Claude Design by Anthropic Labs",
        url: "https://www.anthropic.com/news/claude-design-anthropic-labs",
      },
      {
        label: "Get started with Claude Design — Help Center",
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
    title: "Building an AI Functional Assistant for SAP HR Legacy Systems",
    description:
      "Using Claude and Notion to build a structured knowledge assistant for SAP HR On-Premise functional teams — turning scattered configuration knowledge into queryable, reasoning-ready context.",
    category: "enterprise-ai",
    difficulty: "intermediate",
    status: "in-progress",
    date: "2026-05-08",
    tools: ["Claude", "Notion", "Anthropic API"],
    goal: "Determine whether a Claude-powered assistant backed by a structured Notion knowledge base can reliably answer SAP HR functional questions — infotype lookups, configuration logic, process flow queries — without requiring direct SAP system access or ABAP expertise.",
    context:
      "SAP HR On-Premise (HCM) carries decades of accumulated configuration: infotypes, feature hierarchies, schema logic, customer exits, and undocumented process rules that exist only in spreadsheets, Word documents, and the memory of consultants who have since left. Functional teams spend significant time searching for answers that are technically available in the system but practically inaccessible without deep expertise or expensive support contracts. This experiment explores whether Notion — used as a structured knowledge base — combined with Claude as a reasoning and transformation layer can make that knowledge queryable in plain language, without connecting to a live SAP system.",
    prompt:
      "You are a functional assistant for SAP HR On-Premise. You have access to a structured knowledge base containing infotype definitions, configuration notes, process flows, and known system behaviors. Answer the following question accurately and concisely. If the answer requires distinguishing between standard SAP behavior and customer-specific configuration, say so explicitly. If the answer is not in the knowledge base, say you don't know — do not invent configuration values.\n\nQuestion: {user_question}",
    implementationNotes:
      "The prototype uses Notion as the knowledge base with a consistent page structure per infotype: definition, key fields, standard transactions, common configuration pitfalls, and known integration dependencies. Notion pages are fetched via the Notion API and assembled into a context block passed to Claude via the Anthropic Messages API. Claude is prompted to reason over the provided context only — it is explicitly instructed not to hallucinate configuration values. The assistant currently covers Infotypes 0001–0008 (org assignment, personal data, payroll), the PA40 action framework, and a subset of OM object types. No SAP system connection exists; all knowledge is manually curated from functional documentation and project notes.",
    result:
      "For well-documented infotypes and standard transactions, the assistant answers correctly and cites the relevant Notion page. For configuration-specific questions (e.g., 'what does feature LGMST control in our system?'), it correctly flags that the answer depends on customer configuration and declines to guess. Hallucination rate on infotype field definitions: 0 observed across 40 test queries. The assistant struggles with cross-module dependencies (e.g., payroll schema interactions) where the Notion coverage is thin.",
    whatWorked: [
      "Notion as a structured knowledge base is easy to curate and update without engineering involvement",
      "Claude correctly applies the 'do not invent configuration values' instruction — refusals are accurate and useful",
      "Plain-language question parsing handles SAP jargon well without special preprocessing",
      "Context assembly from Notion API responses is fast enough for interactive use (<2s round trip)",
      "The assistant distinguishes standard SAP behavior from project-specific customization when the Notion page makes that distinction",
    ],
    whatFailed: [
      "Knowledge base coverage is the primary bottleneck — the assistant is only as good as what has been documented in Notion",
      "Cross-infotype queries (e.g., 'how does IT0001 org assignment affect IT0007 planned working time?') require multi-page context that exceeds current assembly logic",
      "No chunking or retrieval strategy yet — all relevant Notion pages are passed as full context, which becomes expensive at scale",
      "Feature and schema questions require a separate structured format that is harder to maintain in Notion",
      "No feedback loop: when the assistant is wrong, there is no mechanism to flag and correct the source Notion page",
    ],
    nextIteration:
      "Implement a retrieval layer (vector search or keyword index over Notion page titles and tags) to replace full-context assembly. Add coverage for payroll schema basics and the most common personnel actions. Prototype a correction flow: when a user marks an answer as wrong, open the source Notion page for editing. Evaluate whether Claude's extended thinking mode improves accuracy on multi-step configuration reasoning questions.",
    references: [
      {
        label: "Anthropic Messages API — Tool Use",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
      },
      {
        label: "Notion API — Retrieve a Page",
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
