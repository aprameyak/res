import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  content: z.string().min(1),
  type: z.string(),
});

interface Suggestion {
  original: string;
  suggestion: string;
  explanation: string;
  type: "improvement" | "correction" | "enhancement";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { content, type } = parsed.data;

    const prompt = `Analyze this resume ${type} section and provide 2-3 specific improvements.
For each suggestion return a JSON object with keys: original, suggestion, explanation, type (improvement|correction|enhancement).

Content:
${content}

Return ONLY a valid JSON array, no markdown fences.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    const suggestions: Suggestion[] = JSON.parse(text);

    return NextResponse.json({ data: suggestions });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
