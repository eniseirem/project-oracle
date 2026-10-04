"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
}

const base =
  "font-display font-semibold uppercase tracking-wide text-sm px-5 py-4 rounded-sm border transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-oracle-red/90 border-oracle-red text-white hover:bg-oracle-red",
  secondary: "bg-oracle-panel border-oracle-border text-oracle-text hover:border-oracle-text/40",
  danger: "bg-transparent border-oracle-red text-oracle-redBright hover:bg-oracle-red/10",
  ghost: "bg-transparent border-transparent text-oracle-textDim hover:text-oracle-text",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "secondary", full, className = "", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});
