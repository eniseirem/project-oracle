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

  const completed: string[] = data.player.completedObjectives;

  async function toggle(text: string) {
    const playerId = getPlayerId();
    if (!playerId) return;
    await fetch("/api/objective", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, objectiveKey: text }),
    });
    refresh();
  }

  const groups: { type: string; color: string }[] = [
    { type: "PRIMARY", color: "text-oracle-red" },
    { type: "SECRET", color: "text-oracle-amber" },
    { type: "SOCIAL", color: "text-oracle-textDim" },
  ];

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="Objectives" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-4">
        {groups.map((g) => {
          const obj = data.character.objectives.find((o: any) => o.type === g.type);
          if (!obj) return null;
          const done = completed.includes(obj.text);
          return (
            <Panel key={g.type}>
              <PanelHeader>
                <span className={g.color}>{g.type}</span>
              </PanelHeader>
              <button
                onClick={() => toggle(obj.text)}
                className="w-full flex items-start gap-3 text-left"
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
            </Panel>
          );
        })}
        <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest text-center pt-2">
          checking these off is just for you — it has no effect on the game
        </p>
      </div>
    </main>
  );
}
