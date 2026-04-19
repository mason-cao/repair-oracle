"use client";

import * as React from "react";
import { UploadForm } from "./upload-form";
import { Report } from "./report";
import type { Diagnosis, CategoryId } from "@/lib/diagnosis";
import { downscaleImage, saveHistory } from "@/lib/history";

type Result = {
  diagnosis: Diagnosis;
  image: string;
  category: CategoryId;
  symptom: string;
};

export function DiagnoseShell({ onNewEntry }: { onNewEntry: () => void }) {
  const [result, setResult] = React.useState<Result | null>(null);

  React.useEffect(() => {
    if (!result) return;
    document.getElementById("diagnose")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  async function handleResult(r: Result) {
    setResult(r);
    try {
      const thumb = await downscaleImage(r.image);
      saveHistory({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        image: thumb,
        category: r.category,
        symptom: r.symptom,
        diagnosis: r.diagnosis,
      });
      onNewEntry();
    } catch {
      /* non-fatal */
    }
  }

  const state: "IDLE" | "READY" = result ? "READY" : "IDLE";

  return (
    <section
      id="diagnose"
      aria-labelledby="diagnose-heading"
      className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-16 sm:pt-24 pb-4 scroll-mt-20"
    >
      <div className="rule-t pt-10">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <div className="mono text-[11px] tracking-[0.02em] text-ink-3">
              <span className="text-ink-2">§ 01</span> · Begin
            </div>
            <h2 id="diagnose-heading" className="t-h1 mt-3 text-ink">
              {result ? "The verdict." : "Bring the broken thing."}
            </h2>
          </div>
          <span className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3 shrink-0">
            {state}
          </span>
        </div>

        <div className="mt-10 rise" key={result ? "report" : "upload"}>
          {result ? (
            <Report
              diagnosis={result.diagnosis}
              image={result.image}
              category={result.category}
              symptom={result.symptom}
              onReset={() => setResult(null)}
            />
          ) : (
            <UploadForm onResult={handleResult} />
          )}
        </div>
      </div>
    </section>
  );
}
