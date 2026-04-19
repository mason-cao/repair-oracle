"use client";

import * as React from "react";
import { Trash2, Leaf, Archive } from "lucide-react";
import {
  clearHistory,
  loadHistory,
  removeHistory,
  type HistoryEntry,
} from "@/lib/history";
import {
  CATEGORIES,
  VERDICT_META,
  verdictChipClass,
  type Verdict,
} from "@/lib/diagnosis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <section id="log" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
            Your repair log
          </div>
          <h2 className="serif mt-2 text-4xl text-ink md:text-5xl">
            Every fix, remembered.
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-soft">
            Past diagnoses are stored on this device. Come back to resume a
            repair, or track how much waste you've kept out of the landfill.
          </p>
        </div>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Clear your entire repair log?")) {
                clearHistory();
                setEntries([]);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-10 rounded-[28px] border border-dashed border-ink/20 bg-paper/50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bone-100 text-stone">
            <Archive className="h-5 w-5" />
          </div>
          <div className="serif mt-4 text-xl text-ink">No repairs logged yet</div>
          <div className="mt-1 text-sm text-stone">
            Diagnose your first broken item above to start your log.
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Summary label="Items diagnosed" value={entries.length.toString()} />
            <Summary
              label="kg CO₂e saved"
              value={totalCo2.toFixed(1)}
              accent
            />
            <Summary
              label="kg diverted"
              value={totalLandfill.toFixed(1)}
              accent
            />
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {entries.map((e) => (
              <LogCard
                key={e.id}
                entry={e}
                onRemove={() => {
                  removeHistory(e.id);
                  setEntries(loadHistory());
                }}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function Summary({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4",
        accent ? "border-leaf/30 bg-leaf/5" : "border-ink/10 bg-paper"
      )}
    >
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-stone">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="serif text-3xl text-ink">{value}</div>
        {accent && <Leaf className="h-4 w-4 text-leaf" />}
      </div>
    </div>
  );
}

function LogCard({
  entry,
  onRemove,
}: {
  entry: HistoryEntry;
  onRemove: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === entry.category);
  const v = entry.diagnosis.verdict as Verdict;
  const meta = VERDICT_META[v];
  return (
    <li className="group relative flex gap-4 rounded-2xl border border-ink/10 bg-paper p-4 transition-all hover:border-ink/25">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-bone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.image}
          alt={entry.diagnosis.itemName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-stone">
              {cat?.label ?? "Item"} ·{" "}
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="serif mt-1 text-lg text-ink line-clamp-1">
              {entry.diagnosis.itemName}
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
              verdictChipClass(v)
            )}
          >
            {meta.label}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-ink-soft line-clamp-2">
          {entry.diagnosis.verdictReason}
        </p>
      </div>
      <button
        type="button"
        aria-label="Remove from log"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-stone opacity-0 transition hover:bg-ink/5 hover:text-ink group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
