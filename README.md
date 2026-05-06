# Repair Oracle

> Before you throw it away, ask the Oracle.

Repair Oracle is an AI-powered repair diagnosis web app for broken household
items. Upload a photo, describe the failure, and receive a structured field
guide: repair it, salvage it, recycle it, or replace it only as a last resort.
Each verdict includes repair steps, parts, tools, safety flags, cost vs.
replacement, CO2e avoided, and landfill material diverted.

Built for an Earth Day 2026 hackathon.

[Video Demo](https://youtu.be/yPyhUS4Dd4g)
## Earth Day Criteria

- **Repair-first impact:** The model is instructed to prefer repair when it is
  safe, affordable, and realistic.
- **Waste diversion:** Every result estimates CO2e avoided and material kept out
  of landfill.
- **Responsible fallback:** Salvage and recycling routes name material streams
  such as e-waste, battery, textile, metal, wood, glass, ceramic, or plastic.
- **Safety-aware guidance:** Hazardous work such as mains wiring, gas,
  pressurized systems, or lithium cell repair is flagged as pro-only.
- **Low-friction behavior change:** No account is required; the repair log stays
  on-device through `localStorage`.
- **Gemini usage:** Gemini 2.5 Flash reads the uploaded image and produces a
  Zod-validated diagnosis object.

## Features

1. **Photo-grounded diagnosis** - Gemini vision reads the actual item and lowers
   confidence when the image is unclear.
2. **Structured verdicts** - Every response follows the same schema for verdict,
   confidence, steps, parts, tools, costs, safety, disposal, and impact.
3. **Clear demo UI** - Glassmorphism cards keep the interface refined while
   preserving contrast for judges and projector screens.
4. **Local impact ledger** - Diagnoses are saved on-device with running totals
   for kg CO2e avoided and kg diverted from landfill.

## Stack

- Next.js 16 App Router with Turbopack
- React 19
- Tailwind CSS 4
- Vercel AI SDK v6 and `@ai-sdk/google`
- Gemini 2.5 Flash vision
- Zod structured output
- framer-motion and lucide-react
- `localStorage` for the repair log

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your Google Generative AI key to `.env.local`:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

Get a key from <https://aistudio.google.com/app/apikey>.

Start the demo server:

```bash
npm run dev
```

Open <http://localhost:3000>.

## Verification

Use these commands before a demo or handoff:

```bash
npm run lint
npm run build
```

The `/api/diagnose` route requires `GOOGLE_GENERATIVE_AI_API_KEY`. The page will
load without the key, but image diagnosis needs it.

## Project Layout

```text
app/
  page.tsx                       # Main experience
  api/diagnose/route.ts          # Image + symptom -> structured diagnosis
  layout.tsx                     # Fonts and metadata
  globals.css                    # Theme, glass surfaces, responsive type

components/
  brand/logo.tsx                 # Wordmark and mark
  site/                          # Masthead, hero, criteria, footer
  diagnose/
    upload-form.tsx              # Dropzone, form, analyzing state
    report.tsx                   # Verdict dossier, steps, parts, impact
    repair-log.tsx               # Local history and running totals
    diagnose-shell.tsx           # Upload/report state machine
  ui/                            # Button, card, input, badge primitives

lib/
  diagnosis.ts                   # Zod schema and verdict metadata
  history.ts                     # localStorage persistence and image downscale
  utils.ts                       # cn(), formatCurrency()
```

## Notes

- Diagnosis output is AI guidance, not a substitute for a qualified repair
  professional.
- Cost, CO2e, and landfill estimates are intentionally order-of-magnitude
  numbers for demo use.
- The app stores diagnosis history only in the current browser.

## License

MIT.
