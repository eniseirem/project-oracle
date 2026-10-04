import type { OracleMessage } from "@/lib/types";

// PLACEHOLDER ORACLE messages. `sentAt` left undefined means the message is
// a seeded draft that has not actually gone out yet — the Game Master sends
// it from /host (or it is attached to a phase and released on arrival, per
// your preference when wiring the real story). For this MVP all eight are
// marked as already sent across phases 2–8 so the player-facing UI can be
// fully exercised.
export const ORACLE_MESSAGES_SEED: OracleMessage[] = [
  {
    id: "msg-01",
    timestamp: "20:02",
    type: "GLOBAL",
    phase: 2,
    content:
      "ORACLE // SYSTEM ONLINE.\nBEHAVIORAL MONITORING INITIATED.\nALL ATTENDEES ARE NOW SUBJECTS.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-02",
    timestamp: "21:12",
    type: "GLOBAL",
    phase: 3,
    content: "ORACLE ALERT.\nCRITICAL EVENT DETECTED.\nSUBJECT ZERO: TERMINATED.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-03",
    timestamp: "21:44",
    type: "PRIVATE",
    recipientPlayerId: null,
    phase: 4,
    content:
      "ORACLE // PRIVATE MESSAGE\nAsk THE PARTNER where they were at 21:13.\nDo not explain why.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-04",
    timestamp: "21:46",
    type: "FACTION",
    recipientFactionId: "faction-inner-circle",
    phase: 4,
    content:
      "BEHAVIORAL ANOMALY DETECTED.\nSomeone attending this event has already lied about their relationship with Subject Zero.",
    confidence: "91.2%",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-05",
    timestamp: "22:05",
    type: "GLOBAL",
    phase: 5,
    content: "ORACLE AWAKENS.\nPATTERN RECOGNITION: ACTIVE.\nYOU ARE BEING MODELED.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-06",
    timestamp: "22:21",
    type: "PRIVATE",
    recipientPlayerId: null,
    phase: 6,
    content:
      "ORACLE // PRIVATE MESSAGE\nSomeone in this room erased a file tonight on someone else's instruction.\nFind out whose.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-07",
    timestamp: "22:40",
    type: "FACTION",
    recipientFactionId: "faction-outsiders",
    phase: 7,
    content: "ONE OF YOU IS LYING.\nORACLE WILL NOT SAY WHICH.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "msg-08",
    timestamp: "23:01",
    type: "GLOBAL",
    phase: 8,
    content:
      "ORACLE PREDICTION #002.\nONE PERSON IN THIS ROOM\nIS PROTECTING THE KILLER.",
    confidence: "87.4%",
    sentAt: new Date().toISOString(),
  },
  // THE SLIP — the one real tell pointing at whoever controls ORACLE (not the
  // killer). Deniable as flavor text to most players, a real tell to anyone
  // who's noticed this character's own verbal tics earlier in the night.
  // Send this as-is, as GLOBAL, at phase 7 — don't announce it.
  {
    id: "msg-09",
    timestamp: "22:52",
    type: "GLOBAL",
    phase: 7,
    content:
      "ORACLE // SELF-DIAGNOSTIC\nVOCABULARY DRIFT DETECTED.\nTHIS IS NOT HOW I USUALLY SPEAK.\nIT IS HOW SOMEONE ELSE DOES.",
    sentAt: new Date().toISOString(),
  },
];
