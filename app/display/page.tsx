"use client";

import { useDisplayState } from "@/lib/client/useOracleState";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { OracleBrand } from "@/components/ui/OracleBrand";
import { phaseLabel } from "@/lib/data/phases";

export default function DisplayPage() {
  const data = useDisplayState();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-oracle-textFaint uppercase tracking-widest text-sm">
          Connecting to ORACLE…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-6">
      <AnnouncementOverlay announcement={data.activeAnnouncement} dismissible={false} />

      <div className="text-center">
        <OracleBrand size="lg" />
        <p className="mt-6 font-display uppercase tracking-[0.3em] text-oracle-amber text-lg sm:text-2xl">
          {phaseLabel(data.currentPhase)}
        </p>
        {data.status === "PAUSED" && (
          <p className="mt-4 text-oracle-redBright uppercase tracking-widest text-sm animate-blink">
            SYSTEM PAUSED
          </p>
        )}
        {data.votingOpen && (
          <p className="mt-6 text-oracle-text uppercase tracking-widest text-sm border border-oracle-border inline-block px-4 py-2 rounded-sm">
            FINAL ASSESSMENT IN PROGRESS
          </p>
        )}
      </div>
    </main>
  );
}
