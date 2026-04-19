"use client";

import * as React from "react";
import { CheckCircle2, ImagePlus, ScanLine } from "lucide-react";
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

const STEPS = [
  { label: "Capture", icon: ImagePlus, target: "capture-bay" },
  { label: "Analyze", icon: ScanLine, target: "intake-profile" },
  { label: "Act", icon: CheckCircle2, target: "verdict-report" },
];

export function DiagnoseShell({ onNewEntry }: { onNewEntry: () => void }) {
  const [result, setResult] = React.useState<Result | null>(null);

  React.useEffect(() => {
    if (!result) return;
    document
      .getElementById("diagnose")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  function scrollToWorkspaceTarget(id: string) {
    const fallback = id === "verdict-report" && !result ? "intake-profile" : id;
    document
      .getElementById(fallback)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="diagnose"
      aria-labelledby="diagnose-heading"
      className="mx-auto w-full max-w-[1720px] scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16 xl:px-10"
    >
      <div className="grid gap-8 border-t border-rule pt-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <div>
          <div className="section-kicker">
            <ScanLine className="h-4 w-4" />
            Diagnosis workspace
          </div>
          <h2 id="diagnose-heading" className="t-h1 mt-4 text-ink">
            {result ? "Verdict ready." : "Bring one broken thing."}
          </h2>
          <p className="mt-4 max-w-[34rem] text-base leading-7 text-ink-2">
            {result
              ? "Review the recommendation, cost model, safety notes, and disposal path before deciding what happens next."
              : "Add a clear photo, choose the item family, and describe the failure. The output is structured for a repair table, not a chat transcript."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {STEPS.map(({ label, icon: Icon, target }, index) => {
            const active = result ? index === 2 : index === 0;
            const done = result && index < 2;
            return (
              <button
                type="button"
                key={label}
                onClick={() => scrollToWorkspaceTarget(target)}
                className={`surface-panel px-3 py-3 ${
                  active ? "border-forest bg-forest/20" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      done || active ? "text-forest" : "text-ink-3"
                    }`}
                  />
                  <span className="text-xs font-semibold text-ink-3">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-3 text-sm font-semibold text-ink">
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rise" key={result ? "report" : "upload"}>
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
    </section>
  );
}
