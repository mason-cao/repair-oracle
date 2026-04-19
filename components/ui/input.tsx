import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "bordered" | "rule";
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "bordered", ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md text-[15px] text-ink placeholder:text-ink-3 focus:outline-none transition-colors duration-150",
        variant === "bordered" &&
          "h-11 border border-rule bg-bg-raised/75 px-3 shadow-[inset_0_1px_0_rgba(246,242,231,0.12)] focus:border-forest",
        variant === "rule" &&
          "h-11 rounded-none bg-transparent border-b border-rule-strong px-0 focus:border-forest",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "bordered" | "rule";
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "bordered", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md text-[15px] text-ink placeholder:text-ink-3 focus:outline-none resize-none transition-colors duration-150",
        variant === "bordered" &&
          "min-h-[112px] border border-rule bg-bg-raised/75 px-3 py-3 shadow-[inset_0_1px_0_rgba(246,242,231,0.12)] focus:border-forest",
        variant === "rule" &&
          "min-h-[112px] rounded-none bg-transparent border-b border-rule-strong px-0 py-2 focus:border-forest",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-xs font-semibold uppercase text-ink-3", className)}
    {...props}
  />
));
Label.displayName = "Label";
