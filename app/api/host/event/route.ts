import { NextRequest, NextResponse } from "next/server";
import { fireEvent } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";
import type { GameEventType } from "@/lib/types";

const VALID: GameEventType[] = [
  "FIRST_MURDER",
  "ORACLE_PREDICTION_1",
  "RELEASE_TIMELINE_CLUE",
  "SECOND_INCIDENT",
  "OPEN_FINAL_VOTING",
  "BEGIN_REVEAL",
];

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const type = body.type as GameEventType;
  if (!VALID.includes(type)) {
    return NextResponse.json({ error: "unknown event type" }, { status: 400 });
  }
  const event = fireEvent(type);
  return NextResponse.json({ ok: true, event });
}
