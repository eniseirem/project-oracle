"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { TopBar } from "@/components/ui/TopBar";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { getPlayerId } from "@/lib/client/session";

export default function ObjectivesPage() {
  const router = useRouter();
  const { data, loading, error, refresh } = usePlayerState();

  useEffect(() => {
    if (error === "NOT_JOINED" || error === "PLAYER NOT FOUND") router.push("/join");
  }, [error, router]);

  if (loading && !data) return null;
  if (!data || !data.character) return null;

  const completions: any[] = data.player.objectiveCompletions ?? [];

  async function claim(characterId: string, type: string, text: string) {
    const playerId = getPlayerId();
    if (!playerId) return;
    await fetch("/api/objective", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, characterId, type, objectiveKey: text }),
    });
    refresh();
  }

  const groups: { type: string; color: string; label: string }[] = [
    { type: "PRIMARY", color: "text-oracle-red", label: "PRIMARY" },
    { type: "SECRET", color: "text-oracle-amber", label: "SECRET" },
    { type: "SOCIAL", color: "text-oracle-textDim", label: "SOCIAL" },
    { type: "BONUS", color: "text-oracle-textFaint", label: "BONUS (JUST FOR FUN)" },
  ];

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="Objectives" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-4">
        <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest text-center">
          claim one the moment you've actually done it — earlier claims are worth more.
          secret &amp; primary pay best. you can't unclaim once you do.
        </p>

        {groups.map((g) => {
          const obj = data.character.objectives.find((o: any) => o.type === g.type);
          if (!obj) return null;
          const objectiveKey = `${data.character.id}:${g.type}`;
          const claimed = completions.find((c) => c.objectiveKey === objectiveKey);
          const done = !!claimed;
          const revoked = !!claimed?.revoked;
          return (
            <Panel key={g.type}>
              <PanelHeader>
                <span className={g.color}>{g.label}</span>
              </PanelHeader>
              <button
                onClick={() => !done && claim(data.character.id, g.type, obj.text)}
                disabled={done}
                className="w-full flex items-start gap-3 text-left disabled:cursor-default"
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm border flex items-center justify-center text-xs ${
                    done
                      ? "bg-oracle-red border-oracle-red text-white"
                      : "border-oracle-border text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm leading-relaxed ${
                    done ? "text-oracle-textFaint line-through" : "text-oracle-text"
                  }`}
                >
                  {obj.text}
                </span>
              </button>
              {done && (
                <p className="mt-2 text-[10px] uppercase tracking-widest text-oracle-amber">
                  {revoked
                    ? "CLAIMED, BUT REVOKED BY YOUR HOST"
                    : `CLAIMED — +${claimed.points} PTS (PHASE ${claimed.phaseCompleted})`}
                </p>
              )}
            </Panel>
          );
        })}
        <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest text-center pt-2">
          your host can see every claim, and can revoke one if it wasn't real.
          final standings are revealed at the very end, by name.
        </p>
      </div>
    </main>
  );
}
