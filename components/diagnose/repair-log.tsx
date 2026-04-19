"use client";

import * as React from "react";
import {
  AlertTriangle,
  History,
  Leaf,
  Recycle,
  ShieldCheck,
  Trash2,
  Wrench,
} from "lucide-react";
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

const VERDICT_TONE: Record<
  Verdict,
  { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  repair: { color: "text-v-repair", bg: "bg-v-repair/10", icon: Wrench },
  salvage: {
    color: "text-v-salvage",
    bg: "bg-v-salvage/10",
    icon: ShieldCheck,
  },
  recycle: { color: "text-v-recycle", bg: "bg-v-recycle/10", icon: Recycle },
  replace: {
    color: "text-v-replace",
    bg: "bg-v-replace/10",
    icon: AlertTriangle,
  },
};

export function RepairLog({ refreshKey }: { refreshKey: number }) {
  const [entries, setEntries] = React.useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setEntries(loadHistory());
      setMounted(true);
    });
    return () => {
      active = false;
    };
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
      className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid gap-8 border-t border-rule pt-10 lg:grid-cols-[0.76fr_1.24fr]">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-forest">
            <History className="h-4 w-4" />
            Repair log
          </div>
          <h2 id="log-heading" className="t-h1 mt-4 text-ink">
            Every verdict, remembered.
          </h2>
          <p className="mt-4 max-w-[34rem] text-base leading-7 text-ink-2">
            Diagnoses stay on this device so the demo can show cumulative
            material impact without accounts or a backend.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Total label="Items" value={entries.length.toString()} />
          <Total label="CO2e saved" value={`${totalCo2.toFixed(1)} kg`} />
          <Total
            label="Material diverted"
            value={`${totalLandfill.toFixed(1)} kg`}
          />
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="surface-panel mt-8 grid min-h-[260px] place-items-center p-6 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-mint text-forest">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-ink">
              No diagnoses yet.
            </h3>
            <p className="mt-3 max-w-[28rem] text-sm leading-6 text-ink-3">
              Run the workspace above and your repair decisions will appear
              here.
            </p>
          </div>
        </div>
      ) : (
        <div className="surface-panel mt-8 overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-3 sm:px-5">
            <div className="text-sm font-semibold text-ink">
              Saved diagnoses
            </div>
            <button
              onClick={() => {
                if (confirm("Clear your entire repair log?")) {
                  clearHistory();
                  setEntries([]);
                }
              }}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-rule bg-bg px-3 text-sm font-semibold text-ink-2 transition-colors hover:border-v-replace hover:text-v-replace"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>

          <div className="hidden grid-cols-[96px_1fr_170px_140px_56px] gap-4 border-b border-rule bg-bg px-4 py-3 text-xs font-semibold uppercase text-ink-3 sm:grid sm:px-5">
            <span>Date</span>
            <span>Item</span>
            <span>Verdict</span>
            <span className="text-right">CO2e</span>
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
      )}
    </section>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-inset px-4 py-4">
      <div className="text-xs font-semibold uppercase text-ink-3">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-ink">
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
  const tone = VERDICT_TONE[v];
  const VerdictIcon = tone.icon;
  const co2 = entry.diagnosis.environmentalImpact.co2SavedKg || 0;
  return (
    <li className="grid gap-4 border-b border-rule px-4 py-4 last:border-b-0 sm:grid-cols-[96px_1fr_170px_140px_56px] sm:items-center sm:px-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-rule bg-bg-deep sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.image}
            alt={entry.diagnosis.itemName}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-ink-3">
          {formatDateShort(entry.createdAt)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="truncate text-base font-semibold text-ink">
          {entry.diagnosis.itemName}
        </div>
        <div className="mt-1 truncate text-xs font-semibold uppercase text-ink-3">
          {cat?.label ?? "Item"}
        </div>
      </div>

      <div
        className={cn(
          "inline-flex w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold",
          tone.bg,
          tone.color
        )}
      >
        <VerdictIcon className="h-4 w-4" />
        {VERDICT_LABEL_SHORT[v]}
      </div>

      <div className="text-left text-sm font-semibold tabular-nums text-ink sm:text-right">
        {co2.toFixed(1)} kg
      </div>

      <button
        type="button"
        aria-label="Remove from log"
        onClick={onRemove}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rule text-ink-3 transition-colors hover:border-v-replace hover:text-v-replace sm:justify-self-end"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
