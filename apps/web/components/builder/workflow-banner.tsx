"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, ScanSearch, Target, FileDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    href: "/build",
    label: "Build",
    description: "Create your resume with AI assistance",
    icon: Hammer,
  },
  {
    href: "/upload",
    label: "Evaluate",
    description: "Score against the hiring-agent engine",
    icon: ScanSearch,
  },
  {
    href: "/tailor",
    label: "Tailor",
    description: "Optimize for a specific job description",
    icon: Target,
  },
  {
    href: "/export",
    label: "Export",
    description: "Download as LaTeX or plain text",
    icon: FileDown,
  },
];

export function WorkflowBanner() {
  const pathname = usePathname();

  return (
    <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-background to-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Career Pipeline</p>
          <h2 className="text-sm font-semibold">Build → Evaluate → Tailor → Export</h2>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ href, label, description, icon: Icon }, i) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ y: -1 }}
                className={cn(
                  "group relative flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  active ? "border-primary bg-primary/5" : "bg-card hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{description}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-3 w-3 -translate-y-1/2 text-muted-foreground/40 lg:block" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
