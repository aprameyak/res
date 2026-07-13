import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <span className={cn("font-semibold tracking-tight", sizes[size], className)}>
      res<span className="text-muted-foreground">.</span>me
    </span>
  );
}
