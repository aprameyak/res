import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between border-r bg-muted/30 p-12 lg:flex">
        <Logo size="lg" />
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            Write. Score. Tailor. Export.
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Everything you need for your resume, in one workspace.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">res.me</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
