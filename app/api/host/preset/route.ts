import { NextRequest, NextResponse } from "next/server";
import { addMessagePreset } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const label = typeof body.label === "string" ? body.label : "";
  const content = typeof body.content === "string" ? body.content : "";
  if (!label.trim() || !content.trim()) {
    return NextResponse.json({ error: "label and content required" }, { status: 400 });
  }
  addMessagePreset(label, content);
  return NextResponse.json({ ok: true });
}
