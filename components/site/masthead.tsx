import Link from "next/link";
import { ArrowRight, History, ScanLine } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg-raised/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-75">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-md border border-rule bg-bg/80 p-1 md:flex"
        >
          <NavLink href="#diagnose" label="Diagnose" />
          <NavLink href="#dispatch" label="Impact" />
          <NavLink href="#log" label="Log" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#log"
            aria-label="Open repair log"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:text-ink sm:inline-flex"
          >
            <History className="h-4 w-4" />
          </Link>
          <Link
            href="#diagnose"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-bg transition-colors hover:bg-forest"
          >
            <ScanLine className="h-4 w-4" />
            <span className="hidden sm:inline">Start</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-sm px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-bg-raised hover:text-ink"
    >
      {label}
    </Link>
  );
}
