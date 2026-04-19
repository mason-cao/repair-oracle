import { Leaf } from "lucide-react";

export function EarthDay() {
  return (
    <section id="earth" className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-moss text-bone">
        <div className="absolute inset-0 bg-topo opacity-30 pointer-events-none" />
        <div className="relative grid gap-10 p-8 md:grid-cols-[1.3fr_1fr] md:gap-16 md:p-14">
          <div>
            <div className="mono inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-bone/80">
              <Leaf className="h-3 w-3" />
              Why this matters
            </div>
            <h2 className="serif mt-5 text-4xl leading-tight text-bone md:text-[56px] md:leading-[1.02]">
              The average household discards
              <span className="italic text-lime"> 70 lbs</span> of
              repairable goods each year.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone/80">
              Most "broken" items aren't — they just hit a failure the owner
              doesn't know how to name. Repair Oracle closes that gap. One
              diagnosis at a time, it shifts the default from replace to
              restore.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 self-end">
            <Stat value="~70 lbs" label="Repairable e-waste per household, yearly" />
            <Stat value="2.1 B kg" label="CO₂ avoided if 10% was repaired" />
            <Stat value="5–30 min" label="Average DIY repair time" />
            <Stat value="$240" label="Typical annual savings per household" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-bone/15 bg-bone/5 p-4">
      <div className="serif text-2xl text-bone md:text-3xl">{value}</div>
      <div className="mt-1.5 text-[12px] leading-snug text-bone/70">{label}</div>
    </div>
  );
}
