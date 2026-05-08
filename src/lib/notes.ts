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
    slug: "mcp-the-usb-c-for-ai-tools",
    title: "MCP: The USB-C for AI Tools",
    summary:
      "The Model Context Protocol is an open standard for connecting AI applications to external data and tools — widely adopted across the AI ecosystem since its November 2024 launch.",
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
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
