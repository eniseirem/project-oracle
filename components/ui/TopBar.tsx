"use client";

import Link from "next/link";
import { phaseLabel } from "@/lib/data/phases";

export function TopBar({
  title,
  backHref = "/game",
  phase,
}: {
  title: string;
  backHref?: string;
  phase?: number;
}) {
  return (
    <div className="sticky top-0 z-40 bg-oracle-bg/90 backdrop-blur-sm border-b border-oracle-border">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={backHref}
          className="text-oracle-textDim text-xs uppercase tracking-widest hover:text-oracle-text"
        >
          ‹ ORACLE
        </Link>
        <span className="font-display text-sm uppercase tracking-[0.15em] text-oracle-text">
          {title}
        </span>
        <span className="text-[10px] text-oracle-textFaint tabular-nums">
          {phase !== undefined ? phaseLabel(phase).split(" — ")[0] : ""}
        </span>
      </div>
    </div>
  );
}
