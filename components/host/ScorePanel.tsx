"use client";

import { useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { hostPost } from "@/lib/client/hostApi";

const TYPE_LABEL: Record<string, string> = {
  PRIMARY: "PRIMARY",
  SECRET: "SECRET",
  SOCIAL: "SOCIAL",
  BONUS: "BONUS",
};

export function ScorePanel({
  scoreboard,
  onChanged,
}: {
  scoreboard: any[];
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  async function toggleRevoke(playerId: string, objectiveKey: string, revoked: boolean) {
    await hostPost("/api/host/score", { playerId, objectiveKey, revoked });
    onChanged();
  }

  return (
    <Panel>
      <PanelHeader>Scoreboard</PanelHeader>
      <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest mb-2">
        live totals — players only see this once you open the reveal. revoke a claim if it
        wasn't real; final accusation points only count once they've actually voted.
      </p>
      {scoreboard.length === 0 ? (
        <p className="text-oracle-textDim text-sm text-center py-4">No players yet.</p>
      ) : (
        <div className="space-y-2">
          {scoreboard.map((row, i) => {
            const isExpanded = expanded === row.playerId;
            return (
              <div key={row.playerId} className="border border-oracle-border rounded-sm p-3">
                <button
                  className="w-full flex items-center justify-between"
                  onClick={() => setExpanded(isExpanded ? null : row.playerId)}
                >
                  <div className="text-left">
                    <p className="font-display text-sm uppercase tracking-wide text-oracle-text">
                      #{i + 1} {row.realName}
                    </p>
                    <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest">
                      {row.characterName}
                    </p>
                  </div>
                  <span className="text-oracle-amber font-display text-sm">{row.total} PTS</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 border-t border-oracle-border pt-2 space-y-1.5">
                    {row.completions.length === 0 && (
                      <p className="text-oracle-textFaint text-xs">No claims yet.</p>
                    )}
                    {row.completions.map((c: any) => (
                      <div key={c.objectiveKey} className="flex items-center justify-between text-xs">
                        <span className={c.revoked ? "text-oracle-textFaint line-through" : "text-oracle-text"}>
                          {TYPE_LABEL[c.type] ?? c.type} · +{c.points} · phase {c.phaseCompleted}
                        </span>
                        <button
                          className="text-[10px] uppercase tracking-widest text-oracle-redBright underline"
                          onClick={() => toggleRevoke(row.playerId, c.objectiveKey, !c.revoked)}
                        >
                          {c.revoked ? "RESTORE" : "REVOKE"}
                        </button>
                      </div>
                    ))}
                    {row.finalGuessPoints > 0 && (
                      <p className="text-xs text-oracle-text pt-1 border-t border-oracle-border/60">
                        FINAL ACCUSATION: +{row.finalGuessPoints} (
                        {row.finalGuessCorrect === "KILLER" ? "guessed the killer" : "guessed the mastermind"})
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
