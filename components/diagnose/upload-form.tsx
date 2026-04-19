"use client";

import * as React from "react";
import { Textarea, Label, Input } from "@/components/ui/input";
import { CATEGORIES, type CategoryId, type Diagnosis } from "@/lib/diagnosis";
import { cn } from "@/lib/utils";

type Stage = "idle" | "analyzing" | "ready" | "error";

const SCAN_STEPS = [
  "reading image",
  "classifying item",
  "matching failure mode",
  "scoring viability",
  "estimating parts + cost",
  "drafting verdict",
];

export function UploadForm({
  onResult,
}: {
  onResult: (result: {
    diagnosis: Diagnosis;
    image: string;
    category: CategoryId;
    symptom: string;
  }) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<CategoryId>("small-appliance");
  const [itemHint, setItemHint] = React.useState("");
  const [symptom, setSymptom] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (stage !== "analyzing") return;
    setScanProgress(1);
    const id = setInterval(() => {
      setScanProgress((i) => Math.min(SCAN_STEPS.length, i + 1));
    }, 650);
    return () => clearInterval(id);
  }, [stage]);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(320, el.scrollHeight)}px`;
  }, [symptom]);

  function handleFile(f: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, HEIC).");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }
    setError(null);
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Add a photo first.");
      return;
    }
    if (symptom.trim().length < 4) {
      setError("Describe what's wrong in a sentence or two.");
      return;
    }
    setError(null);
    setStage("analyzing");

    const form = new FormData();
    form.append("image", file);
    form.append("category", category);
    form.append("symptom", symptom);
    form.append("itemHint", itemHint);

    try {
      const res = await fetch("/api/diagnose", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong analyzing the image.");
      }
      const { diagnosis } = (await res.json()) as { diagnosis: Diagnosis };
      setStage("ready");
      const reader = new FileReader();
      reader.onload = () => {
        onResult({
          diagnosis,
          image: reader.result as string,
          category,
          symptom,
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const canSubmit = file && symptom.trim().length >= 4 && stage !== "analyzing";
  const charCount = symptom.length;

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-12 gap-6 sm:gap-8 md:gap-10"
    >
      {/* Image column */}
      <div className="col-span-12 md:col-span-7">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "relative aspect-[4/3] w-full border bg-bg-raised transition-colors duration-150",
            preview ? "border-rule-strong" : "border-dashed border-rule-strong",
            dragOver && "border-forest"
          )}
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded item"
                className="h-full w-full object-cover"
              />
              {stage !== "analyzing" && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="mono absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 border border-ink/20 bg-bg-raised/95 px-2 text-[11px] uppercase tracking-[0.08em] text-ink-2 transition-colors hover:text-ink hover:border-ink cursor-pointer"
                >
                  ✕ Replace
                </button>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
              <div className="mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                Photograph
              </div>
              <div className="t-h3 text-ink">Add an image of the item.</div>
              <div className="max-w-[46ch] t-small text-ink-3">
                Drop a file here, or select one. Good lighting, broken part
                in frame. JPG, PNG, HEIC.
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    inputRef.current?.removeAttribute("capture");
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 bg-ink px-4 h-10 text-sm font-medium text-bg transition-colors hover:bg-forest cursor-pointer"
                >
                  Choose file
                </button>
                <button
                  type="button"
                  onClick={() => {
                    inputRef.current?.setAttribute("capture", "environment");
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 border border-rule-strong px-4 h-10 text-sm text-ink transition-colors hover:border-ink cursor-pointer"
                >
                  Use camera
                </button>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Filename + analyzing status strip */}
        <div className="mt-4 min-h-[88px]">
          {file && stage !== "analyzing" && (
            <div className="mono flex items-baseline justify-between text-[11px] text-ink-3">
              <span className="truncate pr-4">{file.name}</span>
              <span className="shrink-0">{formatBytes(file.size)}</span>
            </div>
          )}
          {stage === "analyzing" && (
            <ul className="mono text-[12px] leading-[1.7] text-ink-2">
              {SCAN_STEPS.slice(0, scanProgress).map((step, i) => (
                <li key={step} className="flex items-baseline gap-3">
                  <span className="text-ink-3 w-3">▸</span>
                  <span className="flex-1">{step}</span>
                  {i < scanProgress - 1 ? (
                    <span className="text-ink-3">done</span>
                  ) : (
                    <span className="text-ink-3">…</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Form column */}
      <div className="col-span-12 md:col-span-5 flex flex-col gap-7">
        <fieldset className="flex flex-col gap-3">
          <Label htmlFor="category">Category</Label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "mono px-2.5 h-7 text-[11px] uppercase tracking-[0.05em] border transition-colors cursor-pointer",
                  category === c.id
                    ? "bg-ink text-bg border-ink"
                    : "bg-transparent text-ink-2 border-rule-strong hover:text-ink hover:border-ink"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="itemHint">Item name — optional</Label>
          <Input
            id="itemHint"
            variant="rule"
            placeholder="e.g. Breville BKE820 electric kettle"
            value={itemHint}
            onChange={(e) => setItemHint(e.target.value)}
            maxLength={120}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="symptom">The failure</Label>
          <Textarea
            id="symptom"
            ref={textareaRef}
            variant="rule"
            placeholder="Won't heat up anymore. Light turns on but water stays cold."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            maxLength={1200}
            rows={3}
          />
          <div className="mono flex justify-between text-[10.5px] tracking-[0.02em] text-ink-3">
            <span>Be specific. What works, what doesn&apos;t.</span>
            <span>{charCount}/1200</span>
          </div>
        </div>

        {error && (
          <div className="mono border-l-2 border-v-replace pl-3 py-1.5 text-[12px] text-v-replace">
            {error}
          </div>
        )}

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-12 items-center justify-center gap-2 bg-ink px-5 text-[15px] font-medium text-bg transition-colors hover:bg-forest disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {stage === "analyzing" ? (
              <>
                <Spinner /> Running diagnosis…
              </>
            ) : (
              <>
                Run diagnosis <span aria-hidden>→</span>
              </>
            )}
          </button>
          <div className="mono text-[10.5px] tracking-[0.02em] text-ink-3">
            Photo never leaves until you submit.
          </div>
        </div>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="6" opacity="0.25" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="square" />
    </svg>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
