import type { EvidenceItem } from "@/lib/types";

// PLACEHOLDER evidence. `unlockPhase` is only used to seed the initial
// status (LOCKED vs AVAILABLE) — after that, status is entirely under the
// Game Master's control from /host.
//
// VENUE RULE: this game is played in a public bar the host doesn't control,
// so no evidence should ever require players to physically search the venue
// for a hidden object (a planted phone, a note taped under a table, etc.) —
// that doesn't work in a space full of other patrons and staff. Every clue
// here is either purely informational (delivered through the app — a log,
// a call record, a recording transcript) or something the Game Master hands
// a player directly (a printed card, a photo). Keep new evidence the same
// way.
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
    title: "FINAL CALL LOG",
    description:
      "Subject Zero's carrier records one last outgoing call at 21:09, lasting four seconds. It was never answered. The number has no name attached to it.",
    visibility: "PUBLIC",
    status: "LOCKED",
    unlockPhase: 7,
    authenticity: "UNVERIFIED",
    sentToPlayerIds: [],
  },
  {
    id: "006",
    title: "A SINGLE LEGO BRICK",
    description:
      "A single LEGO brick, sitting somewhere it has no business being. It doesn't match anything else here — some mysteries just don't have an answer.",
    // Entirely optional, for-fun flavor evidence — NOT a real clue to the
    // mystery. The Game Master can make this a literal physical object: a
    // real LEGO brick handed directly to a player, or left somewhere
    // findable. If you don't bother with it, nothing in the game depends
    // on it — leave it LOCKED and never release it.
    visibility: "PRIVATE",
    status: "LOCKED",
    unlockPhase: 5,
    authenticity: "DISPUTED",
    sentToPlayerIds: [],
  },
];
