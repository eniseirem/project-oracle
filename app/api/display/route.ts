import { NextResponse } from "next/server";
import { getState } from "@/lib/store";
import { buildDisplayPayload } from "@/lib/filters";

// Without this, Next.js statically optimizes this route at build time
// (it reads no request-derived data) and would serve a frozen snapshot
// of the seed state forever instead of the live game state.
export const dynamic = "force-dynamic";

export async function GET() {
  const state = getState();
  return NextResponse.json(buildDisplayPayload(state));
}
