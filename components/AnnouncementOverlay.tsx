"use client";

import { useEffect, useState } from "react";
import type { DisplayAnnouncement } from "@/lib/types";

export function AnnouncementOverlay({
  announcement,
  dismissible = true,
}: {
  announcement: DisplayAnnouncement | null;
  dismissible?: boolean;
}) {
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("oracle_dismissed_announcement");
      if (stored) setDismissedId(stored);
    } catch {
      // ignore
    }
  }, []);

  if (!announcement || announcement.id === dismissedId) return null;

  const isMurder = announcement.kind === "MURDER";

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center px-6 text-center glitch-on-mount">
      <div className="absolute inset-0 scanline-sweep opacity-60" aria-hidden="true" />
      <p
        className={`font-display uppercase tracking-[0.3em] text-xs mb-6 ${
          isMurder ? "text-oracle-redBright" : "text-oracle-amber"
        }`}
      >
        {isMurder ? "⚠ SYSTEM ALERT" : "ORACLE TRANSMISSION"}
      </p>
      <h2 className="font-display font-extrabold text-2xl sm:text-4xl uppercase tracking-wide text-white mb-4">
        {announcement.heading}
      </h2>
      <div className="space-y-2 max-w-sm">
        {announcement.lines.map((line, i) => (
          <p
            key={i}
            className="font-mono text-sm sm:text-lg uppercase tracking-wider text-oracle-text"
          >
            {line}
          </p>
        ))}
      </div>
      {dismissible && (
        <button
          onClick={() => {
            setDismissedId(announcement.id);
            try {
              window.sessionStorage.setItem("oracle_dismissed_announcement", announcement.id);
            } catch {
              // ignore
            }
          }}
          className="mt-10 font-display text-xs uppercase tracking-[0.2em] border border-oracle-border px-6 py-3 text-oracle-textDim hover:text-oracle-text hover:border-oracle-text/40"
        >
          ACKNOWLEDGE
        </button>
      )}
    </div>
  );
}
