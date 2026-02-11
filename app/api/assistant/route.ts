import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages requis" }, { status: 400 });
  }

  // For now, return a placeholder response
  // TODO: Integrate with OpenAI/Anthropic API for real AI responses
  const lastMessage = messages[messages.length - 1]?.content || "";

  const content = `Merci pour votre question : "${lastMessage.slice(0, 100)}${lastMessage.length > 100 ? "..." : ""}"

L'assistant IA est en cours de configuration. Bientôt, vous pourrez poser des questions sur vos supports de cours et obtenir des réponses personnalisées.

En attendant, n'hésitez pas à consulter vos supports de cours directement.`;

  return NextResponse.json({ content });
}
