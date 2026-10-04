"use client";

import { useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { hostPost } from "@/lib/client/hostApi";

export function EvidencePanel({
  evidence,
  players,
  onChanged,
}: {
  evidence: any[];
  players: any[];
  onChanged: () => void;
}) {
  const [sendingFor, setSendingFor] = useState<string | null>(null);

  async function act(evidenceId: string, action: string, playerId?: string) {
    await hostPost("/api/host/evidence", { evidenceId, action, playerId });
    setSendingFor(null);
    onChanged();
  }

  return (
    <Panel>
      <PanelHeader>Evidence Control</PanelHeader>
      <div className="space-y-3">
        {evidence.map((e) => (
          <div key={e.id} className="border border-oracle-border rounded-sm p-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs uppercase tracking-widest text-oracle-text">
                EVIDENCE #{e.id} — {e.title}
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-oracle-border rounded-sm text-oracle-amber">
                {e.status}
              </span>
            </div>
            <p className="text-[10px] text-oracle-textFaint uppercase tracking-widest mt-1">
              {e.visibility}
            </p>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-[10px]"
                onClick={() => act(e.id, "RELEASE")}
              >
                RELEASE PUBLICLY
              </Button>
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-[10px]"
                onClick={() => setSendingFor(sendingFor === e.id ? null : e.id)}
              >
                SEND TO PLAYER
              </Button>
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-[10px]"
                onClick={() => act(e.id, "LOCK")}
              >
                LOCK
              </Button>
            </div>

            {sendingFor === e.id && (
              <div className="mt-2 grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {players.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => act(e.id, "SEND_TO_PLAYER", p.id)}
                    className="text-left text-xs px-3 py-2 rounded-sm bg-oracle-panelAlt hover:bg-oracle-border text-oracle-text"
                  >
                    {p.realName} ({p.characterName})
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
