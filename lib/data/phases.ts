import type { Phase } from "@/lib/types";

// The 11 fixed phases of a PROJECT ORACLE run. This list is structural and
// should not need to change between story installs.
export const PHASES: Phase[] = [
  { id: 0, code: "PRE-PARTY", label: "0 — PRE-PARTY" },
  { id: 1, code: "ARRIVAL", label: "1 — ARRIVAL" },
  { id: 2, code: "ORACLE LAUNCH", label: "2 — ORACLE LAUNCH" },
  { id: 3, code: "FIRST MURDER", label: "3 — FIRST MURDER" },
  { id: 4, code: "INVESTIGATION I", label: "4 — INVESTIGATION I" },
  { id: 5, code: "ORACLE AWAKENS", label: "5 — ORACLE AWAKENS" },
  { id: 6, code: "INVESTIGATION II", label: "6 — INVESTIGATION II" },
  { id: 7, code: "SECOND INCIDENT", label: "7 — SECOND INCIDENT" },
  { id: 8, code: "FINAL EVIDENCE", label: "8 — FINAL EVIDENCE" },
  { id: 9, code: "ACCUSATION", label: "9 — ACCUSATION" },
  { id: 10, code: "REVEAL", label: "10 — REVEAL" },
];

export function phaseLabel(phaseId: number): string {
  return PHASES.find((p) => p.id === phaseId)?.label ?? `PHASE ${phaseId}`;
}
