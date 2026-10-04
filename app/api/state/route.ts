import { NextRequest, NextResponse } from "next/server";
import { getState, getPlayer } from "@/lib/store";
import { buildPlayerPayload } from "@/lib/filters";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId");
  if (!playerId) {
    return NextResponse.json({ error: "playerId required" }, { status: 400 });
  }
  const player = getPlayer(playerId);
  if (!player) {
    return NextResponse.json({ error: "PLAYER NOT FOUND" }, { status: 404 });
  }
  const state = getState();
  return NextResponse.json(buildPlayerPayload(state, player));
}
