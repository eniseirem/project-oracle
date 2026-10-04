import fs from "node:fs";
import path from "node:path";
import { v4 as uuid } from "uuid";
import type {
  Character,
  EvidenceItem,
  EvidenceStatus,
  Game,
  GameEvent,
  GameEventType,
  GameState,
  OracleMessage,
  Player,
  Vote,
} from "@/lib/types";
import { CHARACTERS } from "@/lib/data/characters";
import { FACTIONS } from "@/lib/data/factions";
import { PHASES } from "@/lib/data/phases";
import { EVIDENCE_SEED } from "@/lib/data/evidence";
import { ORACLE_MESSAGES_SEED } from "@/lib/data/oracleMessages";
import { MESSAGE_PRESETS } from "@/lib/data/presets";
import { pickNextCharacter } from "@/lib/characterAssignment";

// ============================================================================
// IN-MEMORY GAME STATE
// ----------------------------------------------------------------------------
// MVP persistence: a single mutable object held on `globalThis` so it
// survives Next.js hot-reload in dev, mirrored best-effort to a JSON file
// so a local `npm run start` survives a server restart during the party.
//
// This is the one place to swap in a real database later (Redis, Postgres,
// etc.) without touching any route or UI code — every API route only ever
// calls the functions exported from this file.
// ============================================================================

const DATA_FILE = path.join(process.cwd(), ".data", "state.json");

function buildSeedState(): GameState {
  return {
    game: {
      code: "ORACLE",
      status: "ACTIVE",
      currentPhase: 0,
      votingOpen: false,
      votingLocked: false,
      revealOpen: false,
      activeAnnouncement: null,
      createdAt: new Date().toISOString(),
    },
    players: [],
    characters: structuredClone(CHARACTERS),
    factions: structuredClone(FACTIONS),
    phases: structuredClone(PHASES),
    evidence: structuredClone(EVIDENCE_SEED),
    messages: structuredClone(ORACLE_MESSAGES_SEED),
    events: [],
    votes: [],
    messagePresets: structuredClone(MESSAGE_PRESETS),
  };
}

function loadFromDisk(): GameState | null {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

function persistToDisk(state: GameState) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Best-effort only. On a read-only / serverless filesystem this simply
    // no-ops and the game continues to run from the in-memory copy.
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __ORACLE_STATE__: GameState | undefined;
}

function getStateRef(): GameState {
  if (!globalThis.__ORACLE_STATE__) {
    globalThis.__ORACLE_STATE__ = loadFromDisk() ?? buildSeedState();
  }
  return globalThis.__ORACLE_STATE__;
}

function commit(state: GameState) {
  globalThis.__ORACLE_STATE__ = state;
  persistToDisk(state);
}

export function getState(): GameState {
  return getStateRef();
}

export function resetState(): GameState {
  const fresh = buildSeedState();
  commit(fresh);
  return fresh;
}

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------

export function joinGame(realName: string, gameCode: string): Player {
  const state = getStateRef();
  // MVP: any non-empty game code is accepted.
  const character = pickNextCharacter(state.characters, state.players);
  const player: Player = {
    id: uuid(),
    realName: realName.trim() || "UNNAMED SUBJECT",
    characterId: character?.id ?? null,
    status: "ACTIVE",
    joinedAt: new Date().toISOString(),
    isHost: false,
    lastSeenEvidenceCount: 0,
    lastSeenOracleCount: 0,
    completedObjectives: [],
  };
  state.players.push(player);
  commit(state);
  return player;
}

export function getPlayer(playerId: string): Player | undefined {
  return getStateRef().players.find((p) => p.id === playerId);
}

export function markAbsent(playerId: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (player) player.status = "ABSENT";
  commit(state);
}

export function markActive(playerId: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (player) player.status = "ACTIVE";
  commit(state);
}

export function removePlayer(playerId: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (player) player.status = "REMOVED";
  commit(state);
}

export function reassignCharacter(playerId: string, characterId?: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return;
  if (characterId) {
    player.characterId = characterId;
  } else {
    const next = pickNextCharacter(
      state.characters,
      state.players.filter((p) => p.id !== playerId)
    );
    player.characterId = next?.id ?? null;
  }
  commit(state);
}

export function markObjectiveToggled(playerId: string, objectiveKey: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return;
  const idx = player.completedObjectives.indexOf(objectiveKey);
  if (idx >= 0) player.completedObjectives.splice(idx, 1);
  else player.completedObjectives.push(objectiveKey);
  commit(state);
}

export function markSeen(playerId: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return;
  player.lastSeenEvidenceCount = visibleEvidenceCountFor(state, player);
  player.lastSeenOracleCount = visibleMessagesCountFor(state, player);
  commit(state);
}

// ---------------------------------------------------------------------------
// Phase / game status
// ---------------------------------------------------------------------------

export function advancePhase(delta: 1 | -1) {
  const state = getStateRef();
  const next = Math.min(10, Math.max(0, state.game.currentPhase + delta));
  state.game.currentPhase = next;
  commit(state);
  return next;
}

export function setPhase(phase: number) {
  const state = getStateRef();
  state.game.currentPhase = Math.min(10, Math.max(0, phase));
  commit(state);
  return state.game.currentPhase;
}

export function setPaused(paused: boolean) {
  const state = getStateRef();
  state.game.status = paused ? "PAUSED" : "ACTIVE";
  commit(state);
}

export function clearAnnouncement() {
  const state = getStateRef();
  state.game.activeAnnouncement = null;
  commit(state);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export function addMessagePreset(label: string, content: string) {
  const state = getStateRef();
  state.messagePresets.push({ id: uuid(), label, content });
  commit(state);
}

export function sendMessage(input: {
  type: OracleMessage["type"];
  recipientPlayerId?: string | null;
  recipientFactionId?: string | null;
  content: string;
  confidence?: string;
}): OracleMessage {
  const state = getStateRef();
  const message: OracleMessage = {
    id: uuid(),
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: input.type,
    recipientPlayerId: input.recipientPlayerId ?? null,
    recipientFactionId: input.recipientFactionId ?? null,
    phase: state.game.currentPhase,
    content: input.content,
    confidence: input.confidence,
    sentAt: new Date().toISOString(),
  };
  state.messages.push(message);
  commit(state);
  return message;
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export function setEvidenceStatus(
  evidenceId: string,
  status: EvidenceStatus,
  opts?: { sendToPlayerId?: string }
) {
  const state = getStateRef();
  const item = state.evidence.find((e) => e.id === evidenceId);
  if (!item) return;
  item.status = status;
  if (status === "DISCOVERED" && opts?.sendToPlayerId) {
    if (!item.sentToPlayerIds.includes(opts.sendToPlayerId)) {
      item.sentToPlayerIds.push(opts.sendToPlayerId);
    }
  }
  commit(state);
}

export function moveClueToPlayer(evidenceId: string, fromPlayerId: string, toPlayerId: string) {
  const state = getStateRef();
  const item = state.evidence.find((e) => e.id === evidenceId);
  if (!item) return;
  item.sentToPlayerIds = item.sentToPlayerIds.filter((id) => id !== fromPlayerId);
  if (!item.sentToPlayerIds.includes(toPlayerId)) item.sentToPlayerIds.push(toPlayerId);
  commit(state);
}

// ---------------------------------------------------------------------------
// Scripted events / triggers
// ---------------------------------------------------------------------------

export function fireEvent(type: GameEventType) {
  const state = getStateRef();
  const event: GameEvent = { id: uuid(), type, firedAt: new Date().toISOString(), phase: state.game.currentPhase };
  state.events.push(event);

  switch (type) {
    case "FIRST_MURDER":
      state.game.currentPhase = Math.max(state.game.currentPhase, 3);
      state.game.activeAnnouncement = {
        id: uuid(),
        kind: "MURDER",
        heading: "ORACLE ALERT",
        lines: ["CRITICAL EVENT DETECTED", "SUBJECT ZERO: TERMINATED", "FINAL ASSESSMENT PROTOCOL: ACTIVATED"],
        shownAt: new Date().toISOString(),
        durationMs: 0,
      };
      break;
    case "ORACLE_PREDICTION_1":
      state.game.activeAnnouncement = {
        id: uuid(),
        kind: "PREDICTION",
        heading: "ORACLE PREDICTION #001",
        lines: ["ONE PERSON IN THIS ROOM", "IS NOT WHO THEY CLAIM TO BE."],
        shownAt: new Date().toISOString(),
        durationMs: 0,
      };
      break;
    case "RELEASE_TIMELINE_CLUE": {
      const item = state.evidence.find((e) => e.id === "003");
      if (item) item.status = "RELEASED";
      break;
    }
    case "SECOND_INCIDENT":
      state.game.currentPhase = Math.max(state.game.currentPhase, 7);
      state.game.activeAnnouncement = {
        id: uuid(),
        kind: "MURDER",
        heading: "ORACLE ALERT",
        lines: ["SECOND INCIDENT DETECTED", "ALL SUBJECTS REMAIN IN PLACE"],
        shownAt: new Date().toISOString(),
        durationMs: 0,
      };
      break;
    case "OPEN_FINAL_VOTING":
      state.game.votingOpen = true;
      state.game.votingLocked = false;
      break;
    case "BEGIN_REVEAL":
      state.game.revealOpen = true;
      state.game.activeAnnouncement = {
        id: uuid(),
        kind: "CUSTOM",
        heading: "FINAL ASSESSMENT",
        lines: ["ORACLE HAS REACHED A CONCLUSION."],
        shownAt: new Date().toISOString(),
        durationMs: 0,
      };
      break;
  }

  commit(state);
  return event;
}

export function lockVoting() {
  const state = getStateRef();
  state.game.votingLocked = true;
  commit(state);
}

export function reopenVoting() {
  const state = getStateRef();
  state.game.votingLocked = false;
  state.game.votingOpen = true;
  commit(state);
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

export function submitVote(
  playerId: string,
  data: { killerCharacterId: string | null; why: string; masterMindCharacterId: string | null }
) {
  const state = getStateRef();
  if (state.game.votingLocked) return null;
  const existing = state.votes.find((v) => v.playerId === playerId);
  const vote: Vote = {
    playerId,
    killerCharacterId: data.killerCharacterId,
    why: data.why,
    masterMindCharacterId: data.masterMindCharacterId,
    updatedAt: new Date().toISOString(),
  };
  if (existing) {
    Object.assign(existing, vote);
  } else {
    state.votes.push(vote);
  }
  commit(state);
  return vote;
}

// ---------------------------------------------------------------------------
// Visibility helpers (shared by API filtering)
// ---------------------------------------------------------------------------

export function visibleEvidenceCountFor(state: GameState, player: Player): number {
  return state.evidence.filter((e) => isEvidenceVisibleToPlayer(e, player)).length;
}

export function visibleMessagesCountFor(state: GameState, player: Player): number {
  return state.messages.filter((m) => isMessageVisibleToPlayer(state, m, player)).length;
}

export function isEvidenceVisibleToPlayer(e: EvidenceItem, player: Player): boolean {
  if (e.status === "LOCKED") return false;
  if (e.visibility === "PUBLIC") return e.status === "AVAILABLE" || e.status === "RELEASED";
  // PRIVATE evidence only visible once specifically sent to this player (or discovered by them)
  return e.sentToPlayerIds.includes(player.id);
}

export function isMessageVisibleToPlayer(
  state: GameState,
  m: OracleMessage,
  player: Player
): boolean {
  if (!m.sentAt) return false;
  if (m.type === "GLOBAL") return true;
  if (m.type === "PRIVATE") return m.recipientPlayerId === player.id;
  if (m.type === "FACTION") {
    const character = state.characters.find((c) => c.id === player.characterId);
    return !!character && character.factionId === m.recipientFactionId;
  }
  return false;
}

export function getCharacterById(state: GameState, id?: string | null): Character | undefined {
  if (!id) return undefined;
  return state.characters.find((c) => c.id === id);
}
