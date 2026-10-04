import { NextRequest, NextResponse } from "next/server";
import { lockVoting, reopenVoting, getState } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const state = getState();
  return NextResponse.json({
    votes: state.votes,
    players: state.players,
    characters: state.characters,
    votingOpen: state.game.votingOpen,
    votingLocked: state.game.votingLocked,
  });
}

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.action === "LOCK") lockVoting();
  else if (body.action === "REOPEN") reopenVoting();
  else return NextResponse.json({ error: "unknown action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
