import Link from "next/link";
import { ArrowRight, FileText, ScanSearch, Target, Download } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const FEATURES = [
  {
    icon: FileText,
    title: "Write",
    description: "Structured editor with suggestions for every section.",
  },
  {
    icon: ScanSearch,
    title: "Score",
    description: "Objective feedback on projects, experience, and skills.",
  },
  {
    icon: Target,
    title: "Tailor",
    description: "Adapt your resume to any job description.",
  },
  {
    icon: Download,
    title: "Export",
    description: "Plain text or LaTeX ready for PDF.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Logo size="lg" />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        <section className="border-b py-24">
          <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">
            Your resume workspace.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Write, score, tailor, and export - one document, one place.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Open workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-px border-b bg-border sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-background p-8">
              <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        res.me
      </footer>
    </div>
  );
}
