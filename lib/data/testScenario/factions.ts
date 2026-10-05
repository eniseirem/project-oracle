import type { Faction } from "@/lib/types";

// Factions for the short, throwaway TEST scenario (see characters.ts in this
// folder). Deliberately tiny — this whole folder only exists to pressure-test
// the app's mechanics with 3-4 people online before the real party, and is
// never mixed with the real story data in lib/data/*.
export const FACTIONS: Faction[] = [
  {
    id: "test-faction-league",
    name: "THE TRIVIA LEAGUE",
    description: "Regulars who take this far too seriously.",
    color: "#c23b3b",
  },
  {
    id: "test-faction-crew",
    name: "THE RUN CREW",
    description: "People who help keep trivia night running at all.",
    color: "#3a6b8a",
  },
];
