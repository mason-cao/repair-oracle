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
  { label: "Repair", icon: Wrench, color: "text-v-repair" },
  { label: "Salvage", icon: Sparkles, color: "text-v-salvage" },
  { label: "Recycle", icon: Recycle, color: "text-v-recycle" },
  { label: "Replace", icon: Gauge, color: "text-v-replace" },
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
      className="mx-auto w-full max-w-[1280px] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-12"
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex min-h-[520px] flex-col justify-between py-3 sm:py-6">
          <div className="rise">
            <div className="inline-flex items-center gap-2 rounded-md border border-rule bg-bg-raised px-3 py-2 text-sm font-medium text-forest">
              <Leaf className="h-4 w-4" />
              Earth Day Hackathon 2026
            </div>
            <h1 id="hero-heading" className="t-hero mt-7 max-w-[9ch] text-ink">
              Repair Oracle
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg leading-8 text-ink-2">
              A refined diagnosis workspace for deciding what should be fixed,
              parted out, recycled responsibly, or replaced with care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#diagnose"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 text-[15px] font-semibold text-bg transition-colors hover:bg-forest"
              >
                <ScanLine className="h-4 w-4" />
                Diagnose an item
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#dispatch"
                className="inline-flex h-12 items-center justify-center rounded-md border border-rule-strong bg-bg-raised px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
              >
                View impact model
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
              detail="kg saved"
            />
            <LiveStat
              label="Material"
              value={totals ? totals.diverted.toFixed(1) : "0.0"}
              detail="kg diverted"
            />
          </div>
        </div>

        <div className="surface-panel overflow-hidden bg-bg-raised">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ScanLine className="h-4 w-4 text-forest" />
              Live verdict console
            </div>
            <div className="rounded-sm bg-mint px-2 py-1 text-xs font-semibold text-forest">
              Ready
            </div>
          </div>
          <RepairConsoleVisual />
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
    <div className="surface-inset px-3 py-4 sm:px-4">
      <div className="text-xs font-semibold uppercase text-ink-3">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs text-ink-3">{detail}</div>
    </div>
  );
}

function RepairConsoleVisual() {
  return (
    <div className="grid min-h-[520px] grid-rows-[1fr_auto] bg-bg-raised">
      <div className="grid gap-0 md:grid-cols-[1fr_0.84fr]">
        <div className="relative min-h-[330px] border-b border-rule bg-bg-deep md:border-b-0 md:border-r">
          <div className="absolute inset-5 rounded-lg border border-ink/10 bg-bg-raised shadow-[0_24px_80px_rgba(16,23,20,0.12)]">
            <div className="flex h-10 items-center gap-2 border-b border-rule px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-v-replace" />
              <span className="h-2.5 w-2.5 rounded-full bg-v-salvage" />
              <span className="h-2.5 w-2.5 rounded-full bg-v-repair" />
            </div>
            <div className="grid h-[calc(100%-2.5rem)] grid-rows-[1fr_auto] p-4">
              <div className="relative overflow-hidden rounded-md border border-rule bg-ink">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,247,239,0.05)_1px,transparent_1px),linear-gradient(rgba(244,247,239,0.05)_1px,transparent_1px)] bg-[length:22px_22px]" />
                <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border border-bg/30 bg-bg/10 p-3">
                  <div className="h-full rounded-sm border border-bg/20 bg-bg/10 p-4">
                    <Wrench className="h-10 w-10 text-mint" />
                    <div className="mt-10 h-2 w-20 rounded-full bg-mint/70" />
                    <div className="mt-3 h-2 w-14 rounded-full bg-bg/35" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="h-1.5 rounded-full bg-v-repair" />
                  <div className="h-1.5 rounded-full bg-v-salvage" />
                  <div className="h-1.5 rounded-full bg-v-recycle" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniMetric label="cost" value="$18" />
                <MiniMetric label="time" value="42m" />
                <MiniMetric label="CO2e" value="8.4kg" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-5">
          <div>
            <div className="text-sm font-semibold text-ink">Verdict set</div>
            <div className="mt-4 grid gap-3">
              {VERDICTS.map(({ label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-rule bg-bg px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-semibold text-ink">
                      {label}
                    </span>
                  </div>
                  <span className="h-2 w-16 rounded-full bg-rule-faint">
                    <span
                      className={`block h-full rounded-full ${
                        label === "Repair"
                          ? "w-5/6 bg-v-repair"
                          : label === "Salvage"
                            ? "w-3/5 bg-v-salvage"
                            : label === "Recycle"
                              ? "w-2/5 bg-v-recycle"
                              : "w-1/4 bg-v-replace"
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-forest p-4 text-forest-ink">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Leaf className="h-4 w-4" />
              Environmental ledger
            </div>
            <p className="mt-3 text-sm leading-6 text-forest-ink/82">
              Every diagnosis returns a practical repair path and a material
              impact estimate for the demo judges to inspect.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-rule">
        <ConsoleCell label="Input" value="Photo + symptom" />
        <ConsoleCell label="Model" value="Vision diagnosis" />
        <ConsoleCell label="Output" value="Structured plan" />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-rule bg-bg px-3 py-2">
      <div className="text-[11px] uppercase text-ink-3">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function ConsoleCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4">
      <div className="text-[11px] uppercase text-ink-3">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
