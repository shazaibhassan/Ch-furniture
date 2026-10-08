import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-sm border border-walnut/60 bg-espresso px-3 py-2 text-sm text-linen outline-none placeholder:text-linenDim/60 focus:border-brass focus:ring-1 focus:ring-brass",
        className
      )}
      {...props}
    />
  );
}
