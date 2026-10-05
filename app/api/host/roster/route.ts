import { NextRequest, NextResponse } from "next/server";
import { checkHostAuth } from "@/lib/hostAuth";
import { getRosterAssignments, setRosterAssignment, removeRosterAssignment } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return NextResponse.json({ assignments: getRosterAssignments() });
}

export async function POST(req: NextRequest) {
  if (!checkHostAuth(req.headers.get("x-oracle-host-key"))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username : "";
  const action = typeof body.action === "string" ? body.action : "SET";

  if (!username.trim()) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  if (action === "REMOVE") {
    removeRosterAssignment(username);
  } else {
    const characterId = typeof body.characterId === "string" ? body.characterId : "";
    if (!characterId) {
      return NextResponse.json({ error: "characterId required" }, { status: 400 });
    }
    setRosterAssignment(username, characterId);
  }

  return NextResponse.json({ assignments: getRosterAssignments() });
}
