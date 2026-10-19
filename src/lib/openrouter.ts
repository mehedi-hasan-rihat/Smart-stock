import { AI_MODEL } from "@/lib/constants";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}


export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = AI_MODEL;

  if (!apiKey || apiKey === "sk-or-v1-your-key-here") {
    throw new Error("OPENROUTER_API_KEY is not configured in .env");
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://smartstock.local",
      "X-Title": "SmartStock",
    },
    body: JSON.stringify({ model, messages, max_tokens: 1024 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Unexpected OpenRouter response shape");
  }
  return content;
}
