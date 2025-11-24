import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: true,
    reasoning_effort: "medium",
    stop: null,
    messages,
  });
  return result.toDataStreamResponse();
}
