import { NextRequest, NextResponse } from "next/server";
import { claimObjective, markObjectiveToggled } from "@/lib/store";

export const dynamic = "force-dynamic";

// Claims an objective for points (one-way — see claimObjective in
// lib/store.ts). Still also flips the old cosmetic completedObjectives
// list via objectiveKey (the full objective text), purely so any existing
// UI relying on that keeps working — the real scoring lives in
// player.objectiveCompletions now.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  const characterId = typeof body.characterId === "string" ? body.characterId : "";
  const type = typeof body.type === "string" ? body.type : "";
  const cosmeticKey = typeof body.objectiveKey === "string" ? body.objectiveKey : "";

  if (!playerId || !characterId || !type) {
    return NextResponse.json({ error: "playerId, characterId and type required" }, { status: 400 });
  }

  const completion = claimObjective(playerId, characterId, type);
  if (cosmeticKey) markObjectiveToggled(playerId, cosmeticKey);

  return NextResponse.json({ ok: true, completion });
}
