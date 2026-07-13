/** Unified resume document schema — shared across builder, evaluator, and LaTeX export */

export const SECTION_TYPES = {
  SUMMARY: "summary",
  EDUCATION: "education",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  SKILLS: "skills",
  RESEARCH: "research",
  PUBLICATIONS: "publications",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
}

export interface ContactInfo {
  name: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeDocument {
  id?: string;
  title: string;
  contact: ContactInfo;
  sections: ResumeSection[];
  updatedAt?: string;
}

export interface AISuggestion {
  original: string;
  suggestion: string;
  explanation: string;
  type: "improvement" | "correction" | "enhancement";
}

export interface TailorResult {
  tailoredContent: string;
  keywordsMatched: string[];
  suggestions: string[];
}

export const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: "summary", type: "summary", title: "Professional Summary", content: "" },
  { id: "experience", type: "experience", title: "Experience", content: "" },
  { id: "education", type: "education", title: "Education", content: "" },
  { id: "projects", type: "projects", title: "Projects", content: "" },
  { id: "skills", type: "skills", title: "Skills", content: "" },
];

export function resumeToPlainText(doc: ResumeDocument): string {
  const lines: string[] = [doc.contact.name];
  const contact = [doc.contact.email, doc.contact.phone, doc.contact.linkedin, doc.contact.github]
    .filter(Boolean)
    .join(" | ");
  if (contact) lines.push(contact);
  lines.push("");

  for (const section of doc.sections) {
    if (!section.content.trim()) continue;
    lines.push(section.title.toUpperCase());
    lines.push(section.content.trim());
    lines.push("");
  }
  return lines.join("\n");
}
