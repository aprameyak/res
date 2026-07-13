"use client";

import { useState, useEffect } from "react";
import { Loader2, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useResumeBuilder } from "@/lib/resume-store";
import { resumeToPlainText } from "@resme/shared";
import { toast } from "sonner";

interface TailorPanelProps {
  onApplied?: () => void;
}

export function TailorPanel({ onApplied }: TailorPanelProps) {
  const { document: resumeDoc, setSections } = useResumeBuilder();
  const [resume, setResume] = useState(() => resumeToPlainText(resumeDoc));
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<{
    tailoredContent: string;
    keywordsMatched: string[];
    suggestions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResume(resumeToPlainText(resumeDoc));
  }, [resumeDoc]);

  const handleTailor = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Provide both your resume and a job description.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tailoring failed");
      setResult(data.data);
      sessionStorage.setItem("resme-tailored", "1");
      toast.success("Resume tailored to job description!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tailoring failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result?.tailoredContent) return;
    const lines = result.tailoredContent.split("\n");
    const sections = resumeDoc.sections.map((sec) => ({ ...sec }));
    let currentSection = sections.find((s) => s.type === "experience") ?? sections[0];
    const contentLines: string[] = [];

    for (const line of lines) {
      const upper = line.trim().toUpperCase();
      const match = sections.find((s) => s.title.toUpperCase() === upper);
      if (match) {
        if (contentLines.length && currentSection) {
          currentSection.content = contentLines.join("\n").trim();
          contentLines.length = 0;
        }
        currentSection = match;
      } else if (line.trim()) {
        contentLines.push(line);
      }
    }
    if (currentSection && contentLines.length) {
      currentSection.content = contentLines.join("\n").trim();
    }
    setSections(sections);
    toast.success("Applied to your resume!");
    onApplied?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Job description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting..."
              className="font-mono text-sm"
            />
            <Button onClick={handleTailor} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tailoring…
                </>
              ) : (
                "Tailor resume"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tailored version</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleApply}>
                Apply to resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  const blob = new Blob([result.tailoredContent], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = window.document.createElement("a");
                  a.href = url;
                  a.download = "tailored-resume.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
              <Link href="/job-match">
                <Button size="sm" variant="secondary">
                  Deep match
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.keywordsMatched.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.keywordsMatched.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-[10px]">
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
            <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
              {result.tailoredContent}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
