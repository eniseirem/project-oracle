"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { TopBar } from "@/components/ui/TopBar";
import { Expandable } from "@/components/ui/Expandable";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";

export default function CharacterPage() {
  const router = useRouter();
  const { data, loading, error } = usePlayerState();

  useEffect(() => {
    if (error === "NOT_JOINED" || error === "PLAYER NOT FOUND") router.push("/join");
  }, [error, router]);

  if (loading && !data) return null;
  if (!data || !data.character) return null;

  const c = data.character;

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />
      <TopBar title="My Character" phase={data.game.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-4">
        <div className="text-center mb-2">
          <h1 className="font-display text-2xl uppercase tracking-wide text-oracle-text">
            {c.name}
          </h1>
          <p className="text-oracle-textFaint text-[11px] uppercase tracking-widest mt-1">
            {c.tier} SUBJECT
          </p>
          <p className="text-oracle-amber text-[11px] uppercase tracking-widest mt-2">
            Costume: {c.costumeSuggestion}
          </p>
          {c.accentColor && (
            <p className="text-oracle-textFaint text-[11px] uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: c.accentColor.hex }}
              />
              Accent: {c.accentColor.name}
            </p>
          )}
          <p className="text-oracle-textFaint text-[10px] mt-1">
            (optional — wear something close if you feel like it, don't worry if not)
          </p>
        </div>

        <Expandable title="Public Identity" defaultOpen>
          {c.publicBio}
        </Expandable>

        <Expandable title="Your Secret">{c.secret}</Expandable>

        <Expandable title="What You Know">{c.whatYouKnow}</Expandable>

        <Expandable title="People You Know">
          {c.relationships.length === 0
            ? "No known connections yet. Check back as the night continues."
            : c.relationships.map((r: any) => r.name).join("\n")}
        </Expandable>

        {c.phaseReveals.map((reveal: any, i: number) => (
          <Expandable key={i} title={reveal.title}>
            {reveal.locked
              ? `CLASSIFIED\nAVAILABLE DURING PHASE ${reveal.phase}`
              : reveal.content}
          </Expandable>
        ))}
      </div>
    </main>
  );
}
