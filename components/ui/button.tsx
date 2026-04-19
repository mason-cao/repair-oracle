import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
  {
    variants: {
      variant: {
        primary:
          "bg-forest text-forest-ink hover:bg-ink",
        secondary:
          "bg-transparent text-ink border border-rule-strong hover:border-ink",
        ghost:
          "bg-transparent text-ink hover:bg-ink/5",
        link:
          "bg-transparent text-ink px-0 hover:underline underline-offset-4 decoration-1",
        /* Legacy aliases — kept through staged refactor, dropped at cleanup */
        outline:
          "bg-transparent text-ink border border-rule-strong hover:border-ink",
        moss:
          "bg-forest text-forest-ink hover:bg-ink",
        amber:
          "bg-amber text-bg hover:bg-ink",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-[15px]",
        xl: "h-12 px-5 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      { variant: "link", size: "sm", className: "h-auto" },
      { variant: "link", size: "md", className: "h-auto" },
      { variant: "link", size: "lg", className: "h-auto" },
    ],
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
