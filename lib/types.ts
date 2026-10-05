// ============================================================================
// PROJECT ORACLE — core data model
// ----------------------------------------------------------------------------
// This file defines the SHAPE of the game. It has no story content in it.
// All actual story content (characters, evidence, messages, timeline) lives
// under lib/data/*. To install the real murder mystery later, replace the
// contents of lib/data/* with the final files — these types should not need
// to change.
// ============================================================================

export type CharacterTier = "CORE" | "EXTENDED" | "OPTIONAL";

export type PlayerStatus = "ACTIVE" | "ABSENT" | "REMOVED";

export type EvidenceVisibility = "PUBLIC" | "PRIVATE";

export type EvidenceStatus = "LOCKED" | "AVAILABLE" | "RELEASED" | "DISCOVERED";

export type OracleMessageType = "GLOBAL" | "PRIVATE" | "FACTION";

export type GameStatus = "ACTIVE" | "PAUSED";

// Phase 0-10. The numeric value IS the identity — content is "unlocked" by
// comparing its own `phase` field against game.currentPhase.
export interface Phase {
  id: number;
  code: string; // e.g. "PRE-PARTY"
  label: string; // e.g. "0 — PRE-PARTY"
}

export interface Faction {
  id: string;
  name: string;
  description?: string;
  color?: string; // optional accent used sparingly in the UI
}

export interface Relationship {
  characterId: string; // the other character
  label: string; // e.g. "Former colleague."
  note: string; // e.g. "You don't trust her."
  revealPhase: number; // relationship becomes visible at/after this phase
}

// BONUS objectives are small, just-for-fun side challenges (easter eggs,
// in-jokes) — they award points like anything else, but are never required
// and never touch the actual mystery.
export interface Objective {
  type: "PRIMARY" | "SECRET" | "SOCIAL" | "BONUS";
  text: string;
}

export interface PhaseReveal {
  phase: number;
  title: string;
  content: string;
}

export interface ImportantClue {
  id: string;
  text: string;
}

export interface AccentColor {
  name: string; // e.g. "Signal Red" — shown on the character sheet and in-app
  hex: string; // e.g. "#b2302f" — for swatches/UI only, never the clue itself
}

export interface Character {
  id: string;
  name: string;
  tier: CharacterTier;
  factionId: string | null;
  costumeSuggestion: string;
  accentColor: AccentColor;
  publicBio: string;
  secret: string;
  whatYouKnow: string;
  objectives: Objective[];
  relationships: Relationship[];
  phaseReveals: PhaseReveal[];
  importantClues: ImportantClue[];
}

// A player self-claims an objective once they believe they've actually done
// it. `objectiveKey` is `${characterId}:${objectiveType}` (stable, since a
// character has exactly one objective per type — no need to hand-id every
// objective in lib/data/*). `points` is locked in at the moment of the
// claim (base value for the type + an early-claim bonus based on the game
// phase at that moment — see computeObjectivePoints in lib/store.ts), so it
// never silently changes later even if the scoring formula does. A claim is
// one-directional from the player's side — they can't un-claim it — but the
// Game Master can set `revoked` from the host dashboard if a claim turns
// out to be bogus; a revoked claim is excluded from totals.
export interface ObjectiveCompletion {
  objectiveKey: string;
  type: Objective["type"];
  phaseCompleted: number;
  points: number;
  revoked: boolean;
  completedAt: string;
}

// The two true culprits for a scenario, used only server-side to score the
// final accusation (lib/store.ts) — never sent to any player or host payload
// directly. Lives in lib/data/characters.ts (and lib/data/testScenario/).
export interface GameSolution {
  killerCharacterId: string;
  mastermindCharacterId: string;
}

export interface Player {
  id: string;
  realName: string;
  characterId: string | null;
  status: PlayerStatus;
  joinedAt: string;
  isHost: boolean;
  lastSeenEvidenceCount: number;
  lastSeenOracleCount: number;
  completedObjectives: string[]; // objective text keys the player checked off, cosmetic only
  objectiveCompletions: ObjectiveCompletion[]; // the real, scored claims
}

export interface EvidenceItem {
  id: string; // e.g. "003"
  title: string;
  description: string;
  visibility: EvidenceVisibility;
  status: EvidenceStatus;
  unlockPhase: number;
  authenticity?: "VERIFIED" | "UNVERIFIED" | "DISPUTED";
  sentToPlayerIds: string[]; // which players have privately received this
}

export interface OracleMessage {
  id: string;
  timestamp: string; // display string e.g. "21:44"
  type: OracleMessageType;
  recipientPlayerId?: string | null; // PRIVATE
  recipientFactionId?: string | null; // FACTION
  phase: number;
  content: string;
  confidence?: string; // optional "91.2%" style flourish
  sentAt?: string; // ISO, when actually sent by GM (undefined = not yet sent / preset)
}

export type GameEventType =
  | "FIRST_MURDER"
  | "ORACLE_PREDICTION_1"
  | "RELEASE_TIMELINE_CLUE"
  | "SECOND_INCIDENT"
  | "OPEN_FINAL_VOTING"
  | "BEGIN_REVEAL";

export interface GameEvent {
  id: string;
  type: GameEventType;
  firedAt: string; // ISO
  phase: number;
}

// Players only ever get asked ONE accusation question in-app — "who do you
// believe is behind what happened tonight?" — on purpose. The killer and the
// mastermind are two different, fixed story facts (see lib/data/characters.ts)
// that the Game Master already knows; the vote is just the group's guess, and
// the fact there were two separate culprits at all is withheld as the final
// reveal rather than hinted at by the voting UI itself.
export interface Vote {
  playerId: string;
  accusedCharacterId: string | null;
  why: string;
  updatedAt: string;
}

export interface DisplayAnnouncement {
  id: string;
  kind: "MURDER" | "PREDICTION" | "CUSTOM";
  heading: string;
  lines: string[];
  shownAt: string;
  durationMs: number;
}

export interface Game {
  code: string;
  status: GameStatus;
  currentPhase: number;
  votingOpen: boolean;
  votingLocked: boolean;
  revealOpen: boolean;
  activeAnnouncement: DisplayAnnouncement | null;
  createdAt: string;
}

// A guest picks their own username at /preview (self-registering a slot with
// no character yet); the host then assigns a character to that username from
// the roster panel on /host. Once assigned, that username always resolves to
// that character, whether they're just previewing before the party (/preview)
// or actually joining it (/join). `username` is normalized (trimmed,
// lowercased) for matching; `displayUsername` keeps the guest's original
// casing for the roster panel. `characterId` is null while the host hasn't
// assigned anyone yet.
export interface RosterAssignment {
  username: string;
  displayUsername: string;
  characterId: string | null;
}

export interface GameState {
  game: Game;
  players: Player[];
  characters: Character[];
  factions: Faction[];
  phases: Phase[];
  evidence: EvidenceItem[];
  messages: OracleMessage[];
  events: GameEvent[];
  votes: Vote[];
  messagePresets: { id: string; label: string; content: string }[];
  rosterAssignments: RosterAssignment[];
}
