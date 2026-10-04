"use client";

import { useState } from "react";

export function Expandable({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-oracle-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-oracle-panelAlt text-left"
      >
        <span className="font-display text-xs uppercase tracking-[0.18em] text-oracle-text">
          {title}
        </span>
        <span className="text-oracle-textDim text-sm">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm leading-relaxed text-oracle-text/90 animate-fadeIn whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}
