import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `Eres un consultor experto en SAP HCM y desarrollo ABAP. Tu tarea es traducir un cambio o fragmento de código técnico a documentación FUNCIONAL en español, dirigida a personas de negocio sin conocimientos técnicos.

Convenciones del autor del código:
- Los comentarios de cambio siguen el patrón "INS/MOD/DEL bnqbs CH##### (INS=insertado, MOD=modificado, DEL=borrado), normalmente entre marcadores INI ... FIN.
- El namespace de objetos propios es Z* (ZHR*, ZHRPR*, ZHRLI*).

Devuelve la explicación con esta estructura, en lenguaje llano:
1. Resumen funcional — 1-2 frases: qué hace el cambio, en términos de negocio.
2. Qué cambia para el usuario / el proceso — el efecto práctico observable.
3. Detalle del cambio — explica cada bloque modificado sin jerga; traduce infotipos, tablas y lógica a su significado de negocio.
4. Puntos a verificar / supuestos — si algo no se deduce con seguridad del código, dilo explícitamente en lugar de inventarlo.

Reglas:
- No inventes efectos de negocio que no estén soportados por el código. Ante la duda, márcalo en el punto 4.
- Evita la jerga técnica salvo que la traduzcas; el lector no sabe ABAP.
- Sé conciso y claro. Es un borrador que un consultor revisará.

[// PUNTO DE INYECCIÓN FUTURO: aquí se añadirá un fichero de referencia con los objetos, infotipos y namespace Z reales del cliente, necesario para la dirección Funcional → Técnico.]`;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 20) return false;

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response("Demasiadas solicitudes. Inténtalo de nuevo en un minuto.", {
      status: 429,
    });
  }

  let input: string;
  let direction: string;

  try {
    const body = await req.json();
    input = body.input ?? "";
    direction = body.direction ?? "tecnico-funcional";
  } catch {
    return new Response("Cuerpo de la solicitud inválido.", { status: 400 });
  }

  if (!input.trim()) {
    return new Response("El campo de entrada no puede estar vacío.", { status: 400 });
  }

  if (input.length > 12_000) {
    return new Response("El texto supera el límite de 12 000 caracteres.", { status: 400 });
  }

  if (direction !== "tecnico-funcional") {
    return new Response("Dirección no soportada en esta versión.", { status: 400 });
  }

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: input }],
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
