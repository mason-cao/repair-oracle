"use client";

import * as React from "react";
import {
  clearHistory,
  loadHistory,
  removeHistory,
  type HistoryEntry,
} from "@/lib/history";
import { CATEGORIES, type Verdict } from "@/lib/diagnosis";
import { cn } from "@/lib/utils";

const VERDICT_LABEL_SHORT: Record<Verdict, string> = {
  repair: "Repair",
  salvage: "Salvage",
  recycle: "Recycle",
  replace: "Replace",
};

const VERDICT_COLOR: Record<Verdict, string> = {
  repair: "text-v-repair",
  salvage: "text-v-salvage",
  recycle: "text-v-recycle",
  replace: "text-v-replace",
};

export function RepairLog({ refreshKey }: { refreshKey: number }) {
  const [entries, setEntries] = React.useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setEntries(loadHistory());
    setMounted(true);
  }, [refreshKey]);

  if (!mounted) return null;

  const totalCo2 = entries.reduce(
    (sum, e) => sum + (e.diagnosis.environmentalImpact.co2SavedKg || 0),
    0
  );
  const totalLandfill = entries.reduce(
    (sum, e) => sum + (e.diagnosis.environmentalImpact.landfillDivertedKg || 0),
    0
  );

  return (
    <section
      id="log"
      aria-labelledby="log-heading"
      className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-20 sm:pt-28"
    >
      <div className="rule-t pt-10">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <div className="mono text-[11px] tracking-[0.02em] text-ink-3">
              <span className="text-ink-2">§ 02</span> · Log
            </div>
            <h2 id="log-heading" className="t-h1 mt-3 text-ink">
              Every repair, remembered.
            </h2>
            <p className="mt-4 max-w-[58ch] t-body text-ink-2">
              Past diagnoses stay on this device. Resume a repair, or watch
              the landfill you&apos;ve skipped grow.
            </p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear your entire repair log?")) {
                  clearHistory();
                  setEntries([]);
                }
              }}
              className="mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-v-replace cursor-pointer"
            >
              Clear log
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="mt-16 border border-rule py-20 text-center">
            <div className="mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              Empty
            </div>
            <div className="t-h3 mt-3 text-ink-2">
              Diagnose a broken thing above to start your log.
            </div>
          </div>
        ) : (
          <>
            {/* Totals row */}
            <div className="mt-10 grid grid-cols-3 rule-t rule-b">
              <Total label="Items" value={entries.length.toString()} />
              <Total
                label="CO₂e saved"
                value={`${totalCo2.toFixed(1)} kg`}
                borderL
              />
              <Total
                label="Diverted"
                value={`${totalLandfill.toFixed(1)} kg`}
                borderL
              />
            </div>

            {/* Table */}
            <div className="mt-10">
              <div className="mono hidden sm:grid grid-cols-[88px_1fr_180px_140px_40px] items-baseline gap-4 pb-3 text-[10.5px] uppercase tracking-[0.08em] text-ink-3 rule-b">
                <span>Date</span>
                <span>Item</span>
                <span>Verdict</span>
                <span className="text-right">CO₂e saved</span>
                <span />
              </div>
              <ul>
                {entries.map((e) => (
                  <LogRow
                    key={e.id}
                    entry={e}
                    onRemove={() => {
                      removeHistory(e.id);
                      setEntries(loadHistory());
                    }}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Total({
  label,
  value,
  borderL,
}: {
  label: string;
  value: string;
  borderL?: boolean;
}) {
  return (
    <div className={cn("px-4 sm:px-5 py-5", borderL && "border-l border-rule")}>
      <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
        {label}
      </div>
      <div className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-ink">
        {value}
      </div>
    </div>
  );
}

function LogRow({
  entry,
  onRemove,
}: {
  entry: HistoryEntry;
  onRemove: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === entry.category);
  const v = entry.diagnosis.verdict as Verdict;
  const co2 = entry.diagnosis.environmentalImpact.co2SavedKg || 0;
  return (
    <li className="group grid grid-cols-[88px_1fr_40px] sm:grid-cols-[88px_1fr_180px_140px_40px] items-center gap-4 border-b border-rule py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 border border-rule-strong overflow-hidden bg-bg-deep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.image}
            alt={entry.diagnosis.itemName}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="mono text-[11px] tracking-[0.02em] text-ink-3 hidden sm:inline">
          {formatDateShort(entry.createdAt)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="text-[15px] text-ink truncate group-hover:underline underline-offset-4 decoration-1">
          {entry.diagnosis.itemName}
        </div>
        <div className="mono mt-1 text-[10.5px] uppercase tracking-[0.08em] text-ink-3 truncate">
          {cat?.label ?? "Item"}
          <span className="sm:hidden"> · {formatDateShort(entry.createdAt)}</span>
        </div>
      </div>

      <div className={cn("mono hidden sm:block text-[12px] uppercase tracking-[0.04em]", VERDICT_COLOR[v])}>
        {VERDICT_LABEL_SHORT[v]}
      </div>

      <div className="hidden sm:block text-right mono text-[13px] tabular-nums text-ink">
        {co2.toFixed(1)} kg
      </div>

      <button
        type="button"
        aria-label="Remove from log"
        onClick={onRemove}
        className="mono justify-self-end text-[11px] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 hover:text-v-replace cursor-pointer"
      >
        ✕
      </button>
    </li>
  );
}

function formatDateShort(ts: number): string {
  return new Date(ts)
    .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })
    .replace(/\//g, "·");
}
