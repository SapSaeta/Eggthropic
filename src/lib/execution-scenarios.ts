import type { NodeId, LogKind, ScenarioId, SimEvent } from "@/components/ExecutionLab/types";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ScenarioNodeConfig {
  id: NodeId;
  label: string;
  sublabel: string;
  icon: string;
  phaseColor: string;
  phaseBg: string;
  phaseBorder: string;
  edgeColor: string;
}

export interface ScenarioPhaseConfig {
  id: NodeId;
  label: string;
  badge: string;
  color: string;
  bg: string;
  border: string;
  pulse: string;
}

export interface ResultListItem {
  label: string;
  badge: string;
}

export interface ScenarioResult {
  metrics: { label: string; value: string }[];
  listTitle: string;
  listItems: ResultListItem[];
  codeFile: string;
  codeLanguage: "tsx" | "json" | "md";
  codeContent: string;
  safetyNotes: string[];
  links: { label: string; href: string }[];
}

export interface StepInspector {
  nodeId: NodeId;
  what: string;
  why: string;
  risk: string;
  humanReview: string;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface TrustSafetyItem {
  control: string;
  level: RiskLevel;
  detail: string;
}

export interface ScenarioStory {
  watching: string;
  notThis: string;
}

export interface CompareRow {
  label: string;
  values: Record<ScenarioId, string>;
}

export interface ExecutionScenario {
  id: ScenarioId;
  label: string;
  description: string;
  prompt: string;
  disclaimer: string;
  story: ScenarioStory;
  nodeConfigs: ScenarioNodeConfig[];
  phaseConfigs: ScenarioPhaseConfig[];
  events: SimEvent[];
  result: ScenarioResult;
  inspector: StepInspector[];
  trustSafety: TrustSafetyItem[];
}

// ─── Event helpers ────────────────────────────────────────────────────────────

function e(ms: number, id: NodeId, status: "running" | "success" | "error"): SimEvent {
  return { ms, action: { type: "NODE", id, status } };
}
function l(ms: number, text: string, kind: LogKind): SimEvent {
  return { ms, action: { type: "LOG", text, kind } };
}
const complete = (ms: number): SimEvent => ({ ms, action: { type: "COMPLETE" } });

// ─── Claude Code ──────────────────────────────────────────────────────────────

const claudeCodeEvents: SimEvent[] = [
  l(0, "▸ Initializing Claude Code agent...", "system"),
  l(200, "▸ Task: refactor Hero.tsx → HeroHeadline + HeroCTA", "input"),
  e(500, "analyze", "running"),
  l(500, "▸ Reading src/app/page.tsx...", "system"),
  l(800, "▸ Reading src/components/Hero.tsx...", "system"),
  l(1100, "▸ Scanning related imports...", "system"),
  l(1500, "▸ Component: 312 lines · 1 exported function", "system"),
  e(1800, "analyze", "success"),
  l(1800, "✓ 4 files read · context loaded", "success"),
  e(2000, "plan", "running"),
  e(2000, "tools", "running"),
  l(2000, "▸ Identifying extractable concerns...", "system"),
  l(2000, "▸ Loading edit tools...", "system"),
  l(2400, "▸ HeroHeadline: headline + subtitle block", "system"),
  l(2400, "▸ read_file · write_file · bash loaded", "system"),
  l(2800, "▸ HeroCTA: button group component", "system"),
  e(3100, "tools", "success"),
  l(3100, "✓ 3 tools ready", "success"),
  e(3400, "plan", "success"),
  l(3400, "✓ Plan: split into 3 focused files", "success"),
  e(3600, "generate", "running"),
  l(3600, "▸ Creating HeroHeadline.tsx...", "system"),
  l(4000, "▸ Creating HeroCTA.tsx...", "system"),
  l(4400, "▸ Updating Hero.tsx (imports + JSX)...", "system"),
  l(4800, "▸ Adjusting Tailwind class distribution...", "system"),
  e(5200, "generate", "success"),
  l(5200, "✓ 89 lines changed across 3 files", "success"),
  e(5400, "review", "running"),
  l(5400, "▸ Running npm run lint...", "system"),
  l(5700, "▸ ESLint: 0 errors, 0 warnings", "system"),
  l(5900, "▸ Running npm run build...", "system"),
  l(6300, "▸ Compiled successfully · 4.2s", "system"),
  e(6600, "review", "success"),
  l(6600, "✓ Lint + build passed", "success"),
  e(6800, "deliver", "running"),
  l(6800, "▸ Summarizing diff...", "system"),
  l(7100, "▸ +57 lines, −31 lines · 3 files changed", "system"),
  e(7400, "deliver", "success"),
  l(7400, "✓ Done · review diff before merging", "success"),
  complete(7600),
];

const claudeCodeResult: ScenarioResult = {
  metrics: [
    { label: "Files", value: "3" },
    { label: "Lines Δ", value: "89" },
    { label: "Elapsed", value: "~7s" },
  ],
  listTitle: "Changed Files",
  listItems: [
    { label: "HeroHeadline.tsx", badge: "new" },
    { label: "HeroCTA.tsx", badge: "new" },
    { label: "Hero.tsx", badge: "updated" },
  ],
  codeFile: "Hero.tsx",
  codeLanguage: "tsx",
  codeContent: `// Hero.tsx — refactored (simulated · Eggthropic Execution Lab)
import { HeroHeadline } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-8">
        <HeroHeadline />
        <HeroCTA />
      </div>
    </section>
  );
}`,
  safetyNotes: [
    "Review the diff carefully before committing or merging.",
    "Run your own test suite before shipping generated changes.",
    "Claude Code asks for permission before irreversible file operations.",
  ],
  links: [
    { label: "Claude Code experiment →", href: "/experiments/claude-code-landing-page-builder" },
    { label: "Agent Skills Lab →", href: "/lab/skills" },
  ],
};

const claudeCodeInspector: StepInspector[] = [
  {
    nodeId: "analyze",
    what: "The agent reads the project structure and inspects the target component to understand its current responsibilities.",
    why: "Understanding context before making changes reduces the risk of breaking dependencies or missing edge cases.",
    risk: "Reading a stale or partial view of the codebase can lead to incorrect assumptions about component usage.",
    humanReview: "Verify the agent read the files you expect — not outdated cached versions.",
  },
  {
    nodeId: "plan",
    what: "The agent formulates a plan: which subcomponents to extract, how to divide responsibilities, and which imports to add.",
    why: "An explicit plan step separates reasoning from execution, making it easier to catch mistakes early.",
    risk: "Plans derived from incomplete context may split components along incorrect boundaries.",
    humanReview: "Review the planned decomposition before the agent starts editing.",
  },
  {
    nodeId: "tools",
    what: "The agent loads file editing and bash execution tools available in the Claude Code environment.",
    why: "Tools give the agent concrete abilities to take action — without them it can only suggest changes.",
    risk: "Overly broad tool access (e.g. unrestricted bash) increases blast radius if something goes wrong.",
    humanReview: "Confirm the agent only has the tool permissions this task actually requires.",
  },
  {
    nodeId: "generate",
    what: "The agent writes the new component files and updates the original file with the refactored imports and JSX.",
    why: "Code generation is the primary value-add step — the agent produces the artifact.",
    risk: "Generated code may compile but contain subtle logic errors, missing edge cases, or incorrect type signatures.",
    humanReview: "Read every changed file. Diff before/after. Test edge cases — not just compilation.",
  },
  {
    nodeId: "review",
    what: "The agent runs the project's lint and build commands to check for syntax errors and type issues.",
    why: "Automated checks catch obvious regressions quickly, before human review.",
    risk: "Passing lint and build does not mean the code is correct — only that it compiles and passes static checks.",
    humanReview: "Run your own test suite. Check product behavior, not just whether it compiles.",
  },
  {
    nodeId: "deliver",
    what: "The agent produces a summary of what changed: files affected, line counts, and a brief rationale.",
    why: "A clear summary makes human review faster and provides a starting point for the PR description.",
    risk: "AI-generated summaries may omit important context or frame changes in an overly positive light.",
    humanReview: "Do not rely on the summary alone. Read the actual diff before merging.",
  },
];

const claudeCodeTrust: TrustSafetyItem[] = [
  { control: "File permissions", level: "Medium", detail: "Claude Code requires explicit permission grants for file writes. Defaults are conservative — review before expanding." },
  { control: "Bash execution", level: "High", detail: "Shell commands have broad blast radius. Confirm before granting unrestricted bash access to any agent task." },
  { control: "Diff review gate", level: "Medium", detail: "Always review the full diff before committing. Generated code can be plausible but logically incorrect." },
  { control: "Data exposure", level: "Low", detail: "Local refactors operate on local files only. No external network calls required in this scenario." },
  { control: "Reversibility", level: "Medium", detail: "File edits are reversible with git. Commit or stash before starting agent tasks so you can roll back." },
];

// ─── MCP ──────────────────────────────────────────────────────────────────────

const mcpEvents: SimEvent[] = [
  l(0, "▸ Initializing MCP client...", "system"),
  l(200, "▸ Task: fetch product · id=PRD-4821", "input"),
  e(500, "analyze", "running"),
  l(500, "▸ Parsing natural language request...", "system"),
  l(800, "▸ Intent: product lookup", "system"),
  l(1100, "▸ Entity extracted: PRD-4821", "system"),
  e(1500, "analyze", "success"),
  l(1500, "✓ Request parsed · routing to tool", "success"),
  e(1700, "plan", "running"),
  e(1700, "tools", "running"),
  l(1700, "▸ Querying MCP server registry...", "system"),
  l(1700, "▸ Connecting: products-mcp (Streamable HTTP)...", "system"),
  l(2000, "→ {\"jsonrpc\":\"2.0\",\"method\":\"tools/list\",\"id\":1}", "code"),
  l(2100, "▸ Transport: Streamable HTTP (SSE deprecated 2025-03-26)", "system"),
  l(2400, "← tools/list: [get_product, list_products, search]", "system"),
  e(2700, "tools", "success"),
  l(2700, "✓ Tool schema loaded: get_product", "success"),
  e(2900, "plan", "success"),
  l(2900, "✓ Server selected: products-mcp", "success"),
  e(3100, "generate", "running"),
  l(3100, "▸ Preparing tool call...", "system"),
  l(3200, "→ {\"method\":\"tools/call\",\"params\":{\"name\":\"get_product\",\"arguments\":{\"id\":\"PRD-4821\"}}}", "code"),
  l(3700, "← HTTP 200 · response received", "system"),
  l(4000, "← {\"product_id\":\"PRD-4821\",\"name\":\"Stackr CLI\",\"price\":\"$49/mo\"}", "code"),
  e(4400, "generate", "success"),
  l(4400, "✓ Tool response received", "success"),
  e(4600, "review", "running"),
  l(4600, "▸ Validating response schema...", "system"),
  l(4900, "▸ Required fields: present", "system"),
  l(5100, "⚠ MCP responses are untrusted — validate before use", "warning"),
  e(5400, "review", "success"),
  l(5400, "✓ Response validated", "success"),
  e(5600, "deliver", "running"),
  l(5600, "▸ Formatting answer for user...", "system"),
  l(5900, "▸ MCP is an open protocol · not Anthropic-exclusive", "system"),
  e(6200, "deliver", "success"),
  l(6200, "✓ Answer delivered", "success"),
  complete(6400),
];

const mcpResult: ScenarioResult = {
  metrics: [
    { label: "Server", value: "products-mcp" },
    { label: "Tool", value: "get_product" },
    { label: "Elapsed", value: "~6s" },
  ],
  listTitle: "Response Fields",
  listItems: [
    { label: "product_id", badge: "PRD-4821" },
    { label: "name", badge: "Stackr CLI" },
    { label: "price", badge: "$49/mo" },
    { label: "status", badge: "active" },
  ],
  codeFile: "tool_response.json",
  codeLanguage: "json",
  codeContent: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "product_id": "PRD-4821",
    "name": "Stackr CLI",
    "price": "$49/mo",
    "status": "active",
    "tier": "pro",
    "created_at": "2025-11-03"
  }
}`,
  safetyNotes: [
    "MCP is an open protocol — not Anthropic-exclusive.",
    "Treat MCP server responses as untrusted input; validate before use.",
    "Review tool permissions carefully. Avoid excessive OAuth scopes.",
    "Audit MCP server source before granting access to sensitive data.",
  ],
  links: [
    { label: "MCP Visual Explainer →", href: "/lab/mcp" },
    { label: "MCP Note →", href: "/notes/mcp-the-usb-c-for-ai-tools" },
  ],
};

const mcpInspector: StepInspector[] = [
  {
    nodeId: "analyze",
    what: "The agent parses the user's natural language request into a structured intent: what type of data is needed and with which identifier.",
    why: "Structuring the request allows routing to the appropriate tool rather than answering from training data.",
    risk: "Misparse of intent could route to the wrong tool or extract the wrong entity identifier.",
    humanReview: "Confirm the parsed intent matches what you actually asked for before the tool call executes.",
  },
  {
    nodeId: "plan",
    what: "The agent identifies which MCP server can fulfill the request, based on available server descriptions and tool listings.",
    why: "Server selection determines the trust boundary — choosing the wrong server risks sending data to an unintended endpoint.",
    risk: "If multiple servers claim to handle the same resource type, the agent may select an unintended one.",
    humanReview: "Verify the selected server is the one you trust for this data type.",
  },
  {
    nodeId: "tools",
    what: "The agent requests the tool schema from the selected MCP server using the tools/list method over Streamable HTTP.",
    why: "Fetching the schema dynamically lets the agent understand exactly what parameters the tool expects.",
    risk: "A malicious server can return a crafted schema designed to influence subsequent tool calls or inject instructions.",
    humanReview: "Only connect to MCP servers you control or have audited. Treat server schemas as untrusted.",
  },
  {
    nodeId: "generate",
    what: "The agent sends a tools/call request to the MCP server with the extracted parameters.",
    why: "Tool calls extend the model's capabilities beyond what it can generate from training data alone.",
    risk: "Malicious servers can return prompt-injection payloads or exfiltrate sensitive context via side channels.",
    humanReview: "Review tool call parameters before sending. Check what data the tool has access to.",
  },
  {
    nodeId: "review",
    what: "The agent checks the tool response against expected schema and flags any unexpected fields or values.",
    why: "Validation reduces the risk of using malformed or adversarially crafted data in downstream reasoning.",
    risk: "Schema validation cannot detect semantically incorrect but structurally valid responses.",
    humanReview: "Treat MCP responses as untrusted input. Validate business logic, not just schema compliance.",
  },
  {
    nodeId: "deliver",
    what: "The agent formats the validated tool response into a natural language answer for the user.",
    why: "Formatting bridges raw tool output and user-readable content.",
    risk: "The answer may present tool data as authoritative without surfacing the external source.",
    humanReview: "Make the data source visible to users. Do not present external tool data as the model's own knowledge.",
  },
];

const mcpTrust: TrustSafetyItem[] = [
  { control: "Server trust", level: "High", detail: "Treat MCP servers as untrusted unless you wrote the code or audited it. Malicious servers can inject instructions into model context." },
  { control: "Tool permissions", level: "High", detail: "Grant only the tools a server actually needs. Overly broad permissions increase the blast radius of a compromised server." },
  { control: "Response validation", level: "Medium", detail: "Always validate MCP responses before using them in further reasoning or displaying to users." },
  { control: "Data exposure", level: "High", detail: "A compromised MCP server with broad read access can exfiltrate context, env vars, or API keys via network calls." },
  { control: "OAuth scope", level: "Medium", detail: "The MCP OAuth spec is still evolving. Request minimal scopes and review before implementing auth flows." },
];

// ─── Agent Skills ─────────────────────────────────────────────────────────────

const skillsEvents: SimEvent[] = [
  l(0, "▸ Initializing Agent Skills environment...", "system"),
  l(200, "▸ Task: /pr-describe · HEAD~1..HEAD", "input"),
  e(500, "analyze", "running"),
  l(500, "▸ Scanning .claude/skills/...", "system"),
  l(700, "▸ Found: pr-describe, code-review, test-scaffold", "system"),
  l(1000, "▸ Matching invocation: /pr-describe", "system"),
  e(1400, "analyze", "success"),
  l(1400, "✓ Skill matched: pr-describe", "success"),
  e(1600, "plan", "running"),
  e(1600, "tools", "running"),
  l(1600, "▸ Reading pr-describe/SKILL.md...", "system"),
  l(1600, "▸ Checking allowed helper scripts...", "system"),
  l(1900, "▸ Frontmatter: name, description, tools parsed", "system"),
  l(1900, "▸ Found: scripts/diff-helper.sh", "system"),
  l(2200, "▸ SKILL.md description loaded into context", "system"),
  l(2400, "▸ Allowed tools: read_file, bash (restricted)", "system"),
  e(2700, "tools", "success"),
  l(2700, "✓ 2 tools allowed by SKILL.md", "success"),
  e(2900, "plan", "success"),
  l(2900, "✓ Skill loaded · ready to generate", "success"),
  e(3100, "generate", "running"),
  l(3100, "▸ Running diff helper...", "system"),
  l(3200, "$ bash scripts/diff-helper.sh HEAD~1 HEAD", "code"),
  l(3500, "▸ diff: +147 lines, −23 lines · 4 files", "system"),
  l(3800, "▸ Drafting PR title from diff summary...", "system"),
  l(4100, "▸ Drafting PR body (summary + changes)...", "system"),
  l(4500, "▸ Generating test checklist...", "system"),
  e(4900, "generate", "success"),
  l(4900, "✓ PR description drafted", "success"),
  e(5100, "review", "running"),
  l(5100, "▸ Checking required sections...", "system"),
  l(5300, "▸ Title: present · Summary: present · Test plan: present", "system"),
  e(5600, "review", "success"),
  l(5600, "✓ Output structure valid", "success"),
  e(5800, "deliver", "running"),
  l(5800, "▸ Returning structured output...", "system"),
  l(6100, "▸ PR description ready for review", "system"),
  e(6300, "deliver", "success"),
  l(6300, "✓ Done · behavior may vary by Claude surface", "success"),
  complete(6500),
];

const skillsResult: ScenarioResult = {
  metrics: [
    { label: "Skill", value: "pr-describe" },
    { label: "Files Δ", value: "4" },
    { label: "Elapsed", value: "~6s" },
  ],
  listTitle: "Generated Sections",
  listItems: [
    { label: "PR Title", badge: "generated" },
    { label: "Summary", badge: "generated" },
    { label: "Changes", badge: "generated" },
    { label: "Test Plan", badge: "generated" },
  ],
  codeFile: "pr-description.md",
  codeLanguage: "md",
  codeContent: `## Add multi-mode support to Execution Lab

Implements three simulation modes (Claude Code, MCP, Agent Skills)
for the Eggthropic Execution Lab. Scenario data extracted to
\`src/lib/execution-scenarios.ts\` for easy extension.

**Changes**
- ExecutionShell: mode selector + pause/resume
- execution-scenarios.ts: 3 fully-defined scenarios
- ResultPreview: generic result rendering per scenario

**Test plan**
- [ ] All 3 modes run without errors
- [ ] Pause/resume works mid-simulation
- [ ] Mobile layout remains usable
- [ ] npm run lint && npm run build pass`,
  safetyNotes: [
    "Agent Skills behavior may vary by Claude surface and configuration.",
    "Review generated PR descriptions before submitting.",
    "Only install skills from trusted sources — yourself or anthropics/skills.",
  ],
  links: [
    { label: "Agent Skills Explainer →", href: "/lab/skills" },
    { label: "Build Your First Skill →", href: "/experiments/first-custom-agent-skill" },
    { label: "Agent Skills Note →", href: "/notes/agent-skills-portable-capabilities" },
  ],
};

const skillsInspector: StepInspector[] = [
  {
    nodeId: "analyze",
    what: "Claude Code scans the project's .claude/skills/ directory and matches the /pr-describe invocation to a skill by directory name.",
    why: "Skills are matched by name. Predictable matching makes invocations reliable across projects.",
    risk: "If multiple skills have similar names or overlapping descriptions, the wrong skill may be selected.",
    humanReview: "Verify the matched skill is the one you intended to invoke.",
  },
  {
    nodeId: "plan",
    what: "The agent reads the matched skill's SKILL.md file, including its frontmatter and task description.",
    why: "The SKILL.md is the instruction set for the skill. Its content directly shapes how the agent will behave.",
    risk: "Outdated or poorly written SKILL.md files may produce incorrect or unexpected outputs.",
    humanReview: "Review the skill's SKILL.md content before trusting its outputs, especially for new or third-party skills.",
  },
  {
    nodeId: "tools",
    what: "The agent identifies helper scripts listed as allowed in the skill's configuration and reads them into context.",
    why: "Helper scripts let skills perform tasks that require local system operations, like reading a git diff.",
    risk: "Scripts with broad permissions (unrestricted bash, network access) increase risk. Allow only what the skill needs.",
    humanReview: "Inspect every helper script the skill uses. Treat third-party skill scripts as third-party code.",
  },
  {
    nodeId: "generate",
    what: "The agent runs the diff helper script and uses its output, combined with SKILL.md instructions, to draft the PR description.",
    why: "Grounding the output in real diff data rather than model knowledge alone improves accuracy.",
    risk: "Unexpected script output feeds into model context and can mislead the generated description.",
    humanReview: "Read the script output independently before relying on the skill's generated content.",
  },
  {
    nodeId: "review",
    what: "The agent checks that the generated output contains all required sections (title, summary, test plan).",
    why: "Structural validation ensures the skill produced a complete, usable output.",
    risk: "Structural completeness does not guarantee accuracy. A valid structure can contain incorrect content.",
    humanReview: "Read the generated PR description carefully. Correct or expand it before submitting.",
  },
  {
    nodeId: "deliver",
    what: "The skill returns its structured output — the PR description — for the user to review and use.",
    why: "Skills return output to the user or calling context, not directly to external systems.",
    risk: "Treating output as final without review risks submitting incorrect information in PRs or other artifacts.",
    humanReview: "Never submit AI-generated PR descriptions without reading them. They may miss context only you have.",
  },
];

const skillsTrust: TrustSafetyItem[] = [
  { control: "Skill source", level: "High", detail: "Only use skills you wrote or from the official anthropics/skills repo. Third-party skills execute code on your machine." },
  { control: "Script permissions", level: "High", detail: "Helper scripts run with your local permissions. Scope tool access in SKILL.md to only what the task actually requires." },
  { control: "Output review", level: "Medium", detail: "Generated outputs should always be reviewed before use in PRs, documentation, or other artifacts." },
  { control: "Context exposure", level: "Medium", detail: "Skills see your project context. Avoid invoking skills in sensitive codebases without reviewing what context they access." },
  { control: "Surface compatibility", level: "Low", detail: "Skill behavior can vary by Claude surface. Test skills in your target environment before relying on them in automated workflows." },
];

// ─── Shared config helpers ────────────────────────────────────────────────────

function nodeConfigs(
  overrides: { label: string; sublabel: string; icon: string }[]
): ScenarioNodeConfig[] {
  const ids: NodeId[] = ["analyze", "plan", "tools", "generate", "review", "deliver"];
  const colors = [
    { phaseColor: "text-sky-400", phaseBg: "bg-sky-400/10", phaseBorder: "border-sky-400/30", edgeColor: "#38bdf8" },
    { phaseColor: "text-violet-400", phaseBg: "bg-violet-400/10", phaseBorder: "border-violet-400/30", edgeColor: "#a78bfa" },
    { phaseColor: "text-violet-400", phaseBg: "bg-violet-400/10", phaseBorder: "border-violet-400/30", edgeColor: "#a78bfa" },
    { phaseColor: "text-egg-400", phaseBg: "bg-egg-400/10", phaseBorder: "border-egg-400/30", edgeColor: "#ffe04d" },
    { phaseColor: "text-amber-400", phaseBg: "bg-amber-400/10", phaseBorder: "border-amber-400/30", edgeColor: "#fbbf24" },
    { phaseColor: "text-emerald-400", phaseBg: "bg-emerald-400/10", phaseBorder: "border-emerald-400/30", edgeColor: "#34d399" },
  ];
  return ids.map((id, i) => ({ id, ...overrides[i], ...colors[i] }));
}

function phaseConfigs(labels: string[], badges: string[]): ScenarioPhaseConfig[] {
  const ids: NodeId[] = ["analyze", "plan", "tools", "generate", "review", "deliver"];
  const styles = [
    { color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", pulse: "bg-sky-400" },
    { color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", pulse: "bg-violet-400" },
    { color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", pulse: "bg-violet-400" },
    { color: "text-egg-400", bg: "bg-egg-400/10", border: "border-egg-400/20", pulse: "bg-egg-400" },
    { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", pulse: "bg-amber-400" },
    { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", pulse: "bg-emerald-400" },
  ];
  return ids.map((id, i) => ({ id, label: labels[i], badge: badges[i], ...styles[i] }));
}

// ─── Scenario registry ────────────────────────────────────────────────────────

export const SCENARIOS: ExecutionScenario[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    description: "Refactor a landing page component",
    prompt: "Refactor Hero.tsx into HeroHeadline and HeroCTA components",
    disclaimer: "Simulates a Claude Code agentic coding workflow. Not a real execution trace.",
    story: {
      watching: "A simulation of how Claude Code might decompose a refactoring task — reading files, planning a split, editing code, and running checks.",
      notThis: "Not Claude's chain of thought, an internal debug trace, or a guarantee that real executions follow these exact steps.",
    },
    nodeConfigs: nodeConfigs([
      { label: "Read Files", sublabel: "phase 1", icon: "📂" },
      { label: "Plan Refactor", sublabel: "phase 2", icon: "📋" },
      { label: "Edit Tools", sublabel: "phase 3", icon: "✏️" },
      { label: "Edit Code", sublabel: "phase 4", icon: "⚡" },
      { label: "Lint & Build", sublabel: "phase 5", icon: "🔨" },
      { label: "Summarize", sublabel: "phase 6", icon: "📝" },
    ]),
    phaseConfigs: phaseConfigs(
      ["Read Files", "Plan Refactor", "Edit Tools", "Edit Code", "Lint & Build", "Summarize"],
      ["READ", "PLAN", "TOOLS", "EDIT", "LINT", "DONE"]
    ),
    events: claudeCodeEvents,
    result: claudeCodeResult,
    inspector: claudeCodeInspector,
    trustSafety: claudeCodeTrust,
  },
  {
    id: "mcp",
    label: "MCP",
    description: "Fetch product data from an external tool",
    prompt: "Fetch product details for PRD-4821 from the products MCP server",
    disclaimer: "Simulates a Model Context Protocol (MCP) tool call workflow. MCP is an open protocol.",
    story: {
      watching: "A simulation of how a Claude-based agent might use MCP to call an external tool — parse a request, connect to a server, call a tool, and validate the response.",
      notThis: "Not a live MCP connection, a real API call, or a demonstration of specific server behavior. MCP is an open protocol — not Anthropic-exclusive.",
    },
    nodeConfigs: nodeConfigs([
      { label: "Parse Request", sublabel: "phase 1", icon: "🔍" },
      { label: "Select Server", sublabel: "phase 2", icon: "🔌" },
      { label: "Get Schema", sublabel: "phase 3", icon: "📐" },
      { label: "Call Tool", sublabel: "phase 4", icon: "⚡" },
      { label: "Validate", sublabel: "phase 5", icon: "✅" },
      { label: "Gen Answer", sublabel: "phase 6", icon: "💬" },
    ]),
    phaseConfigs: phaseConfigs(
      ["Parse Request", "Select Server", "Get Schema", "Call Tool", "Validate", "Gen Answer"],
      ["PARSE", "SERVER", "SCHEMA", "CALL", "VALID", "ANSWER"]
    ),
    events: mcpEvents,
    result: mcpResult,
    inspector: mcpInspector,
    trustSafety: mcpTrust,
  },
  {
    id: "skills",
    label: "Agent Skills",
    description: "Generate a pull request description",
    prompt: "/pr-describe — generate PR description for HEAD~1..HEAD",
    disclaimer: "Simulates an Agent Skills invocation. Behavior varies by Claude surface and configuration.",
    story: {
      watching: "A simulation of how Claude Code might load and invoke an Agent Skill — scanning the skills directory, reading SKILL.md instructions, running an allowed helper script, and generating structured output.",
      notThis: "Not a live skill execution or a guarantee of how real skills behave. Skill behavior can vary by Claude surface and configuration.",
    },
    nodeConfigs: nodeConfigs([
      { label: "Detect Skill", sublabel: "phase 1", icon: "🎯" },
      { label: "Load Skill", sublabel: "phase 2", icon: "📄" },
      { label: "Read Scripts", sublabel: "phase 3", icon: "🔧" },
      { label: "Run & Draft", sublabel: "phase 4", icon: "⚡" },
      { label: "Validate", sublabel: "phase 5", icon: "✅" },
      { label: "Return Output", sublabel: "phase 6", icon: "📦" },
    ]),
    phaseConfigs: phaseConfigs(
      ["Detect Skill", "Load Skill", "Read Scripts", "Run & Draft", "Validate", "Return Output"],
      ["DETECT", "LOAD", "SCRIPTS", "RUN", "VALID", "OUTPUT"]
    ),
    events: skillsEvents,
    result: skillsResult,
    inspector: skillsInspector,
    trustSafety: skillsTrust,
  },
];

export function getScenario(id: ScenarioId): ExecutionScenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

// ─── Compare data ─────────────────────────────────────────────────────────────

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Best for",
    values: {
      "claude-code": "Multi-file code changes with automated feedback loops",
      "mcp": "Fetching live data or calling external APIs at inference time",
      "skills": "Repeating a defined, structured workflow across projects",
    },
  },
  {
    label: "Main input",
    values: {
      "claude-code": "Natural language task + local codebase context",
      "mcp": "User request + MCP server connection + tool schema",
      "skills": "Slash command invocation + SKILL.md instructions",
    },
  },
  {
    label: "Main risk",
    values: {
      "claude-code": "Plausible but logically incorrect generated code",
      "mcp": "Untrusted server responses · data exfiltration · prompt injection",
      "skills": "Overpermissioned scripts · outdated SKILL.md instructions",
    },
  },
  {
    label: "Human review needed",
    values: {
      "claude-code": "Full diff review + test run before merging",
      "mcp": "Server trust audit + response validation before use",
      "skills": "Skill content + script inspection + generated output review",
    },
  },
  {
    label: "Typical output",
    values: {
      "claude-code": "Edited source files + lint/build report + diff summary",
      "mcp": "Formatted data answer sourced from external tool response",
      "skills": "Structured document: PR description, report, test stubs",
    },
  },
  {
    label: "When not to use",
    values: {
      "claude-code": "Security-critical code changes without expert human review",
      "mcp": "Unaudited servers with access to sensitive or personal data",
      "skills": "Untrusted third-party skills with broad file or shell permissions",
    },
  },
];
