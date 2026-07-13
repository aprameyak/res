import { NextResponse } from "next/server";
import { z } from "zod";
import { generateLatex } from "@resme/latex";
import type { ResumeDocument, SectionType } from "@resme/shared";

const contactSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
});

const documentSchema = z.object({
  title: z.string(),
  contact: contactSchema,
  sections: z.array(sectionSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = documentSchema.safeParse(body.document);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid resume document" }, { status: 400 });
    }

    const latex = generateLatex({
      ...parsed.data,
      sections: parsed.data.sections.map((s) => ({
        ...s,
        type: s.type as SectionType,
      })),
    } as ResumeDocument);

    return NextResponse.json({ latex });
  } catch (error) {
    console.error("LaTeX export error:", error);
    return NextResponse.json({ error: "Failed to generate LaTeX" }, { status: 500 });
  }
}
