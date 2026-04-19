import { LogoMark } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-12 pt-20 md:px-10">
      <div className="flex flex-col gap-6 border-t border-ink/10 pt-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="h-7 w-7" />
          <div className="text-sm text-ink-soft">
            <span className="serif text-[18px] text-ink">Repair Oracle</span>{" "}
            — built for Earth Day. Fix more, toss less.
          </div>
        </div>
        <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
          Field Diagnostics · v0.1
        </div>
      </div>
    </footer>
  );
}
