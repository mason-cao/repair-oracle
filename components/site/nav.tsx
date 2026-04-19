import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
      <Link href="/" className="group">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        <Link
          href="/#how"
          className="text-sm text-ink-soft hover:text-ink transition-colors"
        >
          How it works
        </Link>
        <Link
          href="/#log"
          className="text-sm text-ink-soft hover:text-ink transition-colors"
        >
          Repair log
        </Link>
        <Link
          href="/#earth"
          className="text-sm text-ink-soft hover:text-ink transition-colors"
        >
          Why this matters
        </Link>
      </nav>
      <Button asChild size="sm" variant="moss">
        <Link href="/#diagnose">Start a diagnosis</Link>
      </Button>
    </header>
  );
}
