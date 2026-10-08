import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variant === "default"
          ? "bg-brass text-espresso hover:bg-brassLight"
          : "border border-walnut/60 text-linen hover:border-brass/60 hover:bg-walnut/30",
        className
      )}
      {...props}
    />
  );
}
