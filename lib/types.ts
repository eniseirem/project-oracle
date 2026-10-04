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

export interface Objective {
  type: "PRIMARY" | "SECRET" | "SOCIAL";
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

export interface Character {
  id: string;
  name: string;
  tier: CharacterTier;
  factionId: string | null;
  costumeSuggestion: string;
  publicBio: string;
  secret: string;
  whatYouKnow: string;
  objectives: Objective[];
  relationships: Relationship[];
  phaseReveals: PhaseReveal[];
  importantClues: ImportantClue[];
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

export interface Vote {
  playerId: string;
  killerCharacterId: string | null;
  why: string;
  masterMindCharacterId: string | null;
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
}
