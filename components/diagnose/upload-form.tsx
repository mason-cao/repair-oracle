"use client";

import * as React from "react";
import {
  Camera,
  ImagePlus,
  LoaderCircle,
  ScanLine,
  Upload,
  X,
} from "lucide-react";
import { Textarea, Label, Input } from "@/components/ui/input";
import { CATEGORIES, type CategoryId, type Diagnosis } from "@/lib/diagnosis";
import { cn } from "@/lib/utils";

type Stage = "idle" | "analyzing" | "ready" | "error";

const SCAN_STEPS = [
  "Read image",
  "Classify item",
  "Match failure mode",
  "Score repair viability",
  "Estimate parts and cost",
  "Draft verdict",
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
  const [category, setCategory] =
    React.useState<CategoryId>("small-appliance");
  const [itemHint, setItemHint] = React.useState("");
  const [symptom, setSymptom] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  React.useEffect(() => {
    if (stage !== "analyzing") return;
    const id = setInterval(() => {
      setScanProgress((i) => Math.min(SCAN_STEPS.length, i + 1));
    }, 620);
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
      setError("Please upload an image file.");
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
      setError("Describe what is wrong.");
      return;
    }
    setError(null);
    setScanProgress(1);
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
      className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6"
    >
      <div id="capture-bay" className="command-panel scroll-mt-24 overflow-hidden">
        <div className="flex items-center justify-between border-b border-forest-ink/15 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-forest-ink">
            <ImagePlus className="h-4 w-4 text-mint" />
            Capture bay
          </div>
          <span className="text-xs font-semibold uppercase text-forest-ink/70">
            JPG PNG HEIC
          </span>
        </div>

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
            "console-grid relative aspect-[4/3] w-full bg-bg-contrast transition-colors",
            dragOver && "bg-moss"
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
              <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                <span className="rounded-md border border-forest-ink/15 bg-bg-contrast/80 px-3 py-2 text-xs font-semibold text-forest-ink backdrop-blur">
                  {file?.name}
                </span>
                {stage !== "analyzing" && (
                  <button
                    type="button"
                    onClick={clearFile}
                    aria-label="Remove photo"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-forest-ink/15 bg-bg-contrast/80 text-forest-ink hover:bg-v-replace"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {stage === "analyzing" && (
                <div className="absolute inset-0 flex flex-col justify-end bg-bg-contrast/80 p-5 text-forest-ink backdrop-blur-sm">
                  <div className="scan-sweep absolute inset-x-0 top-0 h-28" />
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LoaderCircle className="h-4 w-4 animate-spin text-mint" />
                    Running diagnosis
                  </div>
                  <div className="mt-4 grid gap-2">
                    {SCAN_STEPS.slice(0, scanProgress).map((step, i) => (
                      <div
                        key={step}
                        className="flex items-center justify-between border-t border-forest-ink/15 pt-2 text-sm"
                      >
                        <span>{step}</span>
                        <span className="text-forest-ink/76">
                          {i < scanProgress - 1 ? "done" : "active"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-5">
              <div className="max-w-[30rem] text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-md border border-mint/25 bg-mint/10 text-mint">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-forest-ink">
                  Add the broken object.
                </h3>
                <p className="mt-3 text-sm leading-6 text-forest-ink/80">
                  Frame the failure point clearly. The engine uses the image and
                  your note to score repair viability.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      inputRef.current?.removeAttribute("capture");
                      inputRef.current?.click();
                    }}
                    className="premium-button inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-semibold"
                  >
                    <Upload className="h-4 w-4" />
                    Choose file
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      inputRef.current?.setAttribute("capture", "environment");
                      inputRef.current?.click();
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-forest-ink/20 bg-forest-ink/10 px-4 text-sm font-semibold text-forest-ink hover:bg-forest-ink/15"
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </button>
                </div>
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

        <div className="grid grid-cols-3 border-t border-forest-ink/15">
          <StatusCell label="File" value={file ? formatBytes(file.size) : "None"} />
          <StatusCell label="Privacy" value="Submit only" />
          <StatusCell label="Limit" value="8MB" />
        </div>
      </div>

      <div id="intake-profile" className="surface-panel scroll-mt-24 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => document.getElementById("itemHint")?.focus()}
              className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-mint"
            >
              <ScanLine className="h-4 w-4 text-forest" />
              Intake profile
            </button>
            <p className="mt-2 text-sm leading-6 text-ink-3">
              Specific symptoms produce sharper parts, cost, safety, and
              material-impact recommendations.
            </p>
          </div>
          <div className="glass-chip rounded-sm px-2 py-1 text-xs font-semibold text-ink-3">
            {stage.toUpperCase()}
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <fieldset className="grid gap-3">
            <Label htmlFor="category">Material family</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "min-h-11 rounded-md border px-3 py-2 text-left text-sm font-semibold",
                    category === c.id
                      ? "border-forest bg-forest text-bg-contrast shadow-[0_10px_28px_rgba(7,19,15,0.16)]"
                      : "border-rule bg-bg-raised/40 text-ink-2 backdrop-blur-md hover:border-rule-strong hover:bg-bg-raised/55 hover:text-ink"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-2">
            <Label htmlFor="itemHint">Item name, optional</Label>
            <Input
              id="itemHint"
              variant="bordered"
              placeholder="Breville BKE820 electric kettle"
              value={itemHint}
              onChange={(e) => setItemHint(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="symptom">Failure note</Label>
            <Textarea
              id="symptom"
              ref={textareaRef}
              variant="bordered"
              placeholder="Light turns on, but the water stays cold."
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              maxLength={1200}
              rows={4}
            />
            <div className="flex justify-between gap-4 text-xs text-ink-3">
              <span>What works, what changed, what you already tried.</span>
              <span>{charCount}/1200</span>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-v-replace/30 bg-v-replace/10 px-3 py-2 text-sm font-medium text-v-replace">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className="premium-button inline-flex h-12 items-center justify-center gap-2 px-5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              {stage === "analyzing" ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <ScanLine className="h-4 w-4" />
                  Run diagnosis
                </>
              )}
            </button>
            <span className="text-sm text-ink-3">No account required.</span>
          </div>
        </div>
      </div>
    </form>
  );
}

function StatusCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <div className="text-[11px] font-semibold uppercase text-forest-ink/66">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-forest-ink">
        {value}
      </div>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
