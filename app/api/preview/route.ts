import { NextRequest, NextResponse } from "next/server";
import { getState, getRosterAssignmentFor, registerUsername } from "@/lib/store";

// Public, pre-game username self-registration + character lookup. A guest
// picks ANY username they like here — there's no host step first. If it's
// brand new, this call registers it (a pending slot with no character yet)
// so it shows up on the host's Roster panel for them to assign. If it's
// already registered, this just reports its current status. This never
// creates a Player or touches the live game roster — it's read/registration
// only, safe to call any time before (or after) the Game Master has started
// anything.
//
// Once a character IS assigned, the payload is deliberately the same subset
// the printed character sheets show: no phaseReveals (those unlock live,
// in-app, during the party) and only relationships visible from phase 0 —
// so previewing early can't spoil what the night still has queued up.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || "";
  if (!username.trim()) {
    return NextResponse.json({ error: "USERNAME REQUIRED" }, { status: 400 });
  }

  let assignment = getRosterAssignmentFor(username);
  const isNew = !assignment;
  if (!assignment) {
    assignment = registerUsername(username);
  }

  if (!assignment || !assignment.characterId) {
    return NextResponse.json({
      status: isNew ? "REGISTERED_PENDING" : "PENDING",
      displayUsername: assignment?.displayUsername ?? username.trim(),
    });
  }

  const state = getState();
  const character = state.characters.find((c) => c.id === assignment!.characterId);
  if (!character) {
    return NextResponse.json({ status: "PENDING", displayUsername: assignment.displayUsername });
  }

  const startingRelationships = character.relationships
    .filter((r) => r.revealPhase === 0)
    .map((r) => {
      const other = state.characters.find((c) => c.id === r.characterId);
      return {
        characterId: r.characterId,
        name: other?.name ?? "UNKNOWN SUBJECT",
        label: r.label,
        note: r.note,
      };
    });

  return NextResponse.json({
    status: "ASSIGNED",
    character: {
      id: character.id,
      name: character.name,
      tier: character.tier,
      costumeSuggestion: character.costumeSuggestion,
      accentColor: character.accentColor,
      publicBio: character.publicBio,
      secret: character.secret,
      whatYouKnow: character.whatYouKnow,
      objectives: character.objectives,
      relationships: startingRelationships,
    },
  });
}
