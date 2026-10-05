import { NextRequest, NextResponse } from "next/server";
import { getState, setObjectiveCompletionRevoked, computeLeaderboard } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const state = getState();
  return NextResponse.json({ scoreboard: computeLeaderboard(state) });
}

// Game Master only: revoke or restore a single player's claimed objective.
// A revoked claim drops out of their total immediately; it's never deleted
// outright, so restoring it brings back the exact original points.
export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  const objectiveKey = typeof body.objectiveKey === "string" ? body.objectiveKey : "";
  const revoked = !!body.revoked;
  if (!playerId || !objectiveKey) {
    return NextResponse.json({ error: "playerId and objectiveKey required" }, { status: 400 });
  }
  setObjectiveCompletionRevoked(playerId, objectiveKey, revoked);
  const state = getState();
  return NextResponse.json({ ok: true, scoreboard: computeLeaderboard(state) });
}
