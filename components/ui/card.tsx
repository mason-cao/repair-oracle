import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { framed?: boolean }
>(({ className, framed = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md bg-bg-raised",
      framed
        ? "border border-rule-strong shadow-[0_18px_60px_rgba(16,23,20,0.08)]"
        : "border border-rule",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pt-5 pb-3", className)} {...props} />
);

export const CardBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pb-6 pt-1", className)} {...props} />
);
