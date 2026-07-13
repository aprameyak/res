import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  resume: z.string().min(1),
  jobDescription: z.string().min(1),
});

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

    const { resume, jobDescription } = parsed.data;

    const prompt = `You are a career coach. Tailor this resume for the job description below.
Return JSON with exactly these keys:
- tailoredContent: the full rewritten resume text
- keywordsMatched: array of keywords from the JD that you incorporated
- suggestions: array of 2-3 brief tips for further improvement

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON, no markdown.`;

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
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const data = JSON.parse(text);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Tailor error:", error);
    return NextResponse.json({ error: "Failed to tailor resume" }, { status: 500 });
  }
}
