# Repair Oracle

> Before you throw it away, ask the Oracle.

Repair Oracle is an AI-powered repair diagnosis web app for broken household
items. Snap a photo, tell it what's wrong, and get back a structured
field-guide: repair it, salvage it, recycle it, or (last resort) replace it —
with steps, parts, tools, cost vs. replacement, and the landfill you just
diverted.

Built for Earth Day 2026.

## What it does

1. **Photo-grounded** — Gemini 2.5 Vision reads the actual item, not a generic
   search. It identifies what you uploaded, looks for the failure, and lowers
   its own confidence when the image is unclear.
2. **Structured verdict** — Every diagnosis returns the same machine-readable
   shape (verdict, confidence, steps, parts, tools, cost, CO₂, landfill
   diverted, disposal guidance). No hand-wavy chatbot output.
3. **Safety-first** — Pro-only jobs (mains wiring, lithium cells, gas,
   pressurized systems) are flagged explicitly.
4. **Repair log** — Diagnoses are saved on-device. Your running totals of
   kg CO₂e avoided and kg kept out of landfill show at a glance.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- Vercel AI SDK v6 + `@ai-sdk/google` (Gemini 2.5 Flash vision)
- Zod structured output
- framer-motion + lucide-react
- localStorage for the repair log (no backend, no account)

## Getting started

```bash
# 1. install
npm install

# 2. add your Gemini API key
cp .env.example .env.local
# open .env.local and paste your Google Generative AI key

# 3. run the dev server
npm run dev
```

Then open <http://localhost:3000> and try diagnosing a broken kettle, a torn
backpack, or a lamp that flickers.

## Environment

```
GOOGLE_GENERATIVE_AI_API_KEY=...
```

Get one at <https://aistudio.google.com/app/apikey>.

## Project layout

```
app/
  page.tsx                       # landing + diagnosis shell
  api/diagnose/route.ts          # image + symptom -> structured diagnosis
  layout.tsx, globals.css        # fonts, palette, paper-grain backdrop

components/
  brand/logo.tsx                 # wordmark + mark
  site/                          # nav, hero, how-it-works, earth-day, footer
  diagnose/
    upload-form.tsx              # dropzone + form + analyzing state
    report.tsx                   # verdict card, steps, parts, impact
    repair-log.tsx               # history list with running totals
    diagnose-shell.tsx           # wraps upload/report state machine
  ui/                            # button, card, input, badge

lib/
  diagnosis.ts                   # zod schema + category/verdict metadata
  history.ts                     # localStorage persistence + image downscale
  utils.ts                       # cn(), formatCurrency
```

## License

MIT.
