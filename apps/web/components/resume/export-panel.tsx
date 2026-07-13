"use client";

import { useState } from "react";
import { Download, FileCode, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumeBuilder } from "@/lib/resume-store";
import { resumeToPlainText } from "@resme/shared";
import { toast } from "sonner";

export function ExportPanel() {
  const { document: resumeDoc } = useResumeBuilder();
  const [latex, setLatex] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plainText = resumeToPlainText(resumeDoc);

  const handleGenerateLatex = async () => {
    if (!resumeDoc.contact.name.trim()) {
      toast.error("Add your name in the Edit tab first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/export/latex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: resumeDoc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Export failed");
      setLatex(data.latex);
      toast.success("LaTeX ready — download and compile to PDF.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    sessionStorage.setItem("resme-exported", "1");
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" /> Plain text
          </CardTitle>
          <CardDescription>For ATS forms and quick applications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-3 font-mono text-xs">
            {plainText || "Add content in the Edit tab first."}
          </pre>
          <Button
            variant="outline"
            className="gap-2"
            disabled={!plainText.trim()}
            onClick={() => downloadFile(plainText, "resume.txt", "text/plain")}
          >
            <Download className="h-4 w-4" /> Download .txt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode className="h-4 w-4" /> PDF (LaTeX)
          </CardTitle>
          <CardDescription>Professional one-page layout. Compile with pdflatex or Overleaf.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleGenerateLatex} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCode className="h-4 w-4" />}
            Generate LaTeX
          </Button>

          {latex && (
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="instructions">How to compile</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <pre className="max-h-48 overflow-y-auto rounded-md border bg-muted/30 p-3 font-mono text-[10px]">
                  {latex.slice(0, 1500)}
                  {latex.length > 1500 ? "\n..." : ""}
                </pre>
                <Button
                  variant="outline"
                  className="mt-2 gap-2"
                  onClick={() => downloadFile(latex, "resume.tex", "application/x-tex")}
                >
                  <Download className="h-4 w-4" /> Download resume.tex
                </Button>
              </TabsContent>
              <TabsContent value="instructions" className="space-y-1 text-sm text-muted-foreground">
                <p>1. Download resume.tex</p>
                <p>2. Run: pdflatex resume.tex</p>
                <p>
                  Or upload to{" "}
                  <a href="https://overleaf.com" className="text-primary underline" target="_blank" rel="noreferrer">
                    Overleaf
                  </a>
                </p>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
