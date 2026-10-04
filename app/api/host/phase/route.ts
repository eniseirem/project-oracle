import { NextRequest, NextResponse } from "next/server";
import { advancePhase } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const direction = body.direction === "back" ? -1 : 1;
  const phase = advancePhase(direction);
  return NextResponse.json({ ok: true, currentPhase: phase });
}
