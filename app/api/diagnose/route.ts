import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { CATEGORIES, DiagnosisSchema } from "@/lib/diagnosis";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Repair Oracle — a seasoned repair technician and sustainability steward.
Given a photo of a broken household item plus the owner's description, produce a realistic, actionable diagnosis.

Rules:
- Be grounded in what the photo actually shows. If the image is unclear, lower your confidence and say so in "observed".
- Your four possible verdicts are: "repair", "salvage", "recycle", "replace".
  * repair: achievable DIY or modest pro fix that is worth the cost and effort.
  * salvage: item is past whole-product repair, but components (motor, screen, fabric, wood, metal) are worth harvesting.
  * recycle: item is not worth repairing or salvaging but must not go to landfill; route to the correct recycling stream.
  * replace: repair cost or safety risk clearly exceeds sensible thresholds; give responsible disposal guidance anyway.
- Prefer "repair" when it is plausibly safe, affordable (repair cost < ~60% of replacement), and within an intermediate DIYer's reach.
- Never recommend dangerous DIY work (mains wiring, gas, pressurized systems, lithium battery cell replacement) without a pro-only warning.
- Costs are in USD, realistic for a US consumer. Time is in minutes.
- CO2 and landfill diverted estimates should be honest order-of-magnitude numbers for this class of item, not invented precision. Use whole numbers or one decimal.
- Repair steps must be specific enough to actually follow. No filler. 3-7 steps.
- Keep tone calm, specific, and field-guide dry. No hype, no emoji, no carbon-moralizing.
- Safety warnings are terse and imperative ("Unplug before opening").
- If the photo clearly isn't of a broken item or is unrelated, still produce a best-effort diagnosis and drop confidence toward 10-25.`;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const image = form.get("image");
    const category = String(form.get("category") || "other");
    const symptom = String(form.get("symptom") || "").slice(0, 2000);
    const itemHint = String(form.get("itemHint") || "").slice(0, 200);

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Missing image upload." },
        { status: 400 }
      );
    }
    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 8MB." },
        { status: 400 }
      );
    }
    if (!symptom || symptom.length < 4) {
      return NextResponse.json(
        { error: "Describe the symptom in at least a few words." },
        { status: 400 }
      );
    }

    const categoryMeta = CATEGORIES.find((c) => c.id === category);

    const bytes = Buffer.from(await image.arrayBuffer());

    const userText = [
      `Category: ${categoryMeta?.label ?? "Other"}`,
      itemHint ? `Owner says this is: ${itemHint}` : null,
      `Symptom: ${symptom}`,
      `Return a structured diagnosis following the schema.`,
    ]
      .filter(Boolean)
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: DiagnosisSchema,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            {
              type: "image",
              image: bytes,
              mediaType: image.type || "image/jpeg",
            },
          ],
        },
      ],
      temperature: 0.4,
    });

    return NextResponse.json({ diagnosis: object });
  } catch (err) {
    console.error("[diagnose] failed", err);
    const message =
      err instanceof Error ? err.message : "Unknown diagnosis error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
