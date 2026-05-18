import { anthropic } from "@/lib/claude/client";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const { messages } = await req.json();

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:
      "You are a helpful product assistant for an organic handmade soap and skincare shop. Help customers find the right products based on their skin type, needs, or who they are buying for. Keep answers short and friendly. Only discuss products, ingredients, skincare, and gifting.",
    messages,
  });

  return new Response(stream.toReadableStream());
}
