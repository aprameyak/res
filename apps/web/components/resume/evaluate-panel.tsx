"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeDropzone } from "@/components/upload/dropzone";
import { BuilderEvaluateCard } from "@/components/upload/builder-evaluate-card";
import { useResumes } from "@/hooks/use-resumes";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatBytes } from "@/lib/utils";
import { FileText, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_ICON = {
  completed: CheckCircle2,
  processing: Loader2,
  pending: Clock,
  failed: XCircle,
} as const;

const STATUS_COLOR = {
  completed: "text-emerald-500",
  processing: "text-blue-500",
  pending: "text-amber-500",
  failed: "text-red-500",
} as const;

export function EvaluatePanel() {
  const { data: resumesData } = useResumes();
  const resumes = resumesData?.resumes ?? [];

  return (
    <div className="space-y-4">
      <BuilderEvaluateCard />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Or upload a file</CardTitle>
          <CardDescription>PDF or DOCX, max 10MB</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeDropzone />
        </CardContent>
      </Card>

      {resumes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent evaluations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {resumes.slice(0, 5).map((resume) => {
              const Icon = STATUS_ICON[resume.status] ?? FileText;
              return (
                <div key={resume.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      STATUS_COLOR[resume.status],
                      resume.status === "processing" && "animate-spin"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{resume.original_filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(resume.file_size)} | {formatDate(resume.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      resume.status === "completed"
                        ? "success"
                        : resume.status === "failed"
                          ? "destructive"
                          : "outline"
                    }
                    className="text-xs capitalize"
                  >
                    {resume.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
