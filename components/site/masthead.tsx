import Link from "next/link";
import { ScanLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/20 bg-bg/45 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-[1720px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-10">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="glass-chip hidden items-center gap-1 rounded-md p-1 md:flex"
        >
          <AnchorLink href="#dispatch" label="Operating model" />
          <AnchorLink href="#log" label="Repair log" />
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm font-semibold text-forest lg:flex">
            <Sparkles className="h-4 w-4" />
            Gemini vision
          </div>
          <Link
            href="#diagnose"
            className="premium-button inline-flex h-10 items-center justify-center gap-2 px-4 text-sm font-semibold"
          >
            <ScanLine className="h-4 w-4" />
            Diagnose
          </Link>
        </div>
      </div>
    </header>
  );
}

function AnchorLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-sm px-3 py-2 text-sm font-semibold text-ink-2 hover:bg-bg-raised hover:text-ink"
    >
      {label}
    </a>
  );
}
