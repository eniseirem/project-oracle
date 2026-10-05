import type { CharacterTier } from "@/lib/types";

// The internal CharacterTier values ("CORE" / "EXTENDED" / "OPTIONAL") are
// load-bearing — lib/characterAssignment.ts matches on these exact strings
// to decide who gets handed a character first. Never rename those.
//
// TIER_LABELS is purely the human-facing text shown instead of the raw tier
// string, wherever a guest or the host sees it. Framed as ORACLE's own
// classification of each "subject" rather than a game-engine category.
export const TIER_LABELS: Record<CharacterTier, string> = {
  CORE: "PRIORITY SUBJECT",
  EXTENDED: "SUBJECT OF INTEREST",
  OPTIONAL: "PERIPHERAL SUBJECT",
};

export const TIER_ORDER: CharacterTier[] = ["CORE", "EXTENDED", "OPTIONAL"];
