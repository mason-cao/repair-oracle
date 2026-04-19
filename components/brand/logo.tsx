import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-4 w-4" />
      <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">
        Repair Oracle
      </span>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="8" cy="8" r="7" strokeWidth="1.25" />
      <path d="M4.5 9.5 L7 12 L11.5 5" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}
