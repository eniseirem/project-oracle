import { NextRequest, NextResponse } from "next/server";
import { getState } from "@/lib/store";
import { buildHostPayload } from "@/lib/filters";
import { checkHostAuth } from "@/lib/hostAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const state = getState();
  return NextResponse.json(buildHostPayload(state));
}
