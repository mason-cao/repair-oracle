"use client";

import * as React from "react";
import {
  type Diagnosis,
  VERDICT_META,
  type Verdict,
  CATEGORIES,
  type CategoryId,
} from "@/lib/diagnosis";
import { cn, formatCurrency } from "@/lib/utils";

const VERDICT_COLOR: Record<Verdict, string> = {
  repair: "text-v-repair",
  salvage: "text-v-salvage",
  recycle: "text-v-recycle",
  replace: "text-v-replace",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  repair: "Repair.",
  salvage: "Salvage.",
  recycle: "Recycle.",
  replace: "Replace.",
};

export function Report({
  diagnosis,
  image,
  category,
  symptom,
  onReset,
}: {
  diagnosis: Diagnosis;
  image: string;
  category: CategoryId;
  symptom: string;
  onReset: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === category);
  const savings = Math.max(
    0,
    diagnosis.estReplacementCostUsd - diagnosis.estRepairCostUsd
  );
  const maxCost = Math.max(
    diagnosis.estRepairCostUsd,
    diagnosis.estReplacementCostUsd,
    1
  );
  const repairPct = Math.max(6, (diagnosis.estRepairCostUsd / maxCost) * 100);
  const replacePct = Math.max(6, (diagnosis.estReplacementCostUsd / maxCost) * 100);

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Row 1 — Verdict banner */}
      <section className="grid grid-cols-12 gap-6 sm:gap-8">
        <figure className="col-span-12 md:col-span-5">
          <div className="relative aspect-[3/2] w-full border border-rule-strong overflow-hidden bg-bg-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={diagnosis.itemName}
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mono mt-3 flex items-baseline justify-between text-[10.5px] tracking-[0.02em] text-ink-3">
            <span className="uppercase">{cat?.label ?? "Item"}</span>
            <time>{formatDate(new Date())}</time>
          </figcaption>
        </figure>

        <div className="col-span-12 md:col-span-7 flex flex-col gap-6">
          <div>
            <div className="mono text-[11px] tracking-[0.02em] text-ink-3">
              Verdict
            </div>
            <h3 className="t-h1 mt-2 text-ink">{diagnosis.itemName}</h3>
          </div>

          <div
            className={cn("t-display verdict-in", VERDICT_COLOR[diagnosis.verdict])}
            aria-label={`Verdict: ${VERDICT_META[diagnosis.verdict].label}`}
          >
            {VERDICT_LABEL[diagnosis.verdict]}
          </div>

          <p className="t-body max-w-[58ch] text-ink-2">
            {diagnosis.verdictReason}
          </p>

          <div className="mono flex items-center gap-6 text-[11px] tracking-[0.02em] text-ink-3">
            <span>
              Confidence{" "}
              <span className="text-ink">
                {Math.round(diagnosis.confidence)}
              </span>
              <span className="text-ink-3">/100</span>
            </span>
            <span aria-hidden>·</span>
            <span>{VERDICT_META[diagnosis.verdict].tagline}</span>
          </div>
        </div>
      </section>

      {/* Row 2 — Metadata strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 rule-t rule-b">
        <Meta label="Difficulty" value={formatDifficulty(diagnosis.difficulty)} />
        <Meta label="Time" value={formatTime(diagnosis.timeEstimateMinutes)} borderL />
        <Meta label="Cost · repair" value={formatCurrency(diagnosis.estRepairCostUsd)} borderL />
        <Meta label="Cost · replace" value={formatCurrency(diagnosis.estReplacementCostUsd)} borderL />
      </section>

      {/* Row 3 — Observed + Impact */}
      <section className="grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-6">
          <SectionLabel>01 · Observed</SectionLabel>
          <p className="t-body max-w-[58ch] text-ink-2">{diagnosis.observed}</p>
          <blockquote className="mt-6 border-l-2 border-rule-strong pl-4 t-small text-ink-2 italic">
            &ldquo;{symptom}&rdquo;
            <div className="mono not-italic mt-2 text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
              From your note
            </div>
          </blockquote>
        </div>

        <div className="col-span-12 md:col-span-6 md:border-l md:border-rule md:pl-10">
          <SectionLabel>02 · Earth impact</SectionLabel>
          <div className="flex items-baseline gap-3">
            <span className="t-display text-ink">
              {formatNumber(diagnosis.environmentalImpact.co2SavedKg)}
            </span>
            <span className="mono text-[11px] tracking-[0.02em] text-ink-3">
              kg CO₂e avoided
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="t-h2 text-ink">
              {formatNumber(diagnosis.environmentalImpact.landfillDivertedKg)}
            </span>
            <span className="mono text-[11px] tracking-[0.02em] text-ink-3">
              kg kept from landfill
            </span>
          </div>
          <p className="mt-6 max-w-[52ch] t-small text-ink-2">
            {diagnosis.environmentalImpact.note}
          </p>
        </div>
      </section>

      {/* Row 4 — Steps + Parts & tools */}
      <section className="grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-8">
          <SectionLabel>03 · Procedure</SectionLabel>
          {diagnosis.repairSteps.length === 0 ? (
            <p className="t-small text-ink-3">No procedure needed.</p>
          ) : (
            <ol className="flex flex-col">
              {diagnosis.repairSteps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[3rem_1fr] gap-4 py-5 border-t border-rule first:border-t-0 first:pt-0"
                >
                  <span className="mono text-[13px] text-ink-3 pt-[2px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="t-h3 text-ink">{step.title}</div>
                    <p className="mt-2 t-small max-w-[62ch] text-ink-2">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="col-span-12 md:col-span-4 md:border-l md:border-rule md:pl-10 flex flex-col gap-10">
          <div>
            <SectionLabel>Parts</SectionLabel>
            {diagnosis.parts.length === 0 ? (
              <p className="t-small text-ink-3">None.</p>
            ) : (
              <ul className="flex flex-col">
                {diagnosis.parts.map((p, i) => (
                  <li key={i} className="py-3 border-t border-rule first:border-t-0 first:pt-0">
                    <div className="text-[14px] font-medium text-ink">
                      {p.name}
                    </div>
                    <div className="t-small text-ink-3 mt-1">{p.note}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <SectionLabel>Tools</SectionLabel>
            {diagnosis.tools.length === 0 ? (
              <p className="t-small text-ink-3">None required.</p>
            ) : (
              <p className="t-small text-ink-2">
                {diagnosis.tools.join(", ")}.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Row 5 — Cost comparison + Cautions */}
      <section className="grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-7">
          <SectionLabel>04 · Repair vs replace</SectionLabel>
          <div className="flex flex-col gap-5">
            <CostLine
              label="Repair"
              value={diagnosis.estRepairCostUsd}
              pct={repairPct}
              colorClass="bg-v-repair"
            />
            <CostLine
              label="Replace"
              value={diagnosis.estReplacementCostUsd}
              pct={replacePct}
              colorClass="bg-v-replace"
            />
          </div>
          {savings > 0 && (
            <div className="mono mt-6 inline-flex items-baseline gap-2 text-[12px] tracking-[0.02em] text-ink-2">
              <span>Savings</span>
              <span className="text-ink font-medium">
                {formatCurrency(savings)}
              </span>
              <span className="text-ink-3">vs replacement</span>
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-5 md:border-l md:border-rule md:pl-10">
          <SectionLabel>Cautions</SectionLabel>
          {diagnosis.safetyWarnings.length === 0 ? (
            <p className="t-small text-ink-3">
              No special hazards — standard care applies.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {diagnosis.safetyWarnings.map((w, i) => (
                <li key={i} className="grid grid-cols-[1rem_1fr] gap-3 t-small text-ink-2">
                  <span className="mono text-[11px] text-v-salvage pt-0.5">!</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Row 6 — If this fails + Disposal */}
      <section className="grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-6">
          <SectionLabel>05 · If this fails</SectionLabel>
          <h4 className="t-h2 text-ink">
            {diagnosis.alternativeAction.title}
          </h4>
          <p className="mt-3 t-body max-w-[58ch] text-ink-2">
            {diagnosis.alternativeAction.detail}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:border-l md:border-rule md:pl-10">
          <SectionLabel>Disposal</SectionLabel>
          <p className="t-body max-w-[58ch] text-ink-2">
            {diagnosis.disposalGuidance}
          </p>
        </div>
      </section>

      {/* Row 7 — Actions */}
      <div className="flex flex-wrap items-center gap-4 rule-t pt-8">
        <button
          onClick={onReset}
          className="inline-flex h-12 items-center gap-2 bg-ink px-5 text-[15px] font-medium text-bg transition-colors hover:bg-forest cursor-pointer"
        >
          Diagnose another <span aria-hidden>→</span>
        </button>
        <button
          onClick={() => shareReport(diagnosis)}
          className="inline-flex h-12 items-center gap-2 border border-rule-strong px-5 text-[15px] text-ink transition-colors hover:border-ink cursor-pointer"
        >
          Share result
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono mb-5 text-[11px] uppercase tracking-[0.08em] text-ink-3">
      {children}
    </div>
  );
}

function Meta({
  label,
  value,
  borderL,
}: {
  label: string;
  value: string;
  borderL?: boolean;
}) {
  return (
    <div className={cn("px-4 sm:px-5 py-5", borderL && "sm:border-l sm:border-rule")}>
      <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
        {label}
      </div>
      <div className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-ink">
        {value}
      </div>
    </div>
  );
}

function CostLine({
  label,
  value,
  pct,
  colorClass,
}: {
  label: string;
  value: number;
  pct: number;
  colorClass: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          {label}
        </div>
        <div className="text-[17px] font-medium tracking-[-0.01em] text-ink">
          {formatCurrency(value)}
        </div>
      </div>
      <div className="relative mt-2 h-[2px] w-full bg-rule">
        <div
          className={cn("absolute left-0 top-0 h-full", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatTime(mins: number): string {
  if (mins < 60) return `${Math.max(1, Math.round(mins))} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function formatDifficulty(d: Diagnosis["difficulty"]): string {
  switch (d) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    case "pro-only":
      return "Pro only";
  }
}

function formatNumber(n: number): string {
  if (n >= 100) return Math.round(n).toString();
  if (n >= 10) return n.toFixed(1).replace(/\.0$/, "");
  return n.toFixed(1);
}

function formatDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })
    .replace(/\//g, "·");
}

async function shareReport(d: Diagnosis) {
  const text = `Repair Oracle: ${VERDICT_META[d.verdict as Verdict].label} — "${d.itemName}". ${Math.round(d.environmentalImpact.co2SavedKg)} kg CO₂e saved.`;
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator).share({ title: "Repair Oracle", text });
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* no-op */
  }
}
