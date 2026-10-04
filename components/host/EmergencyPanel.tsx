"use client";

import { useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { hostPost } from "@/lib/client/hostApi";

export function EmergencyPanel({
  game,
  players,
  evidence,
  onChanged,
}: {
  game: any;
  players: any[];
  evidence: any[];
  onChanged: () => void;
}) {
  const [movingClue, setMovingClue] = useState(false);
  const [clueEvidenceId, setClueEvidenceId] = useState("");
  const [clueFrom, setClueFrom] = useState("");
  const [clueTo, setClueTo] = useState("");
  const [removing, setRemoving] = useState(false);

  const absentPlayers = players.filter((p) => p.status === "ABSENT");

  async function emergency(action: string, extra: Record<string, any> = {}) {
    await hostPost("/api/host/emergency", { action, ...extra });
    onChanged();
  }

  return (
    <Panel className="border-oracle-borderActive">
      <PanelHeader>Emergency</PanelHeader>

      <div className="space-y-2">
        <Button
          variant={game.status === "PAUSED" ? "primary" : "secondary"}
          full
          onClick={() => emergency(game.status === "PAUSED" ? "RESUME" : "PAUSE")}
        >
          {game.status === "PAUSED" ? "RESUME GAME" : "PAUSE GAME"}
        </Button>

        <ConfirmButton
          label="SKIP CURRENT PHASE"
          confirmLabel="CONFIRM: SKIP TO NEXT PHASE"
          onConfirm={() => emergency("SKIP_PHASE")}
        />

        <Button variant="secondary" full onClick={() => emergency("UNLOCK_CURRENT_PHASE")}>
          UNLOCK CURRENT PHASE CONTENT
        </Button>

        <Button variant="secondary" full onClick={() => setMovingClue((v) => !v)}>
          MOVE IMPORTANT CLUE TO ANOTHER PLAYER
        </Button>

        {movingClue && (
          <div className="border border-oracle-border rounded-sm p-3 space-y-2">
            <select
              value={clueEvidenceId}
              onChange={(e) => setClueEvidenceId(e.target.value)}
              className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text"
            >
              <option value="">— EVIDENCE —</option>
              {evidence.map((e) => (
                <option key={e.id} value={e.id}>
                  #{e.id} {e.title}
                </option>
              ))}
            </select>
            <select
              value={clueFrom}
              onChange={(e) => setClueFrom(e.target.value)}
              className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text"
            >
              <option value="">— FROM PLAYER —</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.realName}
                </option>
              ))}
            </select>
            <select
              value={clueTo}
              onChange={(e) => setClueTo(e.target.value)}
              className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text"
            >
              <option value="">— TO PLAYER —</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.realName}
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              full
              disabled={!clueEvidenceId || !clueFrom || !clueTo}
              onClick={async () => {
                await emergency("MOVE_CLUE", { evidenceId: clueEvidenceId, fromPlayerId: clueFrom, toPlayerId: clueTo });
                setMovingClue(false);
                setClueEvidenceId("");
                setClueFrom("");
                setClueTo("");
              }}
            >
              CONFIRM MOVE
            </Button>
          </div>
        )}

        <Button variant="secondary" full onClick={() => setRemoving((v) => !v)}>
          REMOVE ABSENT CHARACTER
        </Button>

        {removing && (
          <div className="border border-oracle-border rounded-sm p-3 space-y-1">
            {absentPlayers.length === 0 ? (
              <p className="text-oracle-textFaint text-xs">No players are currently marked absent.</p>
            ) : (
              absentPlayers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    emergency("REMOVE_ABSENT", { playerId: p.id });
                    setRemoving(false);
                  }}
                  className="w-full text-left text-xs px-3 py-2 rounded-sm bg-oracle-panelAlt hover:bg-oracle-border text-oracle-text"
                >
                  REMOVE {p.realName}
                </button>
              ))
            )}
          </div>
        )}

        <ConfirmButton
          label="REOPEN VOTING"
          confirmLabel="CONFIRM: REOPEN VOTING FOR ALL PLAYERS"
          onConfirm={() => emergency("REOPEN_VOTING")}
        />

        {game.activeAnnouncement && (
          <Button variant="ghost" full className="border border-oracle-border" onClick={() => emergency("CLEAR_ANNOUNCEMENT")}>
            CLEAR ACTIVE ANNOUNCEMENT
          </Button>
        )}
      </div>
    </Panel>
  );
}
