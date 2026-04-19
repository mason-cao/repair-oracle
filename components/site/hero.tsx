export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-20 sm:pt-28 pb-20 sm:pb-28">
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        <div className="col-span-12 md:col-span-8 rise">
          <div className="mono text-[11px] tracking-[0.02em] text-ink-3">
            A project for Earth Day, 2026
          </div>
          <h1 className="t-display mt-5 text-ink">
            A diagnostic
            <br />
            for broken things.
          </h1>
          <p className="mt-7 max-w-[52ch] t-body text-ink-2">
            Photograph the object. Describe the failure. In a few seconds
            you get a verdict — repair, salvage, recycle, or replace —
            with the steps, parts, cost, and the landfill you skip.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <a
              href="#diagnose"
              className="inline-flex items-center gap-2 bg-ink px-5 h-12 text-[15px] font-medium text-bg transition-colors hover:bg-forest cursor-pointer"
            >
              Begin diagnosis <span aria-hidden>→</span>
            </a>
            <a
              href="#log"
              className="inline-flex items-center gap-1.5 text-[15px] text-ink-2 underline-offset-4 hover:text-ink hover:underline decoration-1 transition-colors"
            >
              Read the log
            </a>
          </div>
        </div>

        <aside className="col-span-12 md:col-span-4 md:border-l md:border-rule md:pl-8 md:pt-1">
          <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
            Contents
          </div>
          <ol className="mt-4 space-y-3">
            <IndexItem n="01" label="Scan" note="upload a photograph" />
            <IndexItem n="02" label="Diagnose" note="match failure mode" />
            <IndexItem n="03" label="Verdict" note="repair · salvage · recycle · replace" />
            <IndexItem n="04" label="Log" note="track landfill diverted" />
          </ol>
        </aside>
      </div>
    </section>
  );
}

function IndexItem({
  n,
  label,
  note,
}: {
  n: string;
  label: string;
  note: string;
}) {
  return (
    <li className="flex items-baseline gap-4">
      <span className="mono text-[11px] text-ink-3 w-6 shrink-0">{n}</span>
      <div className="flex-1">
        <div className="text-[15px] font-medium text-ink">{label}</div>
        <div className="t-small text-ink-3 mt-0.5">{note}</div>
      </div>
    </li>
  );
}
