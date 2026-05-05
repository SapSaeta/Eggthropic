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
      "Claude Code has evolved from a simple CLI wrapper into a fully agentic coding system. Key capabilities include reading entire codebases, creating and editing files across directories, running tests and terminal commands, and committing code — all within a permission-aware model that asks before taking irreversible actions. The 2026 updates added scheduled tasks (Routines) that run on Anthropic-managed infrastructure and persist even when your machine is off, plus Remote Control for continuing sessions from mobile or browser.",
    whyItMatters:
      "The gap between 'AI writes code snippets' and 'AI ships features' has meaningfully narrowed. Claude Code can now handle multi-day refactors, complete features from a brief, and iterate based on test output — compressing work that would previously require hours of developer context-switching. The permission model and explicit human checkpoints keep the developer in control of what ships.",
    whatCanBeBuilt: [
      "Automated PR description generation from git diff (see our Agent Skills experiment)",
      "Multi-step refactors driven by a CLAUDE.md project spec",
      "Test-driven development loops where Claude writes the test, implements the feature, and iterates until passing",
      "Scheduled code hygiene routines (dependency updates, lint fixes) that run without manual trigger",
      "Agent teams (v2.1.32+) with Opus coordinating multiple parallel sub-agents on different subtasks",
    ],
    limitationsOrRisks: [
      "Claude Code requires explicit permission grants — defaults are conservative and correct, but power users may find the prompts frequent",
      "Scheduled Routines run on Anthropic infrastructure — data sent to those routines should be treated as API data per Anthropic's privacy policy",
      "Remote Control exposes session state via network — use only on trusted networks for sensitive codebases",
      "Agentic coding amplifies bad prompts: a vague task brief can produce a large, incorrect multi-file change",
      "Not yet suitable for security-critical code review without additional validation steps",
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
        label: "2026 Agentic Coding Trends Report — Anthropic",
        url: "https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf",
      },
    ],
  },
  {
    slug: "agent-skills-portable-capabilities",
    title: "Agent Skills: Giving Claude Persistent, Portable Capabilities",
    summary:
      "Agent Skills let you package reusable instructions, scripts, and resources into a directory that Claude loads automatically — across Claude.ai, Claude Code, and the API.",
    date: "2026-04-14",
    category: "Agent Skills",
    whatChanged:
      "Anthropic introduced Agent Skills as a way to extend agent behavior beyond what fits in a system prompt. A skill is a directory containing a SKILL.md file with YAML frontmatter (at minimum: name and description), plus any supporting files, scripts, or templates. Skills are supported across Claude.ai, Claude Code, the Claude Agent SDK, and the Claude Developer Platform. Skills can be installed via plugins from the anthropics/skills marketplace or built locally in .claude/skills/. As of 2026, skills and slash commands are unified — every skill automatically gets a /skill-name interface.",
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
      "SKILL.md context contributes to token usage; very long skills can impact cost",
      "The anthropics/skills marketplace is community-maintained — review skills before installing",
      "Skills that invoke shell scripts require careful permission configuration in Claude Code",
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
        label: "The Complete Guide to Building Skills for Claude (PDF)",
        url: "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf",
      },
    ],
  },
  {
    slug: "mcp-the-usb-c-for-ai-tools",
    title: "MCP: The USB-C for AI Tools",
    summary:
      "The Model Context Protocol is an open standard for connecting AI applications to external data and tools — and it has become the de-facto industry protocol since its November 2024 launch.",
    date: "2026-04-22",
    category: "MCP",
    whatChanged:
      "Anthropic launched MCP in November 2024 as an open-source protocol based on JSON-RPC 2.0, taking design inspiration from the Language Server Protocol. MCP defines three primitives: Tools (executable functions the model can call), Resources (structured data included in context), and Prompts (reusable templates). The community has built thousands of MCP servers since launch, SDKs exist for all major languages, and the industry has broadly adopted MCP as the standard for connecting agents to tools. Anthropic also launched an MCP Connector on the API that lets you connect to remote MCP servers directly from the Messages API without a separate client. MCP Apps (SEP-1865) was formalized in early 2026, extending the protocol to support interactive React-based UIs from MCP servers.",
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
      "MCP does not yet have a server discovery protocol — server URLs must be known in advance",
      "The OAuth authorization spec for MCP (June 2025 update) is still evolving — review before implementing auth",
      "MCP Apps (SEP-1865) is an early 2026 formalization — expect iteration on the spec",
      "Running untrusted MCP servers can expose your agent to prompt injection via malicious tool responses",
      "MCP server performance directly impacts agent latency — slow resource reads block the agent",
      "No built-in rate limiting in the MCP spec — implement at the server layer",
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
        label: "What is MCP? — Anthropic Docs",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp",
      },
      {
        label: "Code Execution with MCP — Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
      },
    ],
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
  },
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
