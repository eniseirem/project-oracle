import { HTMLAttributes } from "react";

export function Panel({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-oracle-panel border border-oracle-border rounded-sm p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim">
        {children}
      </span>
    </div>
  );
}
