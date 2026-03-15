import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "primary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
        {
          "bg-white/5 text-foreground": variant === "default",
          "glass-panel text-foreground border border-white/10": variant === "outline",
          "bg-primary/20 text-primary border border-primary/20": variant === "primary",
        },
        className
      )}
      {...props}
    />
  );
}
