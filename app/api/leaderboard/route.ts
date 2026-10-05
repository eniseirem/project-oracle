import { NextRequest, NextResponse } from "next/server";
import { getState, computeLeaderboard } from "@/lib/store";

export const dynamic = "force-dynamic";

// Player-facing: deliberately withheld until the Game Master opens the
// final reveal (game.revealOpen — the same flag the BEGIN_REVEAL event
// sets), so this never leaks who's ahead before the night's actual verbal
// reveal happens. Strips everything down to name + total + rank — no
// per-objective breakdown, and never the actual solution.
export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId") || "";
  const state = getState();

  if (!state.game.revealOpen) {
    return NextResponse.json({ open: false });
  }

  const board = computeLeaderboard(state).map((row, i) => ({
    rank: i + 1,
    realName: row.realName,
    total: row.total,
    isYou: row.playerId === playerId,
  }));

  return NextResponse.json({ open: true, rows: board });
}
