import { NextRequest, NextResponse } from "next/server";
import { markSeen } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
  markSeen(playerId);
  return NextResponse.json({ ok: true });
}
