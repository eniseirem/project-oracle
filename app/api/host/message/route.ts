import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/store";
import { checkHostAuth } from "@/lib/hostAuth";

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { recipientType, recipientPlayerId, recipientFactionId, content, confidence } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "MESSAGE CONTENT REQUIRED" }, { status: 400 });
  }

  const type = recipientType === "single" ? "PRIVATE" : recipientType === "faction" ? "FACTION" : "GLOBAL";

  const message = sendMessage({
    type,
    recipientPlayerId: type === "PRIVATE" ? recipientPlayerId : null,
    recipientFactionId: type === "FACTION" ? recipientFactionId : null,
    content,
    confidence: typeof confidence === "string" && confidence ? confidence : undefined,
  });

  return NextResponse.json({ ok: true, message });
}
