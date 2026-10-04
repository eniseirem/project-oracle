import { NextRequest, NextResponse } from "next/server";
import { markAbsent, markActive, removePlayer, reassignCharacter } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { playerId, action, characterId } = body;
  if (!playerId || !action) {
    return NextResponse.json({ error: "playerId and action required" }, { status: 400 });
  }

  switch (action) {
    case "MARK_ABSENT":
      markAbsent(playerId);
      break;
    case "MARK_ACTIVE":
      markActive(playerId);
      break;
    case "REMOVE":
      removePlayer(playerId);
      break;
    case "REASSIGN":
      reassignCharacter(playerId, characterId);
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
