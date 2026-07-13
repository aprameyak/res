"use client";

import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AISuggestion } from "@resme/shared";
import { toast } from "sonner";

interface SuggestEditsProps {
  content: string;
  sectionType: string;
  onApply: (suggestion: string) => void;
}

export function SuggestEdits({ content, sectionType, onApply }: SuggestEditsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error("Add content before requesting suggestions.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type: sectionType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setSuggestions(data.data ?? []);
      if (!data.data?.length) toast.info("No changes suggested.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            Working...
          </>
        ) : (
          "Suggest edits"
        )}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <Card key={i} className="border-border/60 shadow-none">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Edit {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-3 text-xs">
                <p className="text-muted-foreground">{s.explanation}</p>
                <div className="rounded-md border bg-muted/30 p-2 font-mono text-[11px]">
                  {s.suggestion}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => onApply(s.suggestion)}>
                    <Check className="h-3 w-3" /> Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs"
                    onClick={() => setSuggestions((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <X className="h-3 w-3" /> Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export const AIAssistant = SuggestEdits;
