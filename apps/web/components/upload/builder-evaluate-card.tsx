"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumeBuilder } from "@/lib/resume-store";
import { resumeToPlainText } from "@resme/shared";
import { useUpload } from "@/hooks/use-upload";

export function BuilderEvaluateCard() {
  const { document: resumeDoc } = useResumeBuilder();
  const { uploadFromBuilder, isEvaluatingBuilder } = useUpload();

  const plainText = resumeToPlainText(resumeDoc);
  const hasContent = plainText.trim().length > 50;

  if (!hasContent) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex items-center justify-between gap-4 pt-6">
          <div>
            <p className="text-sm font-medium">No resume content yet</p>
            <p className="text-xs text-muted-foreground">Add content in the Edit tab first.</p>
          </div>
          <Link href="/resume?step=edit">
            <Button variant="outline" size="sm">
              Edit resume
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const preview = plainText.split("\n").slice(0, 6).join("\n");

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Score current resume</CardTitle>
        <CardDescription>Evaluate what you have in the editor — no upload required.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="max-h-28 overflow-hidden rounded-md border bg-muted/30 p-3 font-mono text-[11px] text-muted-foreground">
          {preview}
          {plainText.split("\n").length > 6 ? "\n..." : ""}
        </pre>
        <Button className="w-full" disabled={isEvaluatingBuilder} onClick={() => uploadFromBuilder(plainText)}>
          {isEvaluatingBuilder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scoring…
            </>
          ) : (
            "Run evaluation"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
