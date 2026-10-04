import { NextRequest, NextResponse } from "next/server";
import {
  setPaused,
  advancePhase,
  setPhase,
  getState,
  reassignCharacter,
  removePlayer,
  reopenVoting,
  clearAnnouncement,
  moveClueToPlayer,
} from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  switch (action) {
    case "PAUSE":
      setPaused(true);
      break;
    case "RESUME":
      setPaused(false);
      break;
    case "SKIP_PHASE":
      advancePhase(1);
      break;
    case "UNLOCK_CURRENT_PHASE": {
      // Re-applies the current phase, which is a no-op on the phase number
      // itself but is exposed as an explicit action for the host in case
      // content needs re-evaluating after a manual edit.
      const state = getState();
      setPhase(state.game.currentPhase);
      break;
    }
    case "MOVE_CLUE":
      if (!body.evidenceId || !body.fromPlayerId || !body.toPlayerId) {
        return NextResponse.json({ error: "evidenceId, fromPlayerId, toPlayerId required" }, { status: 400 });
      }
      moveClueToPlayer(body.evidenceId, body.fromPlayerId, body.toPlayerId);
      break;
    case "REMOVE_ABSENT":
      if (!body.playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
      removePlayer(body.playerId);
      break;
    case "REOPEN_VOTING":
      reopenVoting();
      break;
    case "CLEAR_ANNOUNCEMENT":
      clearAnnouncement();
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
