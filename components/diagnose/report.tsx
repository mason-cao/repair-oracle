"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Recycle,
  RefreshCw,
  Share2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  type Diagnosis,
  VERDICT_META,
  type Verdict,
  CATEGORIES,
  type CategoryId,
} from "@/lib/diagnosis";
import { cn, formatCurrency } from "@/lib/utils";

const VERDICT_TONE: Record<
  Verdict,
  {
    label: string;
    text: string;
    bg: string;
    border: string;
    bar: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  repair: {
    label: "Repair it",
    text: "text-v-repair",
    bg: "bg-v-repair/10",
    border: "border-v-repair/30",
    bar: "bg-v-repair",
    icon: Wrench,
  },
  salvage: {
    label: "Salvage parts",
    text: "text-v-salvage",
    bg: "bg-v-salvage/10",
    border: "border-v-salvage/30",
    bar: "bg-v-salvage",
    icon: ShieldCheck,
  },
  recycle: {
    label: "Recycle responsibly",
    text: "text-v-recycle",
    bg: "bg-v-recycle/10",
    border: "border-v-recycle/30",
    bar: "bg-v-recycle",
    icon: Recycle,
  },
  replace: {
    label: "Replace carefully",
    text: "text-v-replace",
    bg: "bg-v-replace/10",
    border: "border-v-replace/30",
    bar: "bg-v-replace",
    icon: AlertTriangle,
  },
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
  const tone = VERDICT_TONE[diagnosis.verdict];
  const VerdictIcon = tone.icon;
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
  const replacePct = Math.max(
    6,
    (diagnosis.estReplacementCostUsd / maxCost) * 100
  );

  return (
    <div className="grid gap-6">
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <figure className="surface-panel overflow-hidden">
          <div className="relative aspect-[4/3] bg-bg-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={diagnosis.itemName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-md bg-bg-raised/92 p-3 shadow-sm">
              <div className="text-xs font-semibold uppercase text-ink-3">
                {cat?.label ?? "Item"}
              </div>
              <figcaption className="mt-1 text-sm font-semibold text-ink">
                {diagnosis.itemName}
              </figcaption>
            </div>
          </div>
        </figure>

        <div className="surface-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold",
                tone.bg,
                tone.border,
                tone.text
              )}
            >
              <VerdictIcon className="h-4 w-4" />
              {tone.label}
            </div>
            <div className="text-right text-sm text-ink-3">
              <div className="font-semibold text-ink">
                {Math.round(diagnosis.confidence)}/100
              </div>
              <div>confidence</div>
            </div>
          </div>

          <h3 className="t-display verdict-in mt-8 text-ink">
            {diagnosis.itemName}
          </h3>
          <p className="mt-5 max-w-[44rem] text-base leading-7 text-ink-2">
            {diagnosis.verdictReason}
          </p>

          <div className="mt-8 border-t border-rule pt-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-ink">
                {VERDICT_META[diagnosis.verdict].tagline}
              </span>
              <span className="text-ink-3">{formatDate(new Date())}</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-rule-faint">
              <div
                className={cn("h-full rounded-full", tone.bar)}
                style={{ width: `${Math.max(4, diagnosis.confidence)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard
          icon={ShieldCheck}
          label="Difficulty"
          value={formatDifficulty(diagnosis.difficulty)}
        />
        <MetricCard
          icon={Clock}
          label="Time"
          value={formatTime(diagnosis.timeEstimateMinutes)}
        />
        <MetricCard
          icon={DollarSign}
          label="Repair"
          value={formatCurrency(diagnosis.estRepairCostUsd)}
        />
        <MetricCard
          icon={DollarSign}
          label="Replace"
          value={formatCurrency(diagnosis.estReplacementCostUsd)}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface-panel p-5 sm:p-6">
          <SectionLabel>Observed</SectionLabel>
          <p className="text-base leading-7 text-ink-2">
            {diagnosis.observed}
          </p>
          <blockquote className="mt-6 rounded-md border border-rule bg-bg px-4 py-3 text-sm leading-6 text-ink-2">
            “{symptom}”
            <div className="mt-2 text-xs font-semibold uppercase text-ink-3">
              Your note
            </div>
          </blockquote>
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <SectionLabel>Earth impact</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <ImpactNumber
              value={formatNumber(diagnosis.environmentalImpact.co2SavedKg)}
              label="kg CO2e avoided"
            />
            <ImpactNumber
              value={formatNumber(
                diagnosis.environmentalImpact.landfillDivertedKg
              )}
              label="kg diverted"
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-ink-2">
            {diagnosis.environmentalImpact.note}
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.16fr_0.84fr]">
        <div className="surface-panel p-5 sm:p-6">
          <SectionLabel>Repair procedure</SectionLabel>
          {diagnosis.repairSteps.length === 0 ? (
            <p className="text-sm text-ink-3">No procedure needed.</p>
          ) : (
            <ol className="grid gap-0">
              {diagnosis.repairSteps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-rule py-5 first:border-t-0 first:pt-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-bg text-sm font-semibold text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-ink">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-ink-2">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="grid gap-5">
          <div className="surface-panel p-5 sm:p-6">
            <SectionLabel>Parts</SectionLabel>
            {diagnosis.parts.length === 0 ? (
              <p className="text-sm text-ink-3">None.</p>
            ) : (
              <ul className="grid gap-3">
                {diagnosis.parts.map((p, i) => (
                  <li key={i} className="border-t border-rule pt-3 first:border-t-0 first:pt-0">
                    <div className="text-sm font-semibold text-ink">
                      {p.name}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-ink-3">
                      {p.note}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="surface-panel p-5 sm:p-6">
            <SectionLabel>Tools</SectionLabel>
            {diagnosis.tools.length === 0 ? (
              <p className="text-sm text-ink-3">None required.</p>
            ) : (
              <p className="text-sm leading-6 text-ink-2">
                {diagnosis.tools.join(", ")}.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-5 sm:p-6">
          <SectionLabel>Repair vs replace</SectionLabel>
          <div className="grid gap-5">
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
            <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-mint px-3 py-2 text-sm font-semibold text-forest">
              <CheckCircle2 className="h-4 w-4" />
              {formatCurrency(savings)} saved vs replacement
            </div>
          )}
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <SectionLabel>Cautions</SectionLabel>
          {diagnosis.safetyWarnings.length === 0 ? (
            <p className="text-sm leading-6 text-ink-3">
              No special hazards returned. Use standard care.
            </p>
          ) : (
            <ul className="grid gap-3">
              {diagnosis.safetyWarnings.map((w, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border border-v-salvage/25 bg-v-salvage/10 p-3 text-sm leading-6 text-ink-2"
                >
                  <AlertTriangle className="mt-1 h-4 w-4 text-v-salvage" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <SectionLabel>If this fails</SectionLabel>
            <h4 className="t-h2 text-ink">
              {diagnosis.alternativeAction.title}
            </h4>
            <p className="mt-3 text-base leading-7 text-ink-2">
              {diagnosis.alternativeAction.detail}
            </p>
          </div>
          <div>
            <SectionLabel>Disposal path</SectionLabel>
            <p className="text-base leading-7 text-ink-2">
              {diagnosis.disposalGuidance}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 text-[15px] font-semibold text-bg transition-colors hover:bg-forest"
        >
          <RefreshCw className="h-4 w-4" />
          Diagnose another
        </button>
        <button
          onClick={() => shareReport(diagnosis)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-rule-strong bg-bg-raised px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
        >
          <Share2 className="h-4 w-4" />
          Share result
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-xs font-semibold uppercase text-forest">
      {children}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase text-ink-3">
          {label}
        </div>
        <Icon className="h-4 w-4 text-forest" />
      </div>
      <div className="mt-3 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}

function ImpactNumber({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-rule bg-bg px-4 py-4">
      <div className="text-3xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase text-ink-3">
        {label}
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
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm font-semibold text-ink-2">{label}</div>
        <div className="text-lg font-semibold text-ink">
          {formatCurrency(value)}
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-rule-faint">
        <div
          className={cn("h-full rounded-full", colorClass)}
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
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function shareReport(d: Diagnosis) {
  const text = `Repair Oracle: ${VERDICT_META[d.verdict as Verdict].label} for ${d.itemName}. ${Math.round(d.environmentalImpact.co2SavedKg)} kg CO2e avoided.`;
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title: "Repair Oracle", text });
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
