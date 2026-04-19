import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
      <div className="rule-t pt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-[38ch] t-small text-ink-3">
            A diagnostic for broken things. Built for Earth Day, 2026.
          </p>
        </div>
        <div className="mono text-[11px] tracking-[0.02em] text-ink-3 flex items-center gap-4">
          <span>v0.1</span>
          <span aria-hidden>·</span>
          <span>2026</span>
          <span aria-hidden>·</span>
          <span>Made for the broken things</span>
        </div>
      </div>
    </footer>
  );
}
