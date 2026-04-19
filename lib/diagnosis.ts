import { z } from "zod";

export const CATEGORIES = [
  { id: "small-appliance", label: "Small appliance", hint: "Kettle, toaster, blender, vacuum" },
  { id: "electronics", label: "Electronics", hint: "Phone, laptop, headphones, charger" },
  { id: "furniture", label: "Furniture", hint: "Chair, table, shelf, drawer" },
  { id: "clothing-textile", label: "Clothing & textile", hint: "Jacket, shoes, bag, upholstery" },
  { id: "kitchenware", label: "Kitchenware", hint: "Cookware, ceramics, utensils" },
  { id: "tools", label: "Tools & outdoor", hint: "Power tools, bike, garden gear" },
  { id: "toys-hobby", label: "Toys & hobby", hint: "Toys, instruments, sports gear" },
  { id: "lighting", label: "Lighting", hint: "Lamp, fixture, bulb assembly" },
  { id: "other", label: "Other", hint: "Something else broken" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const VERDICTS = ["repair", "salvage", "recycle", "replace"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const VERDICT_META: Record<
  Verdict,
  { label: string; tagline: string; tone: string; hex: string }
> = {
  repair: {
    label: "Repair it",
    tagline: "This has a strong second life ahead.",
    tone: "text-[color:var(--color-verdict-repair)]",
    hex: "#3f6b4c",
  },
  salvage: {
    label: "Salvage for parts",
    tagline: "The whole is done — the pieces are not.",
    tone: "text-[color:var(--color-verdict-salvage)]",
    hex: "#c97d2a",
  },
  recycle: {
    label: "Recycle responsibly",
    tagline: "Divert from landfill — here's the right path.",
    tone: "text-[color:var(--color-verdict-recycle)]",
    hex: "#4a6b8a",
  },
  replace: {
    label: "Replace thoughtfully",
    tagline: "Repair isn't worth it — but choose wisely.",
    tone: "text-[color:var(--color-verdict-replace)]",
    hex: "#a8401f",
  },
};

export const DiagnosisSchema = z.object({
  itemName: z
    .string()
    .describe("Short name of the item identified in the photo, e.g. 'Breville electric kettle'"),
  observed: z
    .string()
    .describe(
      "One or two sentences describing what is visibly wrong or suspected to be wrong, grounded in the photo."
    ),
  verdict: z.enum(VERDICTS).describe("Primary recommendation"),
  verdictReason: z
    .string()
    .describe(
      "Two to three sentences explaining why this verdict — balancing cost, difficulty, safety, and environmental impact."
    ),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 confidence score in the diagnosis"),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced", "pro-only"])
    .describe("Skill level required to attempt the repair"),
  estRepairCostUsd: z
    .number()
    .describe("Estimated parts+time cost to repair (USD)"),
  estReplacementCostUsd: z
    .number()
    .describe("Estimated cost to buy a comparable replacement (USD)"),
  timeEstimateMinutes: z
    .number()
    .describe("Approximate repair time in minutes"),
  safetyWarnings: z
    .array(z.string())
    .describe(
      "Short safety callouts relevant to the repair, e.g. 'Unplug and discharge capacitors'."
    ),
  repairSteps: z
    .array(
      z.object({
        title: z.string().describe("Imperative title for the step"),
        detail: z.string().describe("Concise how-to sentence"),
      })
    )
    .describe("Ordered repair steps. 3-7 steps ideal."),
  parts: z
    .array(
      z.object({
        name: z.string(),
        note: z.string().describe("Why needed / where to source"),
      })
    )
    .describe("Parts to source"),
  tools: z.array(z.string()).describe("Tools needed"),
  environmentalImpact: z.object({
    co2SavedKg: z
      .number()
      .describe("Estimated kg CO2e avoided vs replacement manufacture"),
    landfillDivertedKg: z
      .number()
      .describe("Estimated kg of material kept out of landfill"),
    note: z
      .string()
      .describe("One-sentence human-readable note explaining the estimate"),
  }),
  alternativeAction: z
    .object({
      title: z.string(),
      detail: z.string(),
    })
    .describe(
      "A secondary path (e.g. 'If repair fails, salvage the heating element and copper wiring')."
    ),
  disposalGuidance: z
    .string()
    .describe(
      "If recycling or disposing, specific guidance (e.g. e-waste drop-off, battery removal)."
    ),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export function verdictChipClass(v: Verdict): string {
  switch (v) {
    case "repair":
      return "bg-[color:var(--color-verdict-repair)]/10 text-[color:var(--color-verdict-repair)] border-[color:var(--color-verdict-repair)]/25";
    case "salvage":
      return "bg-[color:var(--color-verdict-salvage)]/10 text-[color:var(--color-verdict-salvage)] border-[color:var(--color-verdict-salvage)]/25";
    case "recycle":
      return "bg-[color:var(--color-verdict-recycle)]/10 text-[color:var(--color-verdict-recycle)] border-[color:var(--color-verdict-recycle)]/25";
    case "replace":
      return "bg-[color:var(--color-verdict-replace)]/10 text-[color:var(--color-verdict-replace)] border-[color:var(--color-verdict-replace)]/25";
  }
}
