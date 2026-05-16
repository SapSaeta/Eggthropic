#!/usr/bin/env node
/**
 * MCP server that bridges Claude Code → OpenAI Codex CLI.
 *
 * Exposes three tools:
 *   codex_check  – verify the Codex CLI is installed and return its version
 *   codex_run    – execute a coding task via Codex (full-auto, non-interactive)
 *   codex_ask    – ask Codex for suggestions without applying changes (suggest mode)
 *
 * Installation (add to ~/.claude/claude_code_config.json):
 *   {
 *     "mcpServers": {
 *       "codex": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/mcp/codex-server/dist/index.js"],
 *         "env": { "OPENAI_API_KEY": "<your-key>" }
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "node:child_process";
import { promisify } from "node:util";
import { exec } from "node:child_process";

const execAsync = promisify(exec);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizePrompt(prompt: string): string {
  // Strip shell metacharacters — Codex prompt is passed as a positional arg,
  // never interpolated into a shell string, but we sanitise defensively.
  return prompt.replace(/[`$\\]/g, "");
}

async function runCodexCommand(
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const child = spawn("codex", args, {
      cwd,
      env: {
        ...process.env,
        // Suppress the interactive TUI — Codex respects this env var.
        CODEX_QUIET_MODE: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      resolve({ stdout, stderr: stderr + "\n[timeout]", exitCode: 124 });
    }, timeoutMs);

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? 1 });
    });
  });
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "codex-mcp-server",
  version: "0.1.0",
});

// ── codex_check ──────────────────────────────────────────────────────────────

server.registerTool(
  "codex_check",
  {
    description:
      "Check whether the OpenAI Codex CLI is installed and return its version. " +
      "Call this before codex_run or codex_ask to verify prerequisites.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const { stdout } = await execAsync("codex --version", { timeout: 5000 });
      const version = stdout.trim();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              installed: true,
              version,
              message: `Codex CLI ${version} is available.`,
            }),
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              installed: false,
              message:
                'Codex CLI not found. Install it with: npm install -g @openai/codex\n' +
                'Then set OPENAI_API_KEY in your environment.',
            }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ── codex_run ────────────────────────────────────────────────────────────────

server.registerTool(
  "codex_run",
  {
    description:
      "Execute a coding task using the OpenAI Codex CLI in full-auto mode. " +
      "Codex reads the directory, plans changes, and applies them. " +
      "Use this for concrete tasks: 'add a test for X', 'refactor Y', 'fix the bug in Z'. " +
      "Requires OPENAI_API_KEY to be set.",
    inputSchema: z.object({
      prompt: z
        .string()
        .min(1)
        .max(2000)
        .describe("The coding task to perform, in plain English."),
      directory: z
        .string()
        .optional()
        .describe(
          "Absolute path to the working directory. Defaults to the current working directory."
        ),
      model: z
        .enum(["o4-mini", "o3", "o3-mini", "gpt-4.1"])
        .optional()
        .default("o4-mini")
        .describe("Codex model to use. Defaults to o4-mini."),
      timeout_seconds: z
        .number()
        .int()
        .min(10)
        .max(300)
        .optional()
        .default(120)
        .describe("Maximum seconds to wait for Codex to complete. Defaults to 120."),
    }),
  },
  async ({ prompt, directory, model, timeout_seconds }) => {
    const cwd = directory ?? process.cwd();
    const safePrompt = sanitizePrompt(prompt);
    const timeoutMs = (timeout_seconds ?? 120) * 1000;

    const args = [
      "--approval-mode",
      "full-auto",
      "--model",
      model ?? "o4-mini",
      safePrompt,
    ];

    const { stdout, stderr, exitCode } = await runCodexCommand(args, cwd, timeoutMs);

    const success = exitCode === 0;
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success,
            exitCode,
            stdout: stdout.trim() || null,
            stderr: stderr.trim() || null,
            directory: cwd,
            model: model ?? "o4-mini",
          }),
        },
      ],
      isError: !success,
    };
  }
);

// ── codex_ask ────────────────────────────────────────────────────────────────

server.registerTool(
  "codex_ask",
  {
    description:
      "Ask the OpenAI Codex CLI for suggestions or analysis without applying any changes. " +
      "Runs in suggest mode — Codex reads the directory and proposes changes, but never writes them. " +
      "Use this for analysis: 'what would you change in X', 'suggest a refactor for Y'. " +
      "Requires OPENAI_API_KEY to be set.",
    inputSchema: z.object({
      question: z
        .string()
        .min(1)
        .max(2000)
        .describe("The question or analysis request to send to Codex."),
      directory: z
        .string()
        .optional()
        .describe(
          "Absolute path to the working directory. Defaults to the current working directory."
        ),
      model: z
        .enum(["o4-mini", "o3", "o3-mini", "gpt-4.1"])
        .optional()
        .default("o4-mini")
        .describe("Codex model to use. Defaults to o4-mini."),
      timeout_seconds: z
        .number()
        .int()
        .min(10)
        .max(300)
        .optional()
        .default(60)
        .describe("Maximum seconds to wait. Defaults to 60."),
    }),
  },
  async ({ question, directory, model, timeout_seconds }) => {
    const cwd = directory ?? process.cwd();
    const safeQuestion = sanitizePrompt(question);
    const timeoutMs = (timeout_seconds ?? 60) * 1000;

    const args = [
      "--approval-mode",
      "suggest",
      "--model",
      model ?? "o4-mini",
      safeQuestion,
    ];

    const { stdout, stderr, exitCode } = await runCodexCommand(args, cwd, timeoutMs);

    const success = exitCode === 0;
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success,
            exitCode,
            suggestions: stdout.trim() || null,
            stderr: stderr.trim() || null,
            directory: cwd,
            model: model ?? "o4-mini",
            note: "No files were modified — this was a suggest-only run.",
          }),
        },
      ],
      isError: !success,
    };
  }
);

// ─── Transport ────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
