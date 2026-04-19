import { Leaf, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pt-10 pb-16 md:px-10 md:pt-16">
      <div className="absolute inset-0 -z-10 bg-topo opacity-80 pointer-events-none" />

      <div className="mono inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        <Leaf className="h-3 w-3 text-leaf" />
        Earth Day 2026 · Repair, don't replace
      </div>

      <h1 className="serif mt-6 max-w-4xl text-5xl leading-[1.05] text-ink md:text-[84px] md:leading-[0.97]">
        Before you throw it away,
        <span className="block italic text-leaf">ask the Oracle.</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-ink-soft md:text-xl">
        Snap a photo of the broken thing. Tell us what's wrong. Repair Oracle
        reads the image, diagnoses the failure, and returns a field-guide for
        fixing, salvaging, or responsibly retiring it — in seconds.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl">
        <Feature
          icon={<Zap className="h-4 w-4 text-leaf" />}
          title="Photo-grounded"
          body="Gemini Vision reads your item — not a generic search."
        />
        <Feature
          icon={<ShieldCheck className="h-4 w-4 text-leaf" />}
          title="Safety first"
          body="Flags mains, lithium, and pro-only jobs up front."
        />
        <Feature
          icon={<Leaf className="h-4 w-4 text-leaf" />}
          title="Landfill math"
          body="See exactly how much waste a repair keeps in circulation."
        />
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {icon}
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          {title}
        </div>
      </div>
      <div className="mt-1.5 text-[13px] text-ink-soft">{body}</div>
    </div>
  );
}
