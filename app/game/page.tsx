"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlayerState } from "@/lib/client/useOracleState";
import { OracleBrand } from "@/components/ui/OracleBrand";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { phaseLabel } from "@/lib/data/phases";
import { clearPlayerId } from "@/lib/client/session";

const NAV = [
  { href: "/character", label: "My Character", key: null },
  { href: "/objectives", label: "Objectives", key: null },
  { href: "/people", label: "People", key: null },
  { href: "/evidence", label: "Evidence", key: "evidence" },
  { href: "/oracle", label: "Oracle", key: "oracle" },
];

export default function GamePage() {
  const router = useRouter();
  const { data, loading, error } = usePlayerState();

  useEffect(() => {
    if (error === "NOT_JOINED" || error === "PLAYER NOT FOUND") {
      router.push("/join");
    }
  }, [error, router]);

  if (loading && !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-oracle-textDim text-sm uppercase tracking-widest">Connecting…</p>
      </main>
    );
  }

  if (!data) return null;

  const votingUnlocked = data.game.currentPhase >= 9 || data.game.votingOpen;

  return (
    <main className="min-h-screen pb-16">
      <AnnouncementOverlay announcement={data.game.activeAnnouncement} />

      <div className="max-w-md mx-auto px-6 pt-10">
        <OracleBrand size="sm" />

        <div className="mt-6 text-center">
          <p className="text-oracle-textDim text-[11px] uppercase tracking-widest">
            {data.player.status === "ABSENT" ? "MARKED ABSENT" : "SUBJECT"}
          </p>
          <h2 className="font-display text-xl text-oracle-text uppercase tracking-wide mt-1">
            {data.character?.name ?? "UNASSIGNED"}
          </h2>
          <p className="mt-2 inline-block border border-oracle-border rounded-sm px-3 py-1 text-[11px] uppercase tracking-widest text-oracle-amber">
            {phaseLabel(data.game.currentPhase)}
          </p>
          {data.game.status === "PAUSED" && (
            <p className="mt-2 text-oracle-redBright text-[11px] uppercase tracking-widest">
              GAME PAUSED
            </p>
          )}
        </div>

        <div className="mt-10 space-y-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between w-full bg-oracle-panel border border-oracle-border rounded-sm px-5 py-4 hover:border-oracle-text/30 active:scale-[0.99]"
            >
              <span className="font-display uppercase tracking-wide text-sm text-oracle-text">
                {item.label}
              </span>
              {item.key && <Badge count={data.badges[item.key]} />}
            </Link>
          ))}

          {votingUnlocked && (
            <Link
              href="/vote"
              className="flex items-center justify-center w-full bg-oracle-red/90 border border-oracle-red rounded-sm px-5 py-4 active:scale-[0.99]"
            >
              <span className="font-display uppercase tracking-wide text-sm text-white">
                Final Accusation
              </span>
            </Link>
          )}

          {data.game.revealOpen && (
            <Link
              href="/leaderboard"
              className="flex items-center justify-center w-full bg-oracle-amber/90 border border-oracle-amber rounded-sm px-5 py-4 active:scale-[0.99]"
            >
              <span className="font-display uppercase tracking-wide text-sm text-black">
                Final Standings
              </span>
            </Link>
          )}
        </div>

        <button
          onClick={() => {
            clearPlayerId();
            router.push("/join");
          }}
          className="mt-14 mx-auto block text-oracle-textFaint text-[10px] uppercase tracking-widest"
        >
          leave experiment
        </button>
      </div>
    </main>
  );
}
