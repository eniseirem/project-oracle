import { NextRequest, NextResponse } from "next/server";
import { getState, submitVote } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId");
  if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
  const state = getState();
  const vote = state.votes.find((v) => v.playerId === playerId) ?? null;
  return NextResponse.json({
    vote,
    votingOpen: state.game.votingOpen,
    votingLocked: state.game.votingLocked,
    characters: state.characters.map((c) => ({ id: c.id, name: c.name })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });

  const state = getState();
  if (!state.game.votingOpen) {
    return NextResponse.json({ error: "VOTING IS NOT OPEN" }, { status: 400 });
  }
  if (state.game.votingLocked) {
    return NextResponse.json({ error: "VOTING IS LOCKED" }, { status: 400 });
  }

  const vote = submitVote(playerId, {
    accusedCharacterId: typeof body.accusedCharacterId === "string" ? body.accusedCharacterId : null,
    why: typeof body.why === "string" ? body.why : "",
  });
  return NextResponse.json({ ok: true, vote });
}
