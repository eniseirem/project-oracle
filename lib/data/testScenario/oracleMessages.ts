import type { OracleMessage } from "@/lib/types";

// ORACLE messages for the TEST scenario (see characters.ts in this folder).
// Kept short — this run is meant to take 20-30 minutes, just enough to
// exercise phase advances, message delivery, evidence drops and voting.
export const ORACLE_MESSAGES_SEED: OracleMessage[] = [
  {
    id: "test-msg-01",
    timestamp: "20:00",
    type: "GLOBAL",
    phase: 2,
    content: "ORACLE // SCORING SYSTEM ONLINE.\nTONIGHT'S ROUND IS NOW BEING TRACKED.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "test-msg-02",
    timestamp: "21:10",
    type: "GLOBAL",
    phase: 3,
    content: "ALERT.\nTHE QUIZMASTER HAS COLLAPSED.\nFINAL ROUND SUSPENDED.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "test-msg-03",
    timestamp: "21:20",
    type: "PRIVATE",
    recipientPlayerId: null,
    phase: 4,
    content: "ORACLE // PRIVATE MESSAGE\nAsk THE RIVAL why they went backstage during the final round.\nDo not explain why.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "test-msg-04",
    timestamp: "21:35",
    type: "GLOBAL",
    phase: 7,
    content: "ORACLE // SELF-DIAGNOSTIC\nSCORE ADJUSTMENT LOG ACCESSED RECENTLY.\nNOT BY THE QUIZMASTER.",
    sentAt: new Date().toISOString(),
  },
  {
    id: "test-msg-05",
    timestamp: "21:50",
    type: "GLOBAL",
    phase: 8,
    content: "PREDICTION.\nONE PERSON HERE IS PROTECTING SOMEONE.\nCONFIDENCE: 83.0%",
    confidence: "83.0%",
    sentAt: new Date().toISOString(),
  },
];
