"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDown, Hammer, ScanSearch, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeBuilder } from "@/components/builder/resume-builder";
import { EvaluatePanel } from "@/components/resume/evaluate-panel";
import { TailorPanel } from "@/components/resume/tailor-panel";
import { ExportPanel } from "@/components/resume/export-panel";
import { useResumeBuilder } from "@/lib/resume-store";
import { useEvaluations } from "@/hooks/use-evaluations";
import { resumeToPlainText, getScoreGrade } from "@resme/shared";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { id: "edit", label: "Edit", icon: Hammer },
  { id: "score", label: "Score", icon: ScanSearch },
  { id: "tailor", label: "Tailor", icon: Target },
  { id: "export", label: "Export", icon: FileDown },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function ResumeWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as StepId | null;
  const [tab, setTab] = useState<StepId>(stepParam && STEPS.some((s) => s.id === stepParam) ? stepParam : "edit");

  const { document: resumeDoc } = useResumeBuilder();
  const { data: evaluationsData } = useEvaluations();
  const latestEval = evaluationsData?.evaluations?.find((e) => e.status === "completed");

  useEffect(() => {
    if (stepParam && STEPS.some((s) => s.id === stepParam)) {
      setTab(stepParam);
    }
  }, [stepParam]);

  const onTabChange = useCallback(
    (value: string) => {
      const next = value as StepId;
      setTab(next);
      router.replace(`/resume?step=${next}`, { scroll: false });
    },
    [router]
  );

  const name = resumeDoc.contact.name || "Untitled resume";
  const hasContent = resumeToPlainText(resumeDoc).trim().length > 50;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
          <p className="text-sm text-muted-foreground">Edit, score, tailor, export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasContent && (
            <Badge variant="secondary" className="text-xs">
              Draft saved locally
            </Badge>
          )}
          {latestEval && (
            <Badge className="text-xs">
              Score: {latestEval.total_score}/120 · {getScoreGrade(latestEval.total_score ?? 0)}
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-4 gap-1 p-1">
          {STEPS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="gap-1.5 py-2 text-xs sm:text-sm">
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <ResumeBuilder />
        </TabsContent>

        <TabsContent value="score" className="mt-4">
          <EvaluatePanel />
        </TabsContent>

        <TabsContent value="tailor" className="mt-4">
          <TailorPanel onApplied={() => onTabChange("edit")} />
        </TabsContent>

        <TabsContent value="export" className="mt-4">
          <ExportPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
