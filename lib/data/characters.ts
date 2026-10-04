import type { Character } from "@/lib/types";

// ============================================================================
// PLACEHOLDER CHARACTERS
// ----------------------------------------------------------------------------
// Six stand-ins, spanning all three tiers, so the tier/assignment logic and
// the UI can be fully tested before the real 30-character cast is written.
//
// To install the real story: replace this array (and keep the shape). The
// character-assignment logic in lib/characterAssignment.ts pulls CORE
// characters first, then EXTENDED, then OPTIONAL — in array order — so once
// you have 12 CORE + 8 EXTENDED + 10 OPTIONAL here, headcount scaling from
// 12 to 30 players works with no code changes.
//
// None of this is the real solution. The killer, mastermind and full
// timeline are intentionally left unwritten for this MVP.
// ============================================================================

export const CHARACTERS: Character[] = [
  {
    id: "core-01",
    name: "CORE CHARACTER 01",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Dark lab coat over formal wear, round tinted glasses.",
    publicBio:
      "A senior researcher on Subject Zero's team. Precise, guarded, rarely seen without a notebook.",
    secret:
      "You altered a timestamp on an internal log the night before the party. You are not sure anyone noticed.",
    whatYouKnow:
      "You know Subject Zero received a phone call around 20:40 that visibly unsettled them.",
    objectives: [
      { type: "PRIMARY", text: "Discover who accessed the private room at 21:13." },
      { type: "SECRET", text: "Recover the missing storage device before anyone else." },
      { type: "SOCIAL", text: "Convince two people that ORACLE may be supernatural." },
    ],
    relationships: [
      {
        characterId: "core-02",
        label: "Former colleague.",
        note: "You don't trust her.",
        revealPhase: 0,
      },
      {
        characterId: "extended-01",
        label: "Reports to you.",
        note: "You think they're hiding something.",
        revealPhase: 0,
      },
      {
        characterId: "optional-01",
        label: "Barely know them.",
        note: "They asked you an oddly specific question earlier tonight.",
        revealPhase: 4,
      },
    ],
    phaseReveals: [
      {
        phase: 4,
        title: "A SECOND LOG ENTRY",
        content:
          "You find a second, unaltered copy of the log you edited. Someone backed it up before you touched it.",
      },
      {
        phase: 6,
        title: "THE CALL",
        content:
          "You recognize the ringtone from the 20:40 call — it matches a phone you've seen in this room tonight.",
      },
    ],
    importantClues: [{ id: "clue-core-01-a", text: "Edited the 20:48 log entry." }],
  },
  {
    id: "core-02",
    name: "CORE CHARACTER 02",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Sharp monochrome suit, a single red pin on the lapel.",
    publicBio:
      "Subject Zero's business partner. Charming in public, exacting in private.",
    secret:
      "You and Subject Zero argued violently two days ago over money neither of you has admitted to anyone.",
    whatYouKnow:
      "You know the private room was supposed to be locked all night — you have the only spare key.",
    objectives: [
      { type: "PRIMARY", text: "Find out who else has a copy of the private room key." },
      { type: "SECRET", text: "Make sure the argument from Tuesday never comes up." },
      { type: "SOCIAL", text: "Get at least one person to vouch for your alibi out loud." },
    ],
    relationships: [
      {
        characterId: "core-01",
        label: "Former colleague.",
        note: "You think she's too close to the research to see clearly.",
        revealPhase: 0,
      },
      {
        characterId: "core-03",
        label: "Old friend.",
        note: "You'd trust them with almost anything. Almost.",
        revealPhase: 0,
      },
      {
        characterId: "extended-02",
        label: "Someone you've seen before but can't place.",
        note: "Something about them feels rehearsed.",
        revealPhase: 6,
      },
    ],
    phaseReveals: [
      {
        phase: 4,
        title: "THE SPARE KEY",
        content: "Your spare key is missing from your coat pocket. You last had it at 20:50.",
      },
    ],
    importantClues: [{ id: "clue-core-02-a", text: "Holds a spare key to the private room." }],
  },
  {
    id: "core-03",
    name: "CORE CHARACTER 03",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Vintage trench coat, press badge from a defunct publication.",
    publicBio:
      "An investigative journalist who has been circling Subject Zero's project for months.",
    secret:
      "You've been recording conversations tonight without consent, hoping for a story.",
    whatYouKnow:
      "You know ORACLE is not fully automated — someone is feeding it information live.",
    objectives: [
      { type: "PRIMARY", text: "Identify who is feeding ORACLE information in real time." },
      { type: "SECRET", text: "Protect your recordings from being discovered." },
      { type: "SOCIAL", text: "Get someone to go on record about Subject Zero's past." },
    ],
    relationships: [
      {
        characterId: "core-02",
        label: "Old friend.",
        note: "You've used this friendship for access before.",
        revealPhase: 0,
      },
      {
        characterId: "optional-01",
        label: "A source, once.",
        note: "They stopped returning your calls two weeks ago.",
        revealPhase: 2,
      },
      {
        characterId: "extended-01",
        label: "Unknown connection.",
        note: "You noticed them avoiding you specifically.",
        revealPhase: 6,
      },
    ],
    phaseReveals: [
      {
        phase: 6,
        title: "A VOICE ON THE RECORDING",
        content:
          "Reviewing tonight's audio, you catch a fragment: \"...before ORACLE goes live, we need to...\" — cut off.",
      },
    ],
    importantClues: [{ id: "clue-core-03-a", text: "Has been secretly recording tonight." }],
  },
  {
    id: "extended-01",
    name: "EXTENDED CHARACTER 01",
    tier: "EXTENDED",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Lab intern badge, mismatched smart-casual.",
    publicBio: "A junior assistant on the project. Eager, slightly overwhelmed.",
    secret: "You were told to erase a file tonight and you did it without asking why.",
    whatYouKnow: "You know which laptop ORACLE's messages are actually sent from.",
    objectives: [
      { type: "PRIMARY", text: "Figure out who told you to erase the file." },
      { type: "SECRET", text: "Avoid being blamed for the missing file." },
      { type: "SOCIAL", text: "Get someone senior to protect you if this comes out." },
    ],
    relationships: [
      {
        characterId: "core-01",
        label: "Reports to you.",
        note: "",
        revealPhase: 0,
      },
      {
        characterId: "core-03",
        label: "Unknown connection.",
        note: "You've been told to avoid this person tonight.",
        revealPhase: 6,
      },
      {
        characterId: "optional-01",
        label: "Met once.",
        note: "They seemed to know more about you than they should.",
        revealPhase: 4,
      },
    ],
    phaseReveals: [
      {
        phase: 4,
        title: "THE INSTRUCTION",
        content: "The message telling you to erase the file came from an internal number, not an external one.",
      },
    ],
    importantClues: [{ id: "clue-ext-01-a", text: "Erased a file on instruction tonight." }],
  },
  {
    id: "extended-02",
    name: "EXTENDED CHARACTER 02",
    tier: "EXTENDED",
    factionId: "faction-outsiders",
    costumeSuggestion: "Elegant all-black outfit, no visible branding.",
    publicBio: "A plus-one nobody quite remembers inviting.",
    secret: "You are not who your name tag says you are.",
    whatYouKnow: "You know Subject Zero kept a second phone in the coat room.",
    objectives: [
      { type: "PRIMARY", text: "Keep your real identity from being discovered." },
      { type: "SECRET", text: "Find the second phone before the Game Master does." },
      { type: "SOCIAL", text: "Get invited into a private conversation you weren't part of." },
    ],
    relationships: [
      {
        characterId: "core-02",
        label: "Someone you've seen before but can't place.",
        note: "",
        revealPhase: 6,
      },
      {
        characterId: "core-01",
        label: "Barely know them.",
        note: "You've been asking around about her without saying why.",
        revealPhase: 4,
      },
      {
        characterId: "optional-01",
        label: "A familiar face from somewhere unrelated.",
        note: "Neither of you have acknowledged it yet.",
        revealPhase: 8,
      },
    ],
    phaseReveals: [
      {
        phase: 6,
        title: "THE SECOND PHONE",
        content: "You hear that someone found a phone in the coat room. It wasn't you.",
      },
    ],
    importantClues: [{ id: "clue-ext-02-a", text: "Is using a name that isn't theirs." }],
  },
  {
    id: "optional-01",
    name: "OPTIONAL CHARACTER 01",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Casual party wear, a single unusual accessory (your choice).",
    publicBio: "A friend of a friend. Mostly here for the free drinks.",
    secret: "You overheard something at 21:13 you haven't told anyone.",
    whatYouKnow: "You know exactly who was standing outside the private room at 21:13.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether to tell anyone what you saw at 21:13." },
      { type: "SECRET", text: "Stay out of the investigation entirely if possible." },
      { type: "SOCIAL", text: "Get two different people to each think you told only them." },
    ],
    relationships: [
      {
        characterId: "core-01",
        label: "Barely know them.",
        note: "",
        revealPhase: 4,
      },
      {
        characterId: "core-03",
        label: "A source, once.",
        note: "You're avoiding them tonight.",
        revealPhase: 2,
      },
      {
        characterId: "extended-01",
        label: "Met once.",
        note: "",
        revealPhase: 4,
      },
    ],
    phaseReveals: [
      {
        phase: 4,
        title: "WHAT YOU SAW",
        content:
          "You saw someone leave the private room at 21:13 wiping their hands on a napkin. You didn't see their face.",
      },
    ],
    importantClues: [{ id: "clue-opt-01-a", text: "Witnessed someone leaving the room at 21:13." }],
  },
];

export function getCharacter(id: string | null | undefined): Character | undefined {
  if (!id) return undefined;
  return CHARACTERS.find((c) => c.id === id);
}
