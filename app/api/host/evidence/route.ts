import { NextRequest, NextResponse } from "next/server";
import { setEvidenceStatus, moveClueToPlayer } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { evidenceId, action, playerId, fromPlayerId, toPlayerId } = body;
  if (!evidenceId || !action) {
    return NextResponse.json({ error: "evidenceId and action required" }, { status: 400 });
  }

  switch (action) {
    case "RELEASE":
      setEvidenceStatus(evidenceId, "RELEASED");
      break;
    case "SEND_TO_PLAYER":
      if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
      setEvidenceStatus(evidenceId, "DISCOVERED", { sendToPlayerId: playerId });
      break;
    case "LOCK":
      setEvidenceStatus(evidenceId, "LOCKED");
      break;
    case "AVAILABLE":
      setEvidenceStatus(evidenceId, "AVAILABLE");
      break;
    case "MOVE_CLUE":
      if (!fromPlayerId || !toPlayerId) {
        return NextResponse.json({ error: "fromPlayerId and toPlayerId required" }, { status: 400 });
      }
      moveClueToPlayer(evidenceId, fromPlayerId, toPlayerId);
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
