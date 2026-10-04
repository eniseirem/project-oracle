"use client";

import { useState } from "react";
import Link from "next/link";
import { useHostState } from "@/lib/client/useHostState";
import { HostLogin } from "@/components/host/HostLogin";
import { PhaseControl } from "@/components/host/PhaseControl";
import { PlayerTable } from "@/components/host/PlayerTable";
import { MessageComposer } from "@/components/host/MessageComposer";
import { EvidencePanel } from "@/components/host/EvidencePanel";
import { EventTriggers } from "@/components/host/EventTriggers";
import { EmergencyPanel } from "@/components/host/EmergencyPanel";
import { clearHostKey } from "@/lib/client/session";

export default function HostPage() {
  const { data, loading, unauthorized, refresh } = useHostState();
  const [quickTarget, setQuickTarget] = useState<string | null>(null);
  const [, forceLoginRecheck] = useState(0);

  if (unauthorized) {
    return (
      <HostLogin
        onSuccess={() => {
          forceLoginRecheck((n) => n + 1);
          refresh();
        }}
      />
    );
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-oracle-textDim text-sm uppercase tracking-widest">Connecting…</p>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-oracle-bg/90 backdrop-blur-sm border-b border-oracle-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-oracle-text">
              PROJECT ORACLE
            </p>
            <p className="text-[10px] uppercase tracking-widest text-oracle-redBright">
              Game Master Control
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/display" className="text-oracle-textDim text-[10px] uppercase tracking-widest underline">
              /display
            </Link>
            <button
              onClick={() => {
                clearHostKey();
                refresh();
              }}
              className="text-oracle-textFaint text-[10px] uppercase tracking-widest"
            >
              lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        <PhaseControl game={data.game} players={data.players} onChanged={refresh} />

        <section>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-2">
            Players
          </h2>
          <PlayerTable
            players={data.players}
            characters={data.characters}
            factions={data.factions}
            onChanged={refresh}
            onQuickMessage={(playerId) => setQuickTarget(playerId)}
          />
        </section>

        <section>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-2">
            Oracle Messages
          </h2>
          <MessageComposer
            players={data.players}
            factions={data.factions}
            presets={data.messagePresets}
            quickTargetPlayerId={quickTarget}
            onChanged={() => {
              setQuickTarget(null);
              refresh();
            }}
          />
        </section>

        <section>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-2">
            Evidence
          </h2>
          <EvidencePanel evidence={data.evidence} players={data.players} onChanged={refresh} />
        </section>

        <section>
          <EventTriggers onChanged={refresh} />
        </section>

        <section>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-2">
            Votes Cast: {data.votes.length} / {data.players.filter((p: any) => p.status === "ACTIVE").length}
          </h2>
        </section>

        <section>
          <EmergencyPanel game={data.game} players={data.players} evidence={data.evidence} onChanged={refresh} />
        </section>
      </div>
    </main>
  );
}
