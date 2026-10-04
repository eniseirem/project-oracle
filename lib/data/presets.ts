export const MESSAGE_PRESETS = [
  {
    id: "preset-anomaly",
    label: "ANOMALY DETECTED",
    content:
      "BEHAVIORAL ANOMALY DETECTED.\nSomeone attending this event is not being honest.\nCONFIDENCE: {{confidence}}%",
  },
  {
    id: "preset-evidence",
    label: "NEW EVIDENCE AVAILABLE",
    content: "NEW EVIDENCE HAS BEEN RELEASED.\nCHECK /EVIDENCE NOW.",
  },
  {
    id: "preset-lying",
    label: "ONE OF YOU IS LYING",
    content: "ONE OF YOU IS LYING.\nORACLE WILL NOT SAY WHICH.",
  },
  {
    id: "preset-prediction",
    label: "ORACLE PREDICTION",
    content: "ORACLE PREDICTION.\n{{prediction}}\nCONFIDENCE: {{confidence}}%",
  },
  {
    id: "preset-protocol-black",
    label: "PROTOCOL BLACK",
    content: "PROTOCOL BLACK ENACTED.\nALL SUBJECTS REMAIN IN PLACE.",
  },
  {
    id: "preset-accusation",
    label: "FINAL ACCUSATION REQUIRED",
    content: "FINAL ASSESSMENT PROTOCOL ACTIVE.\nALL SUBJECTS MUST SUBMIT AN ACCUSATION.",
  },
];
