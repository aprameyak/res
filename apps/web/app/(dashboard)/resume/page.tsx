"use client";

import { Suspense } from "react";
import { ResumeWorkspace } from "@/components/resume/resume-workspace";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ResumeWorkspace />
    </Suspense>
  );
}
