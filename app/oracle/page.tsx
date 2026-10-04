"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { TopBar } from "@/components/ui/TopBar";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { getPlayerId } from "@/lib/client/session";

export default function OraclePage() {
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

  const messages = [...data.messages].reverse();

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="Oracle" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-oracle-textDim text-sm text-center pt-10">
            ORACLE has not spoken to you yet.
          </p>
        )}
        {messages.map((m: any) => (
          <div key={m.id} className="border-l-2 border-oracle-red pl-4 animate-fadeIn">
            <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest">
              ORACLE // {m.type === "PRIVATE" ? "PRIVATE MESSAGE" : m.timestamp}
            </p>
            <p className="mt-1 font-mono text-sm text-oracle-text whitespace-pre-line leading-relaxed">
              {m.content}
            </p>
            {m.confidence && (
              <p className="mt-1 text-[11px] text-oracle-amber uppercase tracking-widest">
                CONFIDENCE: {m.confidence}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
