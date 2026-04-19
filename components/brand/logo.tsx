import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8" />
      <div className="leading-none">
        <div className="serif text-[22px] leading-none text-ink">
          Repair Oracle
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-stone mt-1">
          Field Diagnostics
        </div>
      </div>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="20" cy="20" r="19" stroke="#1f3b2d" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="13" stroke="#1f3b2d" strokeWidth="0.8" strokeDasharray="2 3" />
      <path
        d="M20 6 C 26 12, 26 28, 20 34 C 14 28, 14 12, 20 6 Z"
        fill="#3f6b4c"
        opacity="0.9"
      />
      <path
        d="M20 6 C 26 12, 26 28, 20 34"
        stroke="#0e2a1d"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="20" cy="20" r="2" fill="#c97d2a" />
    </svg>
  );
}
