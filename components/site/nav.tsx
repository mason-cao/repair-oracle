import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-[6px] rule-b">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-70">
          <Logo />
        </Link>

        <nav className="flex items-center gap-7">
          <Link
            href="#diagnose"
            className="hidden sm:inline text-sm text-ink-2 transition-colors hover:text-ink"
          >
            Diagnose
          </Link>
          <Link
            href="#log"
            className="hidden sm:inline text-sm text-ink-2 transition-colors hover:text-ink"
          >
            Log
          </Link>
          <Link
            href="#diagnose"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-forest"
          >
            Begin <span aria-hidden>→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
