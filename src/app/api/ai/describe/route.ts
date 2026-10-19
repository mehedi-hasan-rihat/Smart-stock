import { z } from "zod";
import { getSession } from "@/lib/auth";
import { chatCompletion } from "@/lib/openrouter";

const schema = z.object({
  name: z.string().min(1),
  notes: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 422 });
  }

  const { name, notes } = parsed.data;

  const prompt = `Write a professional, concise product description (2–3 sentences) for a retail product listing. Do not include a title or bullet points — just the description paragraph.

Product name: ${name}
Notes from the seller: ${notes}`;

  try {
    const description = await chatCompletion([{ role: "user", content: prompt }]);
    return Response.json({ description: description.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}
