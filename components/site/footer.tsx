import { GitBranch, Leaf } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1280px] px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
      <div className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Logo />
          <p className="mt-4 max-w-[36rem] text-sm leading-6 text-ink-3">
            Built for Earth Day 2026 to make repair decisions legible,
            inspectable, and materially useful.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-3">
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-forest" />
            v0.1
          </span>
          <span className="hidden text-rule-strong sm:inline">/</span>
          <span className="inline-flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Hackathon build
          </span>
        </div>
      </div>
    </footer>
  );
}
