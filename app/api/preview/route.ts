import { NextRequest, NextResponse } from "next/server";
import { getCharacterForUsername, getState } from "@/lib/store";

// Public, pre-game character lookup by username. Unlike /api/join, this
// does NOT create a Player or touch game state at all — it's a read-only
// preview so a guest can see the character the host assigned them before
// the party, any time before (or after) the Game Master has started
// anything. Only usernames the host has pre-assigned on /host return
// anything; everyone else gets a friendly "not assigned yet".
//
// The payload is deliberately the same subset the printed character sheets
// show: no phaseReveals (those unlock live, in-app, during the party) and
// only relationships visible from phase 0 — so previewing early can't spoil
// what the night still has queued up.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || "";
  if (!username.trim()) {
    return NextResponse.json({ error: "USERNAME REQUIRED" }, { status: 400 });
  }

  const character = getCharacterForUsername(username);
  if (!character) {
    return NextResponse.json({ error: "NOT ASSIGNED YET" }, { status: 404 });
  }

  const state = getState();
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
