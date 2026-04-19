import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-bone hover:bg-moss active:scale-[0.98] shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_10px_24px_-12px_rgba(17,23,20,0.35)]",
        moss:
          "bg-moss text-bone hover:bg-forest active:scale-[0.98] shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_10px_28px_-14px_rgba(14,42,29,0.55)]",
        outline:
          "border border-ink/15 bg-paper text-ink hover:bg-bone-100 hover:border-ink/25",
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        amber:
          "bg-amber text-paper hover:bg-rust active:scale-[0.98] shadow-[0_10px_24px_-12px_rgba(168,64,31,0.45)]",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-full",
        md: "h-11 px-5 text-[15px] rounded-full",
        lg: "h-12 px-6 text-base rounded-full",
        xl: "h-14 px-8 text-[17px] rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
