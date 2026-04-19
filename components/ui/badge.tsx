import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "ink" | "forest" | "repair" | "salvage" | "recycle" | "replace" | "ghost";
};

const toneMap: Record<NonNullable<BadgeProps["tone"]>, string> = {
  ink: "bg-ink text-bg",
  forest: "bg-forest text-forest-ink",
  repair: "border border-v-repair text-v-repair",
  salvage: "border border-v-salvage text-v-salvage",
  recycle: "border border-v-recycle text-v-recycle",
  replace: "border border-v-replace text-v-replace",
  ghost: "border border-rule-strong text-ink-2",
};

export function Badge({ className, tone = "ghost", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10.5px] font-semibold uppercase",
        toneMap[tone],
        className
      )}
      {...props}
    />
  );
}
