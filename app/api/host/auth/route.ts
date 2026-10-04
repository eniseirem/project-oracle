import { NextRequest, NextResponse } from "next/server";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code : "";
  if (checkHostAuth(code)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "INCORRECT CODE" }, { status: 401 });
}
