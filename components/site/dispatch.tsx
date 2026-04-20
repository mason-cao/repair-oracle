import { Leaf, Recycle, ShieldCheck, Sparkles, Wrench } from "lucide-react";

const VERDICT_MODEL = [
  {
    title: "Repair",
    detail: "High confidence, available parts, sensible time and cost.",
    icon: Wrench,
    color: "text-v-repair",
    bar: "bg-v-repair",
  },
  {
    title: "Salvage",
    detail: "The whole object is done, but useful components remain.",
    icon: ShieldCheck,
    color: "text-v-salvage",
    bar: "bg-v-salvage",
  },
  {
    title: "Recycle",
    detail: "Material recovery is the responsible path when repair is wasteful.",
    icon: Recycle,
    color: "text-v-recycle",
    bar: "bg-v-recycle",
  },
  {
    title: "Replace",
    detail: "Reserved for poor economics, missing parts, or safety risk.",
    icon: Leaf,
    color: "text-v-replace",
    bar: "bg-v-replace",
  },
];

export function Dispatch() {
  return (
    <section
      id="dispatch"
      aria-labelledby="dispatch-heading"
      className="mx-auto w-full max-w-[1720px] px-5 py-16 sm:px-8 sm:py-24 xl:px-10"
    >
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="surface-panel p-5 sm:p-6">
          <div className="section-kicker">
            <Leaf className="h-4 w-4" />
            Build for the Planet
          </div>
          <h2 id="dispatch-heading" className="t-h1 mt-5 max-w-[13ch] text-ink">
            Repair-first, Gemini-grounded.
          </h2>
          <p className="mt-5 max-w-[38rem] text-base leading-7 text-ink-2">
            Repair Oracle treats environmental impact as part of the verdict,
            not a decorative stat. Each diagnosis balances visual evidence,
            safety, parts, cost, and material responsibility.
          </p>
        </div>

        <div className="command-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-mint">
                Verdict routing
              </div>
              <div className="mt-1 text-sm text-forest-ink/76">
                A structured path from broken object to lower-waste action.
              </div>
            </div>
            <div className="glass-chip inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-forest-ink">
              <Sparkles className="h-4 w-4 text-mint" />
              Gemini 2.5 Flash
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {VERDICT_MODEL.map(({ title, detail, icon: Icon, color, bar }) => (
              <article key={title} className="material-tile p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-forest-ink/15 bg-forest-ink/10">
                    <Icon className={`h-5 w-5 ${color}`} />
                  </span>
                  <h3 className="text-lg font-semibold text-forest-ink">
                    {title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-forest-ink/82">
                  {detail}
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-forest-ink/10">
                  <div className={`h-full w-3/4 rounded-full ${bar}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <ProofPoint label="Prize technology" value="Google Gemini" />
        <ProofPoint label="Structured output" value="13-field schema" />
        <ProofPoint label="Planet ledger" value="Local impact totals" />
      </div>
    </section>
  );
}

function ProofPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-panel px-5 py-4">
      <div className="text-xs font-semibold uppercase text-ink-3">{label}</div>
      <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}
