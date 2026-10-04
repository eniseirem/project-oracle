"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { hostPost } from "@/lib/client/hostApi";

const TIER_COLOR: Record<string, string> = {
  CORE: "text-oracle-redBright",
  EXTENDED: "text-oracle-amber",
  OPTIONAL: "text-oracle-textDim",
};

export function PlayerTable({
  players,
  characters,
  factions,
  onChanged,
  onQuickMessage,
}: {
  players: any[];
  characters: any[];
  factions: any[];
  onChanged: () => void;
  onQuickMessage: (playerId: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reassigning, setReassigning] = useState<string | null>(null);

  async function act(playerId: string, action: string, characterId?: string) {
    await hostPost("/api/host/player", { playerId, action, characterId });
    setReassigning(null);
    onChanged();
  }

  if (players.length === 0) {
    return (
      <Panel>
        <p className="text-oracle-textDim text-sm text-center py-6">No players have joined yet.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((p) => {
        const character = characters.find((c: any) => c.id === p.characterId);
        const faction = factions.find((f: any) => f.id === p.factionId);
        const isExpanded = expanded === p.id;
        return (
          <Panel key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm uppercase tracking-wide text-oracle-text">
                  {p.realName}
                </p>
                <p className="text-oracle-textDim text-xs mt-0.5">{p.characterName}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] uppercase tracking-widest">
                  {p.tier && <span className={TIER_COLOR[p.tier]}>{p.tier}</span>}
                  {faction && <span className="text-oracle-textFaint">{faction.name}</span>}
                </div>
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border flex-shrink-0 ${
                  p.status === "ACTIVE"
                    ? "border-oracle-border text-oracle-textDim"
                    : p.status === "ABSENT"
                    ? "border-oracle-amber text-oracle-amber"
                    : "border-oracle-red text-oracle-redBright"
                }`}
              >
                {p.status}
              </span>
            </div>

            {p.importantClue && (
              <p className="mt-2 text-[11px] text-oracle-textFaint italic">
                Clue: {p.importantClue}
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="ghost" className="border border-oracle-border !py-2 !text-xs" onClick={() => setExpanded(isExpanded ? null : p.id)}>
                {isExpanded ? "HIDE CHARACTER" : "VIEW CHARACTER"}
              </Button>
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-xs"
                onClick={() => onQuickMessage(p.id)}
              >
                SEND PRIVATE MESSAGE
              </Button>
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-xs"
                onClick={() => setReassigning(reassigning === p.id ? null : p.id)}
              >
                REASSIGN CHARACTER
              </Button>
              <Button
                variant="ghost"
                className="border border-oracle-border !py-2 !text-xs"
                onClick={() => act(p.id, p.status === "ABSENT" ? "MARK_ACTIVE" : "MARK_ABSENT")}
              >
                {p.status === "ABSENT" ? "MARK ACTIVE" : "MARK ABSENT"}
              </Button>
            </div>

            {reassigning === p.id && (
              <div className="mt-3 border-t border-oracle-border pt-3">
                <p className="text-[10px] uppercase tracking-widest text-oracle-textDim mb-2">
                  Assign to:
                </p>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  {characters.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => act(p.id, "REASSIGN", c.id)}
                      className="text-left text-xs px-3 py-2 rounded-sm bg-oracle-panelAlt hover:bg-oracle-border text-oracle-text"
                    >
                      {c.name} <span className="text-oracle-textFaint">— {c.tier}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && character && (
              <div className="mt-3 border-t border-oracle-border pt-3 text-xs text-oracle-text/90 space-y-2 whitespace-pre-line">
                <p>
                  <span className="text-oracle-textDim">PUBLIC: </span>
                  {character.publicBio}
                </p>
                <p>
                  <span className="text-oracle-textDim">SECRET: </span>
                  {character.secret}
                </p>
                <p>
                  <span className="text-oracle-textDim">KNOWS: </span>
                  {character.whatYouKnow}
                </p>
                {character.objectives.map((o: any) => (
                  <p key={o.type}>
                    <span className="text-oracle-textDim">{o.type}: </span>
                    {o.text}
                  </p>
                ))}
              </div>
            )}
          </Panel>
        );
      })}
    </div>
  );
}
