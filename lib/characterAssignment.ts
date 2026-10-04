import type { Character, CharacterTier, Player } from "@/lib/types";

const TIER_ORDER: CharacterTier[] = ["CORE", "EXTENDED", "OPTIONAL"];

/**
 * Picks the next character to hand to a newly-joined player.
 *
 * This is deliberately join-order based rather than headcount based: it
 * does not need to know in advance whether the party will end at 12 or 30
 * guests. It simply hands out every CORE character first (in array order),
 * then every EXTENDED character, then every OPTIONAL character. Replace
 * the 6 placeholders in lib/data/characters.ts with the real 12/8/10 cast
 * and the 12 → 13-20 → 21-30 scaling described in the brief falls out of
 * this automatically.
 */
export function pickNextCharacter(
  characters: Character[],
  players: Player[]
): Character | null {
  const takenIds = new Set(
    players.filter((p) => p.status !== "REMOVED" && p.characterId).map((p) => p.characterId)
  );

  for (const tier of TIER_ORDER) {
    const candidate = characters.find((c) => c.tier === tier && !takenIds.has(c.id));
    if (candidate) return candidate;
  }
  return null;
}

export function charactersByTier(characters: Character[]) {
  return {
    CORE: characters.filter((c) => c.tier === "CORE"),
    EXTENDED: characters.filter((c) => c.tier === "EXTENDED"),
    OPTIONAL: characters.filter((c) => c.tier === "OPTIONAL"),
  };
}
