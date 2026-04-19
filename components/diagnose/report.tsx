"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Recycle,
  Package,
  ShoppingBag,
  AlertTriangle,
  Leaf,
  Clock,
  DollarSign,
  Gauge,
  ListOrdered,
  Hammer,
  Cog,
  Share2,
  RotateCcw,
  Compass,
  CheckCircle2,
} from "lucide-react";
import {
  type Diagnosis,
  VERDICT_META,
  verdictChipClass,
  type Verdict,
  CATEGORIES,
  type CategoryId,
} from "@/lib/diagnosis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

const VerdictIcon = {
  repair: Wrench,
  salvage: Package,
  recycle: Recycle,
  replace: ShoppingBag,
} as const;

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
  const verdictMeta = VERDICT_META[diagnosis.verdict];
  const Icon = VerdictIcon[diagnosis.verdict];
  const savings = Math.max(
    0,
    diagnosis.estReplacementCostUsd - diagnosis.estRepairCostUsd
  );
  const repairIsCheaper =
    diagnosis.estRepairCostUsd < diagnosis.estReplacementCostUsd;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      className="grid gap-6"
    >
      {/* Verdict Hero */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[320px_1fr]">
          <div className="relative h-64 md:h-auto bg-bone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={diagnosis.itemName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge className="bg-paper/95 text-ink-soft">
                {cat?.label ?? "Item"}
              </Badge>
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-paper/90">
                {formatDate(new Date())}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
                  Verdict
                </div>
                <h2 className="serif text-4xl leading-tight text-ink mt-1">
                  {diagnosis.itemName}
                </h2>
              </div>
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
                  verdictChipClass(diagnosis.verdict)
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold",
                  verdictChipClass(diagnosis.verdict)
                )}
              >
                <Icon className="h-4 w-4" />
                {verdictMeta.label}
              </span>
              <ConfidenceMeter value={diagnosis.confidence} />
            </div>

            <p className="text-[15px] leading-relaxed text-ink-soft">
              {diagnosis.verdictReason}
            </p>

            <div className="grid grid-cols-3 gap-3 border-t border-ink/10 pt-5">
              <Stat
                icon={<DollarSign className="h-4 w-4" />}
                label="Repair cost"
                value={formatCurrency(diagnosis.estRepairCostUsd)}
              />
              <Stat
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={formatTime(diagnosis.timeEstimateMinutes)}
              />
              <Stat
                icon={<Gauge className="h-4 w-4" />}
                label="Difficulty"
                value={formatDifficulty(diagnosis.difficulty)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Observed + Environmental */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <Card className="p-7">
          <SectionTitle icon={<Compass className="h-4 w-4" />}>
            What we observed
          </SectionTitle>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            {diagnosis.observed}
          </p>
          <div className="mt-5 rounded-2xl border border-ink/10 bg-bone-50 p-4">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-stone">
              Your description
            </div>
            <div className="mt-1 text-[14px] text-ink-soft italic">
              &ldquo;{symptom}&rdquo;
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-7 bg-moss text-bone">
          <div className="absolute inset-0 bg-topo opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.2em] text-bone/70">
              <Leaf className="h-3.5 w-3.5" />
              Earth impact
            </div>
            <div className="mt-4 serif text-5xl leading-none">
              {formatNumber(diagnosis.environmentalImpact.co2SavedKg)}
              <span className="ml-2 text-xl text-bone/70">kg CO₂e</span>
            </div>
            <div className="mt-1 text-sm text-bone/70">
              avoided versus buying a replacement
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <div className="serif text-2xl">
                {formatNumber(diagnosis.environmentalImpact.landfillDivertedKg)}
              </div>
              <div className="text-xs text-bone/70">kg diverted from landfill</div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-bone/80">
              {diagnosis.environmentalImpact.note}
            </p>
          </div>
        </Card>
      </div>

      {/* Repair steps */}
      {diagnosis.repairSteps.length > 0 && (
        <Card className="p-7">
          <SectionTitle icon={<ListOrdered className="h-4 w-4" />}>
            Repair walkthrough
          </SectionTitle>
          <ol className="grid gap-4">
            {diagnosis.repairSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-bone text-sm serif">
                  {i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-[15px] font-semibold text-ink">
                    {step.title}
                  </div>
                  <div className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                    {step.detail}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Parts + tools + safety */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <SectionTitle icon={<Cog className="h-4 w-4" />}>Parts</SectionTitle>
          {diagnosis.parts.length === 0 ? (
            <p className="text-sm text-stone">No parts needed.</p>
          ) : (
            <ul className="space-y-3">
              {diagnosis.parts.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <div>
                    <div className="text-[14px] font-medium text-ink">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-ink-soft">{p.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <SectionTitle icon={<Hammer className="h-4 w-4" />}>Tools</SectionTitle>
          {diagnosis.tools.length === 0 ? (
            <p className="text-sm text-stone">No special tools needed.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {diagnosis.tools.map((t, i) => (
                <li
                  key={i}
                  className="rounded-full border border-ink/15 bg-bone-50 px-3 py-1 text-[13px] text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <SectionTitle icon={<AlertTriangle className="h-4 w-4" />}>
            Safety
          </SectionTitle>
          {diagnosis.safetyWarnings.length === 0 ? (
            <p className="text-sm text-stone">
              No special hazards — standard care applies.
            </p>
          ) : (
            <ul className="space-y-2">
              {diagnosis.safetyWarnings.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[13px] leading-relaxed text-ink-soft"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Cost comparison + alternative path */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <Card className="p-7">
          <SectionTitle icon={<DollarSign className="h-4 w-4" />}>
            Repair vs replace
          </SectionTitle>
          <div className="grid gap-4">
            <CostBar
              label="Estimated repair"
              value={diagnosis.estRepairCostUsd}
              max={Math.max(
                diagnosis.estRepairCostUsd,
                diagnosis.estReplacementCostUsd,
                1
              )}
              tone="moss"
            />
            <CostBar
              label="Buy replacement"
              value={diagnosis.estReplacementCostUsd}
              max={Math.max(
                diagnosis.estRepairCostUsd,
                diagnosis.estReplacementCostUsd,
                1
              )}
              tone="rust"
            />
          </div>
          {repairIsCheaper && savings > 0 && (
            <div className="mt-5 rounded-2xl border border-leaf/30 bg-leaf/5 px-4 py-3 text-sm text-moss">
              Repairing saves an estimated{" "}
              <span className="font-semibold">{formatCurrency(savings)}</span>{" "}
              over buying a replacement.
            </div>
          )}
        </Card>

        <Card className="p-7">
          <SectionTitle icon={<CheckCircle2 className="h-4 w-4" />}>
            If this doesn't work
          </SectionTitle>
          <div className="serif text-2xl text-ink">
            {diagnosis.alternativeAction.title}
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            {diagnosis.alternativeAction.detail}
          </p>
          <div className="mt-5 rounded-2xl border border-ink/10 bg-bone-50 p-4">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-stone">
              Responsible disposal
            </div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              {diagnosis.disposalGuidance}
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div className="text-sm text-ink-soft">
          Save this diagnosis to your repair log or diagnose another item.
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={() => shareReport(diagnosis)}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="moss" size="md" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Diagnose another item
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bone-100 text-ink-soft">
        {icon}
      </span>
      <div className="mono text-[11px] uppercase tracking-[0.2em] text-stone">
        {children}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-stone">{icon}</div>
      <div className="mt-2 serif text-xl leading-none text-ink">{value}</div>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-stone mt-1.5">
        {label}
      </div>
    </div>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-ink/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-y-0 left-0 bg-leaf"
        />
      </div>
      <div className="mono text-[11px] uppercase tracking-[0.2em] text-stone">
        {pct}% conf.
      </div>
    </div>
  );
}

function CostBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "moss" | "rust";
}) {
  const pct = Math.max(6, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-[13px] text-ink-soft">{label}</div>
        <div className="serif text-xl text-ink">{formatCurrency(value)}</div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className={cn(
            "h-full rounded-full",
            tone === "moss" ? "bg-moss" : "bg-rust"
          )}
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
  const text = `Repair Oracle says: ${VERDICT_META[d.verdict as Verdict].label} — "${d.itemName}". ${Math.round(d.environmentalImpact.co2SavedKg)} kg CO₂e saved.`;
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator).share({ title: "Repair Oracle", text });
      return;
    } catch {
      // fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // no-op
  }
}
