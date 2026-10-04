import type { EvidenceItem } from "@/lib/types";

// PLACEHOLDER evidence. `unlockPhase` is only used to seed the initial
// status (LOCKED vs AVAILABLE) — after that, status is entirely under the
// Game Master's control from /host.
export const EVIDENCE_SEED: EvidenceItem[] = [
  {
    id: "001",
    title: "NAME TAG DISCREPANCY",
    description:
      "A printed guest list shows a name that does not match any confirmed attendee tonight.",
    visibility: "PUBLIC",
    status: "AVAILABLE",
    unlockPhase: 1,
    authenticity: "VERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "002",
    title: "THE SPARE KEY",
    description:
      "A single brass key, found on the floor near the private room. It is warm to the touch, as if recently held.",
    visibility: "PRIVATE",
    status: "LOCKED",
    unlockPhase: 4,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "003",
    title: "ACCESS LOG",
    description:
      "20:48 — V.VALE\n20:57 — ADMIN\n21:03 — F.BLACK\n21:13 — UNKNOWN",
    visibility: "PUBLIC",
    status: "LOCKED",
    unlockPhase: 4,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "004",
    title: "VOICE MEMO FRAGMENT",
    description:
      "A six-second audio fragment, recovered from a phone left in the coat room. Mostly static. One phrase is audible near the end.",
    visibility: "PRIVATE",
    status: "LOCKED",
    unlockPhase: 6,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "005",
    title: "THE SECOND PHONE",
    description:
      "A second phone registered to Subject Zero, found powered on and unlocked. Its last outgoing call was never answered.",
    visibility: "PUBLIC",
    status: "LOCKED",
    unlockPhase: 7,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
];
