"use client";

import { Panel } from "@/components/ui/Panel";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { phaseLabel } from "@/lib/data/phases";
import { hostPost } from "@/lib/client/hostApi";

export function PhaseControl({ game, players, onChanged }: { game: any; players: any[]; onChanged: () => void }) {
  const active = players.filter((p) => p.status === "ACTIVE").length;

  async function advance(direction: "forward" | "back") {
    await hostPost("/api/host/phase", { direction });
    onChanged();
  }

  return (
    <Panel>
      <div className="grid grid-cols-3 gap-3 text-center mb-5">
        <div>
          <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest">Phase</p>
          <p className="font-display text-sm text-oracle-amber uppercase mt-1">
            {phaseLabel(game.currentPhase)}
          </p>
        </div>
        <div>
          <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest">Players</p>
          <p className="font-display text-lg text-oracle-text mt-1">{players.length}</p>
        </div>
        <div>
          <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest">Active</p>
          <p className="font-display text-lg text-oracle-text mt-1">{active}</p>
        </div>
      </div>

      {game.status === "PAUSED" && (
        <p className="text-center text-oracle-redBright text-xs uppercase tracking-widest mb-4">
          GAME PAUSED — players see current state but phase is frozen
        </p>
      )}

      <div className="space-y-2">
        <ConfirmButton
          label="ADVANCE PHASE"
          confirmLabel={`CONFIRM: ADVANCE TO ${phaseLabel(Math.min(10, game.currentPhase + 1))}`}
          variant="primary"
          disabled={game.currentPhase >= 10}
          onConfirm={() => advance("forward")}
        />
        <ConfirmButton
          label="BACK ONE PHASE"
          confirmLabel="CONFIRM: GO BACK ONE PHASE"
          variant="secondary"
          disabled={game.currentPhase <= 0}
          onConfirm={() => advance("back")}
        />
      </div>
    </Panel>
  );
}
