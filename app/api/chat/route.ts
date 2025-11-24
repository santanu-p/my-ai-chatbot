// app/api/chat/route.ts
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";      // optional but recommended for streaming
export const maxDuration = 30;

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("Missing GROQ_API_KEY", { status: 500 });
  }

  const { messages } = await req.json();

  const result = await streamText({
    // Pick any Groq model you have access to, e.g.:
    // 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', etc.
    model: groq("openai/gpt-oss-120b"),
    messages,           // should be an AI SDK Message[] from the client
    temperature: 1,
    topP: 1,
    maxTokens: 8192,
  });

  return result.toDataStreamResponse();
}
