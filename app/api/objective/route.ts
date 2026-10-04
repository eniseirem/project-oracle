import { NextRequest, NextResponse } from "next/server";
import { markObjectiveToggled } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  const objectiveKey = typeof body.objectiveKey === "string" ? body.objectiveKey : "";
  if (!playerId || !objectiveKey) {
    return NextResponse.json({ error: "playerId and objectiveKey required" }, { status: 400 });
  }
  markObjectiveToggled(playerId, objectiveKey);
  return NextResponse.json({ ok: true });
}
