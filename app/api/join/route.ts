import { NextRequest, NextResponse } from "next/server";
import { joinGame } from "@/lib/store";
import { buildPlayerPayload } from "@/lib/filters";
import { getState } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name : "";
  const gameCode = typeof body.gameCode === "string" ? body.gameCode : "";

  if (!name.trim()) {
    return NextResponse.json({ error: "NAME REQUIRED" }, { status: 400 });
  }
  if (!gameCode.trim()) {
    return NextResponse.json({ error: "GAME CODE REQUIRED" }, { status: 400 });
  }

  const player = joinGame(name, gameCode);
  const state = getState();
  const payload = buildPlayerPayload(state, player);

  return NextResponse.json({ playerId: player.id, ...payload });
}
