"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { TopBar } from "@/components/ui/TopBar";
import { Panel } from "@/components/ui/Panel";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";

export default function PeoplePage() {
  const router = useRouter();
  const { data, loading, error } = usePlayerState();

  useEffect(() => {
    if (error === "NOT_JOINED" || error === "PLAYER NOT FOUND") router.push("/join");
  }, [error, router]);

  if (loading && !data) return null;
  if (!data) return null;

  if (!data.character) {
    return (
      <main className="min-h-screen pb-16">
        <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
        <TopBar title="People" phase={data.game.currentPhase} />
        <div className="max-w-md mx-auto px-6 pt-16 text-center">
          <p className="font-display text-sm uppercase tracking-widest text-oracle-text">
            Awaiting Assignment
          </p>
          <p className="mt-3 text-oracle-textFaint text-xs leading-relaxed">
            Known connections will show up here once your host assigns you a
            character.
          </p>
        </div>
      </main>
    );
  }

  const relationships = data.character.relationships;

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="People" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-3">
        {relationships.length === 0 && (
          <p className="text-oracle-textDim text-sm text-center pt-10">
            ORACLE has not revealed any connections yet.
            <br />
            Check back as the night continues.
          </p>
        )}
        {relationships.map((r: any) => (
          <Panel key={r.characterId}>
            <h3 className="font-display uppercase tracking-wide text-sm text-oracle-text">
              {r.name}
            </h3>
            <p className="text-oracle-amber text-xs mt-1">{r.label}</p>
            {r.note && <p className="text-oracle-textDim text-sm mt-2">{r.note}</p>}
          </Panel>
        ))}
      </div>
    </main>
  );
}
