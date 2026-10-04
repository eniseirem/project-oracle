import type { Faction } from "@/lib/types";

// PLACEHOLDER factions — rename / replace freely. Characters reference these
// by id, and FACTION-type ORACLE messages target one of these ids.
export const FACTIONS: Faction[] = [
  {
    id: "faction-inner-circle",
    name: "THE INNER CIRCLE",
    description: "Those who worked closest with Subject Zero.",
    color: "#b2302f",
  },
  {
    id: "faction-outsiders",
    name: "THE OUTSIDERS",
    description: "Guests with no official tie to the experiment.",
    color: "#c98a3a",
  },
];
