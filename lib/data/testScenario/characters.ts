import type { Character } from "@/lib/types";

// ============================================================================
// TEST SCENARIO — "TRIVIA NIGHT: THE OVERRIDE"
// ----------------------------------------------------------------------------
// A short, throwaway mystery with its own cast, unrelated to the real
// half-birthday story in lib/data/characters.ts. It exists purely so you can
// run a 20-30 minute dry run with 3-4 friends online and pressure-test the
// app (phases, evidence drops, ORACLE messages, voting) without touching or
// risking any spoilers from the real party. Loaded instead of the real
// roster only when ORACLE_SCENARIO=test is set (see lib/store.ts) — never on
// your real deployment.
//
// Only 4 CORE characters — plenty for 3-4 players (pickNextCharacter just
// leaves the 4th unused if only 3 join).
//
// THE QUIZMASTER (the "victim" — collapses after announcing she's found
// proof the scoring's been rigged) is played by whoever's running the test,
// the same way you play Subject Zero in the real game. She is not a
// character card.
//
// THE SOLUTION (for whoever's running this test):
// - WHO CRASHED THE FINAL ROUND? -> THE RIVAL (test-01). Real motive: a
//   screaming match last week over a thrown-out question. Went to confront
//   the Quizmaster backstage and panicked.
// - WHO'S BEEN RIGGING THE SCORES? -> THE ORGANIZER (test-02). Has been
//   quietly tuning the scoring app for months to favor friends. The
//   Quizmaster found the override log tonight — unrelated to the
//   backstage confrontation, and neither of them knows about the other.
export const CHARACTERS: Character[] = [
  {
    id: "test-01",
    name: "THE RIVAL",
    tier: "CORE",
    factionId: "test-faction-league",
    costumeSuggestion:
      "Something competitive-looking — a team jersey, a lanyard full of pins, anything a little try-hard. Optional.",
    accentColor: { name: "Scoreboard Red", hex: "#c23b3b" },
    publicBio:
      "A fiercely competitive regular on the rival team. Has never once let a disputed answer go.",
    secret:
      "You and the Quizmaster had a screaming match last week over a thrown-out question that cost your team the season. You went backstage tonight to \"talk it out\" and it went further than you meant.",
    whatYouKnow: "You know the backstage door was supposed to be locked during the final round.",
    objectives: [
      { type: "PRIMARY", text: "Find out who else was backstage during the final round." },
      { type: "SECRET", text: "Keep the argument from last week from coming up." },
      { type: "SOCIAL", text: "Get someone to vouch for where you were tonight." },
    ],
    relationships: [
      { characterId: "test-02", label: "Runs the scoring app.", note: "You've never fully trusted the scoring, honestly.", revealPhase: 0 },
      { characterId: "test-04", label: "Friendly rival, different team.", note: "Respect, grudgingly.", revealPhase: 0 },
    ],
    phaseReveals: [
      { phase: 4, title: "THE DROPPED PIN", content: "One of your team pins is missing from your lanyard. You last noticed it was there right before you went backstage." },
    ],
    importantClues: [{ id: "clue-test-01-a", text: "Went backstage during the final round after a heated history with the Quizmaster." }],
  },
  {
    id: "test-02",
    name: "THE ORGANIZER",
    tier: "CORE",
    factionId: "test-faction-crew",
    costumeSuggestion: "Minimal, practical, laptop bag never far away. Optional.",
    accentColor: { name: "Terminal Grey", hex: "#55585c" },
    publicBio:
      "Runs the scoring app behind the scenes. Nobody really understands how the scoring algorithm works — including, it turns out, the Quizmaster.",
    secret:
      "You've been quietly tuning the scoring app's assistant for months to nudge results toward a few favorite regulars. Nothing you'd call cheating — just encouragement. The Quizmaster found the override log tonight and was about to announce it to everyone.",
    whatYouKnow: "You know tonight's \"surprise announcement\" was never going to be good news for you.",
    objectives: [
      { type: "PRIMARY", text: "Keep anyone from connecting you to the override log." },
      { type: "SECRET", text: "Find out how much the Quizmaster told other people before tonight." },
      { type: "SOCIAL", text: "Get someone to describe the scoring glitches back to you without realizing they're describing your own work." },
    ],
    relationships: [
      { characterId: "test-01", label: "A regular you've tuned the scores toward, a little.", note: "They have no idea. You'd like to keep it that way.", revealPhase: 6 },
      { characterId: "test-03", label: "Newer face.", note: "Asks more technical questions than you'd like.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "A SLIP", content: "You almost explained how the override log works before anyone asked. You hope nobody noticed how specific that was." },
    ],
    importantClues: [{ id: "clue-test-02-a", text: "Has been quietly adjusting trivia scores for months." }],
  },
  {
    id: "test-03",
    name: "THE NEWBIE",
    tier: "CORE",
    factionId: "test-faction-league",
    costumeSuggestion: "Casual, a little overdressed for trivia night. Optional.",
    accentColor: { name: "Electric Violet", hex: "#7a3ff0" },
    publicBio: "Third week coming to trivia night. Still learning everyone's dynamics.",
    secret: "You overheard raised voices backstage during the final round and didn't tell anyone.",
    whatYouKnow: "You know exactly who went backstage, and roughly when.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether to tell anyone what you overheard." },
      { type: "SECRET", text: "Figure out if trivia night is always this dramatic." },
      { type: "SOCIAL", text: "Get invited back next month." },
    ],
    relationships: [
      { characterId: "test-01", label: "You saw them head backstage.", note: "You didn't think much of it until now.", revealPhase: 4 },
      { characterId: "test-04", label: "The only person who's been nice to you so far.", note: "", revealPhase: 0 },
    ],
    phaseReveals: [
      { phase: 4, title: "WHAT YOU HEARD", content: "You definitely heard two raised voices backstage during the final round, right before everything went sideways. You couldn't make out words, just tone." },
    ],
    importantClues: [{ id: "clue-test-03-a", text: "Overheard an argument backstage during the final round." }],
  },
  {
    id: "test-04",
    name: "THE REGULAR",
    tier: "CORE",
    factionId: "test-faction-league",
    costumeSuggestion: "A long-running team t-shirt, clearly worn many times. Optional.",
    accentColor: { name: "House Gold", hex: "#b8903a" },
    publicBio: "Has been coming to trivia night for three years. Knows everyone's usual seat.",
    secret: "You've noticed the scoring \"feel wrong\" for months and said nothing because your team kept winning.",
    whatYouKnow: "You know the scoring app has had unexplained hiccups for a while now.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether your team's win streak is actually earned." },
      { type: "SECRET", text: "Avoid being the one who brings this up out loud." },
      { type: "SOCIAL", text: "Get someone else to say it first." },
    ],
    relationships: [
      { characterId: "test-02", label: "Friendly with them.", note: "You've always assumed the glitches were just bugs.", revealPhase: 6 },
      { characterId: "test-03", label: "The newest face at trivia night.", note: "You've been trying to make them feel welcome.", revealPhase: 0 },
    ],
    phaseReveals: [
      { phase: 8, title: "THE PATTERN", content: "Looking back at a few months of scores, the \"glitches\" always seem to land the same direction. You hadn't put that together until just now." },
    ],
    importantClues: [{ id: "clue-test-04-a", text: "Noticed the scoring app's glitches always favor the same handful of people." }],
  },
];

// Server-side only (see lib/store.ts) — same shape as the real game's
// SOLUTION export in lib/data/characters.ts.
export const SOLUTION = {
  killerCharacterId: "test-01",
  mastermindCharacterId: "test-02",
};
