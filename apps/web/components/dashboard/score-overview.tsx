"use client";
import { cn, scoreGrade } from "@/lib/utils";
import type { Evaluation } from "@/types/api";
import { MAX_TOTAL_SCORE } from "@/types/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreOverviewProps {
  evaluation: Evaluation;
  previousScore?: number | null;
}

export function ScoreOverview({ evaluation, previousScore }: ScoreOverviewProps) {
  const total = evaluation.total_score ?? 0;
  const percentage = (total / MAX_TOTAL_SCORE) * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;
  const grade = scoreGrade(total);
  const diff = previousScore != null ? total - previousScore : null;
  const strokeColor =
    percentage >= 75 ? "#22c55e" : percentage >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums">{total.toFixed(0)}</span>
          <span className="text-xs text-muted-foreground">/ {MAX_TOTAL_SCORE}</span>
        </div>
      </div>

      <div className="text-center">
        <div
          className={cn("text-lg font-semibold", {
            "text-emerald-500": percentage >= 75,
            "text-amber-500": percentage >= 50 && percentage < 75,
            "text-red-500": percentage < 50,
          })}
        >
          {grade}
        </div>
        {diff !== null && (
          <div
            className={cn("flex items-center gap-1 text-sm", {
              "text-emerald-500": diff > 0,
              "text-red-500": diff < 0,
              "text-muted-foreground": diff === 0,
            })}
          >
            {diff > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : diff < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
            <span>
              {diff > 0 ? "+" : ""}
              {diff.toFixed(1)} from last
            </span>
          </div>
        )}
      </div>

      {(evaluation.bonus_points || evaluation.deductions) && (
        <div className="flex gap-4 text-xs text-muted-foreground">
          {evaluation.bonus_points && evaluation.bonus_points.total > 0 && (
            <span className="text-emerald-500">+{evaluation.bonus_points.total} bonus</span>
          )}
          {evaluation.deductions && evaluation.deductions.total > 0 && (
            <span className="text-red-500">-{evaluation.deductions.total} deductions</span>
          )}
        </div>
      )}
    </div>
  );
}
