import { Leaf, Recycle, ShieldCheck, Wrench } from "lucide-react";

const VERDICT_MODEL = [
  {
    title: "Repair",
    detail: "High confidence, approachable parts, strong cost advantage.",
    icon: Wrench,
    color: "text-v-repair",
  },
  {
    title: "Salvage",
    detail: "The object is done, but components still have value.",
    icon: ShieldCheck,
    color: "text-v-salvage",
  },
  {
    title: "Recycle",
    detail: "Material recovery beats disposal when repair is unsafe or wasteful.",
    icon: Recycle,
    color: "text-v-recycle",
  },
  {
    title: "Replace",
    detail: "Last resort, reserved for poor economics or high safety risk.",
    icon: Leaf,
    color: "text-v-replace",
  },
];

export function Dispatch() {
  return (
    <section
      id="dispatch"
      aria-labelledby="dispatch-heading"
      className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid gap-8 border-t border-rule pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <div className="text-sm font-semibold uppercase text-forest">
            Impact model
          </div>
          <h2 id="dispatch-heading" className="t-h1 mt-4 max-w-[12ch] text-ink">
            Repair-first, safety-aware.
          </h2>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-ink-2">
            Repair Oracle turns a photo and failure note into a judgeable plan:
            what to do, what it costs, what hazards matter, and what material
            stays out of landfill.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {VERDICT_MODEL.map(({ title, detail, icon: Icon, color }) => (
            <article key={title} className="surface-panel p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rule bg-bg">
                  <Icon className={`h-5 w-5 ${color}`} />
                </span>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink-2">{detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        <ProofPoint label="Structured output" value="13 fields" />
        <ProofPoint label="Decision path" value="4 verdicts" />
        <ProofPoint label="Local memory" value="On-device log" />
      </div>
    </section>
  );
}

function ProofPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-inset px-5 py-4">
      <div className="text-xs font-semibold uppercase text-ink-3">{label}</div>
      <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}
