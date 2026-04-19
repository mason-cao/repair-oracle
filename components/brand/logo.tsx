import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-8 w-8 text-forest" />
      <div className="leading-none">
        <span className="block text-[15px] font-semibold text-ink">
          Repair Oracle
        </span>
        <span className="mt-1 hidden text-[11px] text-ink-3 sm:block">
          Earth Day diagnostic
        </span>
      </div>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10.2 17.6c5.8-.2 8.9-3.1 9.6-8.4 3.1 3.2 3.1 8.6 0 11.8-3 3.2-8.1 3.6-11.5 1.1 2.2-.4 4.1-1.3 5.7-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 23.2 24 10.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
