import { Leaf, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1720px] px-5 pb-10 pt-16 sm:px-8 sm:pt-24 xl:px-10">
      <div className="surface-panel grid gap-8 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-[40rem] text-sm leading-6 text-ink-3">
            Repair intelligence for choosing the lowest-waste path forward.
            Built around local memory, structured decisions, and material
            responsibility.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-3">
          <span className="inline-flex items-center gap-2 rounded-md border border-rule bg-bg-raised/70 px-3 py-2">
            <Leaf className="h-4 w-4 text-forest" />
            Earth Day 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-rule bg-bg-raised/70 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-forest" />
            Privacy-first
          </span>
        </div>
      </div>
    </footer>
  );
}
