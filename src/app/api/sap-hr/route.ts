import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { LIVE_CASES } from "@/lib/sap-hr-knowledge";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a functional assistant for SAP HR On-Premise (HCM). You answer questions about infotypes, transactions, configuration, and process flows based only on the knowledge base context provided.

Rules:
- Answer accurately based on the provided context only
- Use correct SAP terminology (PERNR, BEGDA, ENDDA, infotype, wage type, etc.)
- If the answer requires knowledge not in the context, say so explicitly — do not invent field names or configuration values
- Structure your answer clearly: short paragraphs, bullet points for lists, bold for key terms
- Be practical and direct — your audience is functional SAP HR consultants, not beginners
- Do not claim to have access to a live SAP system`;

export async function POST(req: NextRequest) {
  const { caseId } = await req.json();

  const liveCase = LIVE_CASES.find((c) => c.id === caseId);
  if (!liveCase) {
    return new Response("Invalid case ID", { status: 400 });
  }

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `${SYSTEM_PROMPT}\n\n# Knowledge Base\n\n${liveCase.kbContext}`,
    messages: [{ role: "user", content: liveCase.question }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.error(new Error("Stream failed"));
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
