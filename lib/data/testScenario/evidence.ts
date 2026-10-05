import type { EvidenceItem } from "@/lib/types";

// Evidence for the TEST scenario (see characters.ts in this folder). Same
// "no hidden physical objects" rule as the real game — everything here is
// informational, delivered through the app, since you're testing this
// online rather than in a shared physical space.
export const EVIDENCE_SEED: EvidenceItem[] = [
  {
    id: "test-001",
    title: "SEATING CHART",
    description: "Tonight's sign-in sheet. One name is listed twice, under slightly different spellings.",
    visibility: "PUBLIC",
    status: "AVAILABLE",
    unlockPhase: 1,
    authenticity: "VERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "test-002",
    title: "BACKSTAGE ACCESS LOG",
    description: "20:58 — door opened.\n21:02 — door opened.\n21:06 — door opened.\nNo names attached.",
    visibility: "PUBLIC",
    status: "LOCKED",
    unlockPhase: 4,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "test-003",
    title: "THE OVERRIDE LOG",
    description: "A partial export from the scoring app's admin panel. Dozens of manual score adjustments, going back months, with no explanation attached.",
    visibility: "PRIVATE",
    status: "LOCKED",
    unlockPhase: 8,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
];
