"use client";

import * as React from "react";
import {
  ArrowRight,
  Gauge,
  Leaf,
  Recycle,
  ScanLine,
  Sparkles,
  Wrench,
} from "lucide-react";
import { loadHistory } from "@/lib/history";

type Totals = {
  items: number;
  co2: number;
  diverted: number;
};

const VERDICTS = [
  {
    label: "Repair",
    note: "High viability",
    icon: Wrench,
    color: "text-v-repair",
    bar: "bg-v-repair",
    width: "w-5/6",
  },
  {
    label: "Salvage",
    note: "Parts retained",
    icon: Sparkles,
    color: "text-v-salvage",
    bar: "bg-v-salvage",
    width: "w-3/5",
  },
  {
    label: "Recycle",
    note: "Material path",
    icon: Recycle,
    color: "text-v-recycle",
    bar: "bg-v-recycle",
    width: "w-2/5",
  },
  {
    label: "Replace",
    note: "Last resort",
    icon: Gauge,
    color: "text-v-replace",
    bar: "bg-v-replace",
    width: "w-1/4",
  },
];

export function Hero({ refreshKey = 0 }: { refreshKey?: number }) {
  const [totals, setTotals] = React.useState<Totals | null>(null);

  React.useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const h = loadHistory();
      setTotals({
        items: h.length,
        co2: h.reduce(
          (s, e) => s + (e.diagnosis.environmentalImpact.co2SavedKg || 0),
          0
        ),
        diverted: h.reduce(
          (s, e) =>
            s + (e.diagnosis.environmentalImpact.landfillDivertedKg || 0),
          0
        ),
      });
    });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-[1720px] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-12 xl:px-10"
    >
      <div className="grid w-full items-stretch gap-6 lg:grid-cols-[0.72fr_1.28fr] xl:gap-8">
        <div className="command-panel flex min-h-[580px] flex-col justify-between p-5 sm:p-7 xl:min-h-[720px]">
          <div className="rise">
            <div className="glass-chip inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-mint">
              <Sparkles className="h-4 w-4" />
              Gemini vision repair intelligence
            </div>
            <h1 id="hero-heading" className="t-hero mt-7 max-w-[10ch]">
              Repair Oracle
            </h1>
            <p className="mt-6 max-w-[44rem] text-lg leading-8 text-forest-ink/80">
              Turn a photo of a broken object into a repair-first verdict:
              fix, salvage, recycle, or replace with costs, safety flags, and a
              quantified material impact ledger.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#diagnose"
                className="premium-button inline-flex h-12 items-center justify-center gap-2 px-5 text-[15px] font-semibold"
              >
                <ScanLine className="h-4 w-4" />
                Diagnose an item
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#dispatch"
                className="inline-flex h-12 items-center justify-center rounded-md border border-forest-ink/20 bg-forest-ink/10 px-5 text-[15px] font-semibold text-forest-ink hover:bg-forest-ink/15"
              >
                Operating model
              </a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-3">
            <LiveStat
              label="Items"
              value={totals ? totals.items.toString() : "0"}
              detail="logged"
            />
            <LiveStat
              label="CO2e"
              value={totals ? totals.co2.toFixed(1) : "0.0"}
              detail="kg avoided"
            />
            <LiveStat
              label="Material"
              value={totals ? totals.diverted.toFixed(1) : "0.0"}
              detail="kg diverted"
            />
          </div>
        </div>

        <div className="console-shell min-h-[620px] xl:min-h-[760px]">
          <div className="flex items-center justify-between border-b border-forest-ink/15 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-forest-ink">
              <ScanLine className="h-4 w-4 text-mint" />
              Gemini Verdict Console
            </div>
            <div className="rounded-sm border border-mint/25 bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">
              Vision model ready
            </div>
          </div>
          <RepairConsoleVisual totals={totals} />
        </div>
      </div>
    </section>
  );
}

function LiveStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="material-tile px-3 py-4 text-forest-ink sm:px-4">
      <div className="text-xs font-semibold uppercase text-forest-ink/60">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs text-forest-ink/60">{detail}</div>
    </div>
  );
}

function RepairConsoleVisual({ totals }: { totals: Totals | null }) {
  return (
    <div className="grid min-h-[560px] grid-rows-[1fr_auto] xl:min-h-[700px]">
      <div className="grid gap-0 lg:grid-cols-[1.14fr_0.86fr]">
        <div className="console-grid relative min-h-[390px] border-b border-forest-ink/15 bg-bg-contrast lg:border-b-0 lg:border-r">
          <div className="scan-sweep absolute inset-x-0 top-0 h-36" />

          <div className="absolute left-5 top-5 rounded-md border border-forest-ink/15 bg-forest-ink/10 px-3 py-2">
            <div className="text-xs font-semibold uppercase text-forest-ink/50">
              Intake signal
            </div>
            <div className="mt-1 text-sm font-semibold text-forest-ink">
              Photo + failure note
            </div>
          </div>

          <div className="absolute right-5 top-5 grid gap-1.5">
            <span className="pulse-line h-1.5 w-28 rounded-full bg-mint" />
            <span className="pulse-line h-1.5 w-20 rounded-full bg-clay [animation-delay:400ms]" />
            <span className="pulse-line h-1.5 w-24 rounded-full bg-sky [animation-delay:800ms]" />
          </div>

          <div className="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-3">
            <SignalCell label="Parts" value="Sourceable" />
            <SignalCell label="Safety" value="Flagged" />
            <SignalCell label="Impact" value="Estimated" />
          </div>

          <div className="absolute left-1/2 top-1/2 grid h-64 w-64 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-mint/25 bg-forest-ink/10 shadow-[0_0_80px_rgba(215,234,208,0.11)]">
            <div className="grid h-48 w-48 place-items-center rounded-full border border-forest-ink/15 bg-bg-contrast/55">
              <div className="grid h-28 w-28 place-items-center rounded-md border border-mint/20 bg-mint/10">
                <Wrench className="h-12 w-12 text-mint" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 p-5">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-sm font-semibold text-forest-ink">
                Verdict matrix
              </div>
              <div className="text-xs font-semibold uppercase text-forest-ink/50">
                Four outcomes
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {VERDICTS.map(({ label, note, icon: Icon, color, bar, width }) => (
                <div
                  key={label}
                  className="material-tile grid grid-cols-[auto_1fr] gap-3 p-3"
                >
                  <Icon className={`mt-1 h-4 w-4 ${color}`} />
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-forest-ink">
                        {label}
                      </span>
                      <span className="text-xs text-forest-ink/55">{note}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-ink/10">
                      <div className={`h-full rounded-full ${bar} ${width}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="material-tile p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-mint">
              <Leaf className="h-4 w-4" />
              Environmental ledger
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <LedgerValue
                label="Items"
                value={totals ? totals.items.toString() : "0"}
              />
              <LedgerValue
                label="CO2e"
                value={totals ? totals.co2.toFixed(1) : "0.0"}
              />
              <LedgerValue
                label="Diverted"
                value={totals ? totals.diverted.toFixed(1) : "0.0"}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-forest-ink/65">
              Every verdict carries the Earth Day math: emissions avoided,
              material diverted, and the next responsible path.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-forest-ink/15">
        <ConsoleCell label="Input" value="Gemini vision" />
        <ConsoleCell label="Reasoning" value="Structured schema" />
        <ConsoleCell label="Output" value="Impact ledger" />
      </div>
    </div>
  );
}

function SignalCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="material-tile px-3 py-3">
      <div className="text-xs font-semibold uppercase text-forest-ink/50">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-forest-ink">{value}</div>
    </div>
  );
}

function LedgerValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-semibold tabular-nums text-forest-ink">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase text-forest-ink/50">
        {label}
      </div>
    </div>
  );
}

function ConsoleCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4">
      <div className="text-[11px] font-semibold uppercase text-forest-ink/45">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-forest-ink">{value}</div>
    </div>
  );
}
