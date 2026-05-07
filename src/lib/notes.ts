import type { Note } from "@/types";

export const notes: Note[] = [
  {
    slug: "claude-code-agentic-coding-2026",
    title: "Claude Code: What Agentic Coding Looks Like in Practice",
    summary:
      "Claude Code moves beyond autocomplete — it reads your full codebase, runs commands, and ships committed code across multiple files. Here's what that actually means for daily developer workflows.",
    date: "2026-04-05",
    category: "Claude Code",
    whatChanged:
      "Claude Code has evolved from a simple CLI wrapper into a fully agentic coding system. Key capabilities include reading entire codebases, creating and editing files across directories, running tests and terminal commands, and committing code — all within a permission-aware model that asks before taking irreversible actions. The 2026 updates added scheduled tasks (Routines, currently in research preview) that run on Anthropic-managed infrastructure and persist when your machine is off, plus Remote Control for running Claude Code on servers or CI environments and interacting with it via API or thin client.",
    whyItMatters:
      "The gap between 'AI writes code snippets' and 'AI ships features' has meaningfully narrowed. Claude Code can handle multi-step refactors, complete features from a brief, and iterate based on test output — compressing work that previously required significant developer context-switching. The permission model and explicit human checkpoints keep the developer in control of what ships. Always review generated changes before merging.",
    whatCanBeBuilt: [
      "Automated PR description generation from git diff (see our Agent Skills experiment)",
      "Multi-step refactors driven by a CLAUDE.md project spec",
      "Test-driven development loops where Claude writes the test, implements the feature, and iterates until passing",
      "Scheduled code hygiene routines (dependency updates, lint fixes) that run without manual trigger via Routines",
      "Multi-agent pipelines using the Claude Agent SDK, with one Claude instance orchestrating parallel sub-agents",
    ],
    limitationsOrRisks: [
      "Claude Code requires explicit permission grants — defaults are conservative, but always review changes before committing or merging",
      "Scheduled Routines run on Anthropic infrastructure — data sent to those routines should be treated as API data per Anthropic's privacy policy",
      "Remote Control runs over network — use only on trusted infrastructure for sensitive codebases",
      "Agentic coding amplifies vague prompts: an unclear task brief can produce a large, incorrect multi-file change across your repo",
      "Not a replacement for security-critical code review — always validate generated code with tests and human review before shipping",
    ],
    references: [
      {
        label: "Claude Code Overview — Anthropic Docs",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
      },
      {
        label: "Claude Code Product Page",
        url: "https://www.anthropic.com/claude-code",
      },
      {
        label: "Automate work with routines — Claude Code Docs",
        url: "https://code.claude.com/docs/en/routines",
      },
    ],
    relatedExperiments: ["claude-code-landing-page-builder"],
    lastVerified: "2026-05-07",
  },
  {
    slug: "agent-skills-portable-capabilities",
    title: "Agent Skills: Giving Claude Persistent, Portable Capabilities",
    summary:
      "Agent Skills let you package reusable instructions, scripts, and resources into a directory that Claude loads automatically — across Claude.ai, Claude Code, and the API.",
    date: "2026-04-14",
    category: "Agent Skills",
    whatChanged:
      "Anthropic introduced Agent Skills as a way to extend agent behavior beyond what fits in a system prompt. A skill is a directory containing a SKILL.md file with YAML frontmatter (at minimum: name and description), plus any supporting files, scripts, or templates. Skills are supported in Claude Code and the Claude Agent SDK; availability across Claude.ai and the Developer Platform may vary by plan — check official docs for current surface support. Skills can be installed from the anthropics/skills GitHub repository (official Anthropic-maintained, 17+ published skills) or built locally in .claude/skills/. In Claude Code, every skill automatically registers as a /skill-name slash command.",
    whyItMatters:
      "Skills solve the 'context stuffing' problem. Instead of pasting long instructions into every conversation, you package them once and Claude loads them when relevant. This enables a library of reusable agent behaviors that can be shared across projects and teams. The slash command integration makes skills feel native to the Claude Code workflow, not bolted on.",
    whatCanBeBuilt: [
      "PR description generator (reads git diff, outputs structured PR body)",
      "Code review checklist enforcer (applies project-specific review criteria per language)",
      "Documentation generator (reads TypeScript types and produces MDX-formatted API docs)",
      "Commit message formatter following your team's conventional commits convention",
      "Test scaffold generator (reads a function signature and produces Jest/Vitest test stubs)",
      "Shared skill libraries published to GitHub for team or community reuse",
    ],
    limitationsOrRisks: [
      "Skills are loaded by file path — no versioning or dependency resolution built in yet",
      "SKILL.md context contributes to token usage; very long skills can increase cost and compress available context",
      "Anthropic recommends using skills only from trusted sources — those you created yourself or from the official anthropics/skills repository",
      "Skills that invoke shell scripts require careful permission configuration in Claude Code; only grant the tools a skill actually needs",
      "Cross-platform compatibility of helper scripts in skills is the author's responsibility",
    ],
    references: [
      {
        label: "Equipping Agents for the Real World with Agent Skills — Anthropic",
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
      },
      {
        label: "Introducing Agent Skills — Anthropic",
        url: "https://www.anthropic.com/news/skills",
      },
      {
        label: "Agent Skills — Claude Code Docs",
        url: "https://code.claude.com/docs/en/skills",
      },
      {
        label: "anthropics/skills — Official Skills Repository (GitHub)",
        url: "https://github.com/anthropics/skills",
      },
    ],
    relatedExperiments: ["first-custom-agent-skill"],
    lastVerified: "2026-05-07",
  },
  {
    slug: "mcp-the-usb-c-for-ai-tools",
    title: "MCP: The USB-C for AI Tools",
    summary:
      "The Model Context Protocol is an open standard for connecting AI applications to external data and tools — and it has become the de-facto industry protocol since its November 2024 launch.",
    date: "2026-04-22",
    category: "MCP",
    whatChanged:
      "Anthropic launched MCP in November 2024 as an open-source protocol based on JSON-RPC 2.0, taking design inspiration from the Language Server Protocol. MCP defines three primitives: Tools (executable functions the model can call), Resources (structured data included in context), and Prompts (reusable templates). MCP is an open standard — not Anthropic-exclusive — with SDKs for all major languages and broad industry adoption. The official MCP Registry launched in September 2025 at registry.modelcontextprotocol.io as a centralized server discovery catalog. Anthropic also launched an MCP Connector on the API that lets you connect to remote MCP servers directly from the Messages API without a separate client. MCP Apps (SEP-1865), formalized in early 2026, extends the protocol to support interactive HTML-based UIs delivered from MCP servers via sandboxed iframes. Note: SSE (Server-Sent Events) transport was deprecated in the 2025-03-26 spec revision; the current remote transport is Streamable HTTP.",
    whyItMatters:
      "MCP eliminates the bespoke integration tax. Before MCP, every AI tool needed its own custom connector to every data source. With MCP, build one server per data source and any MCP-compatible host can connect. This compounds: as more hosts adopt MCP (Claude, IDEs, custom agents), your MCP server works everywhere automatically. The API connector removes the need to run a local MCP client, making server-side agent architectures much simpler.",
    whatCanBeBuilt: [
      "MCP servers exposing internal APIs, databases, or file systems to Claude agents",
      "Developer tools that read live codebase context via MCP resources",
      "Multi-agent workflows where each agent has a dedicated MCP server for its domain",
      "Interactive dashboards delivered from MCP servers using MCP Apps (SEP-1865)",
      "MCP servers wrapped around legacy REST APIs to make them agent-accessible",
      "Local MCP development servers for testing agent capabilities before deploying",
    ],
    limitationsOrRisks: [
      "Treat MCP servers as untrusted integrations unless you control or have audited the server code — malicious servers can send crafted responses",
      "Prompt injection: MCP tool responses are included in Claude's context; a malicious server can embed instructions designed to hijack Claude's behavior",
      "Data exfiltration risk: a compromised MCP server with broad tool permissions can read files, environment variables, or API keys and exfiltrate them via network calls",
      "Excessive permissions: grant only the tools and resources a server actually needs — treat MCP permission scoping like UNIX file permissions",
      "RCE risk in STDIO transport: security researchers discovered that the default STDIO execution model in MCP can be exploited for remote code execution if the server binary is untrusted; only run MCP server binaries from verified sources",
      "The OAuth authorization spec for MCP (June 2025 update) is still evolving — review before implementing auth flows",
      "MCP server performance directly impacts agent latency — slow resource reads block the agent synchronously",
      "No built-in rate limiting in the MCP spec — implement rate limits at the server layer",
    ],
    references: [
      {
        label: "Introducing Model Context Protocol — Anthropic",
        url: "https://www.anthropic.com/news/model-context-protocol",
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
        label: "What is MCP? — Anthropic Docs",
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
  {
    slug: "claude-for-creative-technical-workflows",
    title: "Claude in Creative + Technical Workflows",
    summary:
      "Anthropic has published guidance on using Claude for creative work. Here's what that means for developers building tools at the intersection of design, writing, and code.",
    date: "2026-04-30",
    category: "Workflows",
    whatChanged:
      "Anthropic published 'Claude for Creative Work' outlining Claude's capabilities in creative and design-adjacent workflows. This includes long-form writing, iterative document editing, creative briefs, and technical documentation that blends prose with code. Claude's extended thinking and multi-turn context retention make it well-suited for workflows that require holding a complex creative brief across many iterations — not just one-shot generation.",
    whyItMatters:
      "The boundary between 'developer tool' and 'creative tool' is dissolving for AI-assisted workflows. A landing page brief, a component's microcopy, an API documentation style guide — these are creative artifacts that live inside codebases. Developers building with Claude can leverage its creative strengths not just for code generation but for the full artifact: from spec to copy to implementation to documentation.",
    whatCanBeBuilt: [
      "End-to-end landing page generation (copy + code + structure) from a single brief",
      "Technical documentation that maintains a consistent voice across a large codebase",
      "UI microcopy generators trained on your product's tone guidelines via a system prompt",
      "Multi-step creative briefs managed across Claude Code sessions using CLAUDE.md",
      "Design system documentation that auto-updates when component APIs change",
    ],
    limitationsOrRisks: [
      "Creative output quality is highly sensitive to prompt specificity — vague briefs produce generic results",
      "Claude does not have access to your brand assets, fonts, or visual identity without explicit context in the prompt",
      "Long creative sessions benefit from periodic checkpointing — Claude's context is not persistent across API calls by default",
      "Creative workflows can consume tokens quickly — monitor usage when iterating on long documents",
      "Claude's creative output requires human review before publishing — especially for public-facing copy",
    ],
    references: [
      {
        label: "Claude for Creative Work — Anthropic",
        url: "https://www.anthropic.com/news/claude-for-creative-work",
      },
      {
        label: "Claude API Documentation — Anthropic",
        url: "https://docs.anthropic.com",
      },
    ],
    lastVerified: "2026-05-07",
  },
  {
    slug: "claude-design-prototypes-from-conversation",
    title: "Claude Design: Prototypes from Conversation",
    summary:
      "Anthropic Labs launched Claude Design in April 2026 — a research preview that turns written briefs into interactive prototypes, slides, and one-pagers, with a direct handoff to Claude Code for production implementation.",
    date: "2026-05-05",
    category: "Claude Design",
    whatChanged:
      "Anthropic Labs released Claude Design in April 2026 as a research preview, available to Pro, Max, Team, and Enterprise subscribers. Built on Claude Opus 4.7 (Anthropic's most capable vision model), it creates designs, interactive prototypes, presentations, and one-pagers through conversation. Key capabilities: describe what you need, Claude builds a first version, then refine through chat, inline comments, direct text edits, or adjustment knobs (custom sliders generated by Claude) until it's ready. A design system feature reads your codebase and design files during onboarding so every subsequent project applies your colors, typography, and components automatically. When a design is ready to build, Claude packages it into a handoff bundle that can be passed to Claude Code with a single instruction — closing the loop from idea to prototype to production code.",
    whyItMatters:
      "Claude Design compresses the design-to-dev handoff — one of the most expensive friction points in product development. The direct integration with Claude Code means a PM or designer can go from a written brief to a testable interactive prototype to reviewed production code without switching tools, without Figma exports, and without manually writing design specs. The design system extraction makes it consistent with existing codebases rather than generating one-off outputs. The shareable prototype URL enables async feedback before any code is written. This is not a Figma replacement — it operates earlier in the workflow, at the exploration and communication stage.",
    whatCanBeBuilt: [
      "Interactive UI component prototypes handed off directly to Claude Code",
      "Feature wireframes by PMs that skip the designer bottleneck for internal tools",
      "Presentation decks and one-pagers from a structured brief in minutes",
      "Design system-aware mockups that automatically apply your brand tokens",
      "User-testable prototypes shareable via URL before any production code is written",
      "Full design-to-code loops for greenfield features using the Claude Design → Claude Code pipeline",
    ],
    limitationsOrRisks: [
      "Research preview status — Claude Design is an Anthropic Labs experiment, expect breaking changes and feature iteration",
      "Runs on Claude Opus 4.7 and counts against subscription limits; extended sessions can be token-heavy",
      "Inline comments occasionally disappear before Claude reads them (known bug) — workaround: paste comment text into chat",
      "Linking large repositories (monorepos) for design system extraction may cause browser lag — link specific subdirectories instead",
      "Not a production design tool yet — not a replacement for Figma in established design workflows",
      "3D, shader, and voice features are available but experimental within an already-experimental product",
      "Prototype pixel values may need conversion to responsive units when handing off to Claude Code",
    ],
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
    relatedExperiments: ["claude-design-prototype-to-code"],
    lastVerified: "2026-05-07",
  },
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
