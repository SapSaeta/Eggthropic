# Eggthropic

An independent experimental lab for learning Claude by building real experiments — documented honestly: goal, context, prompts used, what worked, what failed, and what comes next.

> **Disclaimer:** Eggthropic is an independent experimental project and is not affiliated with, endorsed by, or officially connected to Anthropic.

## What's inside

| Area | Description |
|------|-------------|
| `/experiments` | Hands-on Claude experiments with full documentation |
| `/notes` | Short articles on Anthropic and Claude updates |
| `/lab` | Placeholder for the future community lab |
| `/about` | Project context and independent disclaimer |

**Current experiments:**
- Claude Code Landing Page Builder
- First Custom Agent Skill
- MCP Visual Explainer
- AI UX Interface Playground

**Current notes:**
- Claude Code: What Agentic Coding Looks Like in Practice
- Agent Skills: Giving Claude Persistent, Portable Capabilities
- MCP: The USB-C for AI Tools
- Claude in Creative + Technical Workflows

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Content:** TypeScript data files (`src/lib/experiments.ts`, `src/lib/notes.ts`)
- **Deployment:** Vercel-ready (static + SSG)

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/sapsaeta/eggthropic.git
cd eggthropic

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY if running live API experiments

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See `.env.example` for all available variables. The only required variable for live API experiments is `ANTHROPIC_API_KEY`.

## Development

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Adding content

### New experiment

Add an entry to `src/lib/experiments.ts` following the `Experiment` type defined in `src/types/index.ts`. The experiment detail page at `/experiments/[slug]` is generated automatically.

```typescript
// src/lib/experiments.ts
export const experiments: Experiment[] = [
  {
    slug: "your-experiment-slug",
    title: "Your Experiment Title",
    description: "One-line description.",
    category: "claude-code", // claude-code | skills | mcp | api | ux-ui | automation
    difficulty: "beginner",  // beginner | intermediate | advanced
    status: "in-progress",   // complete | in-progress | experimental | archived
    date: "2026-05-01",
    tools: ["Claude Code", "Next.js"],
    goal: "...",
    context: "...",
    prompt: "...",           // optional
    implementationNotes: "...",
    result: "...",
    whatWorked: ["..."],
    whatFailed: ["..."],
    nextIteration: "...",
    references: [{ label: "...", url: "..." }],
  },
  // ...
];
```

### New note

Add an entry to `src/lib/notes.ts` following the `Note` type.

```typescript
// src/lib/notes.ts
export const notes: Note[] = [
  {
    slug: "your-note-slug",
    title: "Your Note Title",
    summary: "One-line summary.",
    date: "2026-05-01",
    category: "Claude Code", // Claude Code | Agent Skills | MCP | Workflows
    whatChanged: "...",
    whyItMatters: "...",
    whatCanBeBuilt: ["..."],
    limitationsOrRisks: ["..."],
    references: [{ label: "...", url: "..." }],
  },
];
```

## Deployment

### Vercel (recommended)

1. Import the repository on [vercel.com](https://vercel.com)
2. Add your environment variables in the Vercel project settings
3. Deploy — Vercel detects Next.js automatically

The project uses SSG (`generateStaticParams`) for experiment and note detail pages, so it deploys as a fully static site with no serverless functions required (unless you add live API routes).

### Other platforms

```bash
npm run build
npm run start
```

The production build outputs to `.next/`. For static export, add `output: 'export'` to `next.config.ts` (note: this disables dynamic routes if any are added later).

## Contributing

Eggthropic is open source. Contributions are welcome for:

- **Experiment ideas:** Open an issue describing the experiment you'd like to see
- **Content fixes:** If you spot a factual error or outdated reference, open a PR
- **Bug fixes:** For UI or code bugs, please include reproduction steps
- **Community Lab:** If you're interested in helping build the contribution pipeline, open an issue

**Content rules:**
- No invented features or speculative claims about Claude or Anthropic products
- All references must link to official Anthropic or MCP documentation
- Experiments must include honest failure analysis — do not omit what didn't work
- No Anthropic branding, logos, or anything that implies official affiliation

## License

This project is source-available under the MIT License. See `LICENSE` for details.

Note: The experiments and notes content (in `src/lib/`) is factual documentation of independent experiments. It may be used and adapted with attribution. Official Anthropic documentation, trademarks, and product names belong to Anthropic and are referenced here for educational purposes only.

## Acknowledgments

Content is informed by official Anthropic documentation, the MCP specification, and Anthropic Engineering blog posts. All sources are cited within each experiment and note.

---

*Eggthropic is not affiliated with Anthropic. Claude, Claude Code, and Anthropic are trademarks of Anthropic PBC.*
