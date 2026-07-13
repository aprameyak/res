"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestEdits } from "./ai-assistant";
import { useResumeBuilder } from "@/lib/resume-store";
import { SECTION_TYPES, type SectionType } from "@resme/shared";

const SECTION_OPTIONS: { type: SectionType; label: string }[] = [
  { type: SECTION_TYPES.SUMMARY, label: "Summary" },
  { type: SECTION_TYPES.EXPERIENCE, label: "Experience" },
  { type: SECTION_TYPES.EDUCATION, label: "Education" },
  { type: SECTION_TYPES.PROJECTS, label: "Projects" },
  { type: SECTION_TYPES.SKILLS, label: "Skills" },
  { type: SECTION_TYPES.RESEARCH, label: "Research" },
];

export function ResumeBuilder() {
  const { document, setContact, updateSection, addSection, removeSection } = useResumeBuilder();

  const handleAddSection = (type: SectionType) => {
    addSection({
      id: `${type}-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: "",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={document.contact.name}
                onChange={(e) => setContact({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@email.com"
                value={document.contact.email ?? ""}
                onChange={(e) => setContact({ email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={document.contact.phone ?? ""}
                onChange={(e) => setContact({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/janedoe"
                value={document.contact.linkedin ?? ""}
                onChange={(e) => setContact({ linkedin: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="github.com/janedoe"
                value={document.contact.github ?? ""}
                onChange={(e) => setContact({ github: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {document.sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">{section.title}</CardTitle>
                {document.sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder={`Enter your ${section.type} content. Use bullet points starting with - for each item.`}
                  rows={6}
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  className="font-mono text-sm"
                />
                <SuggestEdits
                  content={section.content}
                  sectionType={section.type}
                  onApply={(suggestion) => updateSection(section.id, suggestion)}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div className="flex flex-wrap gap-2">
          {SECTION_OPTIONS.map(({ type, label }) => (
            <Button key={type} variant="outline" size="sm" onClick={() => handleAddSection(type)}>
              <Plus className="mr-1 h-3.5 w-3.5" /> {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[70vh] overflow-y-auto rounded-md border bg-white p-4 text-xs text-gray-900 dark:bg-gray-950 dark:text-gray-100">
              <p className="text-center text-sm font-bold uppercase tracking-wide">
                {document.contact.name || "Your Name"}
              </p>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">
                {[document.contact.email, document.contact.phone].filter(Boolean).join(" · ")}
              </p>
              <hr className="my-3" />
              {document.sections.map((section) =>
                section.content.trim() ? (
                  <div key={section.id} className="mb-4">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider">{section.title}</p>
                    <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed">
                      {section.content}
                    </pre>
                  </div>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
