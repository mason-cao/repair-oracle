import { Camera, Brain, FileCheck } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Camera,
    title: "Photograph the patient",
    body: "A clear shot of the broken item. Include the part that's failing — burn marks, cracks, loose wires.",
  },
  {
    n: "02",
    icon: Brain,
    title: "Oracle reads the image",
    body: "Gemini Vision identifies the item, inspects the damage, and cross-references typical failure modes.",
  },
  {
    n: "03",
    icon: FileCheck,
    title: "Get a structured verdict",
    body: "Repair, salvage, recycle, or replace — with steps, parts, cost, and the landfill you just avoided.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10">
      <div className="max-w-2xl">
        <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
          How it works
        </div>
        <h2 className="serif mt-2 text-4xl leading-tight text-ink md:text-5xl">
          Three steps between broken
          <span className="italic text-leaf"> and better.</span>
        </h2>
      </div>
      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li
              key={s.n}
              className="relative rounded-[24px] border border-ink/10 bg-paper p-7"
            >
              <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
                Step {s.n}
              </div>
              <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-moss text-bone">
                <Icon className="h-5 w-5" />
              </div>
              <div className="serif mt-5 text-2xl text-ink">{s.title}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
