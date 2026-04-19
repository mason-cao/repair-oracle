"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  Loader2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea, Label, Input } from "@/components/ui/input";
import { CATEGORIES, type CategoryId, type Diagnosis } from "@/lib/diagnosis";
import { cn } from "@/lib/utils";

type Stage = "idle" | "analyzing" | "ready" | "error";

const SCAN_STEPS = [
  "Reading image context",
  "Identifying item class",
  "Cross-referencing failure modes",
  "Scoring repair viability",
  "Estimating parts & cost",
  "Computing material recovery",
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
  const [scanIdx, setScanIdx] = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (stage !== "analyzing") return;
    setScanIdx(0);
    const id = setInterval(() => {
      setScanIdx((i) => (i + 1) % SCAN_STEPS.length);
    }, 1100);
    return () => clearInterval(id);
  }, [stage]);

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
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Add a photo of the broken item first.");
      return;
    }
    if (symptom.trim().length < 4) {
      setError("Tell us what's wrong — a sentence or two is enough.");
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
      // keep preview data for handoff
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

  return (
    <form onSubmit={submit} className="grid gap-8 md:grid-cols-[1.05fr_1fr]">
      {/* Left — image dropzone */}
      <div className="relative">
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
            "relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-ink/15 bg-bone-50 transition-all",
            dragOver && "border-leaf ring-2 ring-leaf/30",
            preview && "border-ink/20"
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
              {stage === "analyzing" && (
                <>
                  <div className="absolute inset-0 bg-ink/20" />
                  <div className="scan-line absolute inset-x-0 h-[30%] bg-gradient-to-b from-transparent via-lime/50 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-6 top-6 flex items-center gap-2 rounded-full bg-paper/95 px-4 py-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-moss" />
                    <span className="text-ink-soft">Analyzing…</span>
                  </div>
                </>
              )}
              {stage !== "analyzing" && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute right-4 top-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-paper/95 px-3 text-sm text-ink-soft hover:bg-paper border border-ink/10"
                >
                  <X className="h-4 w-4" />
                  Replace photo
                </button>
              )}

              {/* Corner marks — field-guide feel */}
              <CornerMarks />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-leaf/25 pulse-ring" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-moss text-bone">
                  <Camera className="h-7 w-7" />
                </div>
              </div>
              <div>
                <div className="serif text-2xl text-ink">
                  Add a photo of the broken item
                </div>
                <div className="mt-2 max-w-sm text-sm text-ink-soft">
                  Drag & drop, or tap to upload. Good lighting, broken part in
                  frame. HEIC, JPG, and PNG all work.
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="moss"
                  size="md"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Choose photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    inputRef.current?.setAttribute("capture", "environment");
                    inputRef.current?.click();
                  }}
                >
                  <Camera className="h-4 w-4" />
                  Use camera
                </Button>
              </div>
              <CornerMarks />
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

        <AnimatePresence>
          {stage === "analyzing" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[92%] rounded-2xl border border-ink/10 bg-paper px-5 py-3 shadow-[0_30px_60px_-30px_rgba(17,23,20,0.35)]"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-leaf" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scanIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-[15px] text-ink"
                  >
                    {SCAN_STEPS[scanIdx]}
                  </motion.div>
                </AnimatePresence>
                <div className="ml-auto mono text-[11px] uppercase tracking-[0.18em] text-stone">
                  Gemini Vision · 2.5
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right — form */}
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <Label htmlFor="category">What is it?</Label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "group flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                  category === c.id
                    ? "border-moss bg-moss text-bone"
                    : "border-ink/10 bg-paper text-ink hover:border-ink/25"
                )}
              >
                <div className="text-[13px] font-medium">{c.label}</div>
                <div
                  className={cn(
                    "text-[11px]",
                    category === c.id ? "text-bone/70" : "text-stone"
                  )}
                >
                  {c.hint}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemHint">Item name (optional)</Label>
          <Input
            id="itemHint"
            placeholder="e.g. Breville BKE820 electric kettle"
            value={itemHint}
            onChange={(e) => setItemHint(e.target.value)}
            maxLength={120}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptom">What's wrong with it?</Label>
          <Textarea
            id="symptom"
            placeholder="Describe the symptom. Example: Won't heat up anymore, light turns on but water stays cold."
            rows={5}
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            maxLength={1200}
          />
          <div className="flex justify-between text-[11px] text-stone">
            <span>Be specific about what works and what doesn't.</span>
            <span>{symptom.length}/1200</span>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            variant="moss"
            size="xl"
            disabled={!canSubmit}
            className="w-full sm:w-auto"
          >
            {stage === "analyzing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Diagnosing…
              </>
            ) : stage === "ready" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Ready
              </>
            ) : (
              <>
                Diagnose the item
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <div className="text-[12px] text-stone">
            Photo stays on-device until you submit. No account needed.
          </div>
        </div>
      </div>
    </form>
  );
}

function CornerMarks() {
  return (
    <>
      <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-ink/35" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-ink/35" />
      <span className="absolute left-3 bottom-3 h-4 w-4 border-l border-b border-ink/35" />
      <span className="absolute right-3 bottom-3 h-4 w-4 border-r border-b border-ink/35" />
    </>
  );
}
