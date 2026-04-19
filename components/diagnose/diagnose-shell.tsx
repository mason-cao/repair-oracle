"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadForm } from "./upload-form";
import { Report } from "./report";
import type { Diagnosis, CategoryId } from "@/lib/diagnosis";
import { downscaleImage, saveHistory } from "@/lib/history";

export function DiagnoseShell({
  onNewEntry,
}: {
  onNewEntry: () => void;
}) {
  const [result, setResult] = React.useState<{
    diagnosis: Diagnosis;
    image: string;
    category: CategoryId;
    symptom: string;
  } | null>(null);

  React.useEffect(() => {
    if (!result) return;
    const reportEl = document.getElementById("diagnose");
    reportEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  async function handleResult(r: {
    diagnosis: Diagnosis;
    image: string;
    category: CategoryId;
    symptom: string;
  }) {
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
      // non-fatal
    }
  }

  return (
    <section
      id="diagnose"
      className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 scroll-mt-24"
    >
      <div className="rounded-[32px] border border-ink/10 bg-paper p-6 shadow-[0_40px_80px_-40px_rgba(17,23,20,0.28)] md:p-10">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Report
                diagnosis={result.diagnosis}
                image={result.image}
                category={result.category}
                symptom={result.symptom}
                onReset={() => setResult(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 flex flex-col gap-2">
                <div className="mono text-[11px] uppercase tracking-[0.22em] text-stone">
                  Diagnosis kit
                </div>
                <h2 className="serif text-4xl leading-tight text-ink md:text-5xl">
                  Bring the broken thing.
                </h2>
                <p className="max-w-xl text-[15px] text-ink-soft">
                  Upload a photo, pick a category, and describe the symptom.
                  The Oracle returns a structured repair report in about ten
                  seconds.
                </p>
              </div>
              <UploadForm onResult={handleResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
