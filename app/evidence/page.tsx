"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { TopBar } from "@/components/ui/TopBar";
import { Panel } from "@/components/ui/Panel";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { getPlayerId } from "@/lib/client/session";

const STATUS_LABEL: Record<string, string> = {
  LOCKED: "LOCKED",
  AVAILABLE: "AVAILABLE",
  RELEASED: "PUBLIC",
  DISCOVERED: "DISCOVERED",
};

export default function EvidencePage() {
  const router = useRouter();
  const { data, loading, error } = usePlayerState();

  useEffect(() => {
    if (error === "NOT_JOINED" || error === "PLAYER NOT FOUND") router.push("/join");
  }, [error, router]);

  useEffect(() => {
    const playerId = getPlayerId();
    if (!playerId) return;
    fetch("/api/seen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
  }, []);

  if (loading && !data) return null;
  if (!data) return null;

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="Evidence" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-3">
        {data.evidence.map((e: any) => (
          <Panel key={e.id} className={e.locked ? "opacity-60" : ""}>
            <div className="flex items-center justify-between">
              <span className="font-display text-xs uppercase tracking-widest text-oracle-textDim">
                EVIDENCE #{e.id}
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                  e.locked
                    ? "border-oracle-border text-oracle-textFaint"
                    : "border-oracle-amber text-oracle-amber"
                }`}
              >
                {STATUS_LABEL[e.status]}
              </span>
            </div>
            {e.locked ? (
              <p className="mt-2 font-display text-sm uppercase tracking-wide text-oracle-textFaint">
                LOCKED
              </p>
            ) : (
              <>
                <h3 className="mt-2 font-display text-sm uppercase tracking-wide text-oracle-text">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm text-oracle-text/90 whitespace-pre-line">
                  {e.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-widest text-oracle-textFaint">
                  <span>{e.visibility}</span>
                  {e.authenticity && <span>AUTHENTICITY: {e.authenticity}</span>}
                </div>
              </>
            )}
          </Panel>
        ))}
      </div>
    </main>
  );
}
