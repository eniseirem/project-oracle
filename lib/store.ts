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
import { CHARACTERS, SOLUTION } from "@/lib/data/characters";
import { FACTIONS } from "@/lib/data/factions";
import { PHASES } from "@/lib/data/phases";
import { EVIDENCE_SEED } from "@/lib/data/evidence";
import { ORACLE_MESSAGES_SEED } from "@/lib/data/oracleMessages";
import { MESSAGE_PRESETS } from "@/lib/data/presets";
import { CHARACTERS as TEST_CHARACTERS, SOLUTION as TEST_SOLUTION } from "@/lib/data/testScenario/characters";
import { FACTIONS as TEST_FACTIONS } from "@/lib/data/testScenario/factions";
import { EVIDENCE_SEED as TEST_EVIDENCE_SEED } from "@/lib/data/testScenario/evidence";
import { ORACLE_MESSAGES_SEED as TEST_ORACLE_MESSAGES_SEED } from "@/lib/data/testScenario/oracleMessages";
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
//
// SCENARIO TOGGLE: setting ORACLE_SCENARIO=test on a deployment's
// environment loads the short, unrelated dry-run mystery under
// lib/data/testScenario/* instead of the real story in lib/data/*. This is
// meant for a completely separate deployment (a second Render service, or a
// local run) used to pressure-test the app with 3-4 friends online — it
// never touches, risks, or mixes with the real deployed game.
// ============================================================================

const IS_TEST_SCENARIO = process.env.ORACLE_SCENARIO === "test";

const ACTIVE_CHARACTERS = IS_TEST_SCENARIO ? TEST_CHARACTERS : CHARACTERS;
const ACTIVE_FACTIONS = IS_TEST_SCENARIO ? TEST_FACTIONS : FACTIONS;
const ACTIVE_EVIDENCE_SEED = IS_TEST_SCENARIO ? TEST_EVIDENCE_SEED : EVIDENCE_SEED;
const ACTIVE_ORACLE_MESSAGES_SEED = IS_TEST_SCENARIO ? TEST_ORACLE_MESSAGES_SEED : ORACLE_MESSAGES_SEED;
const ACTIVE_SOLUTION = IS_TEST_SCENARIO ? TEST_SOLUTION : SOLUTION;

const DATA_FILE = path.join(process.cwd(), ".data", IS_TEST_SCENARIO ? "state.test.json" : "state.json");

function buildSeedState(): GameState {
  return {
    game: {
      code: IS_TEST_SCENARIO ? "ORACLETEST" : "ORACLE",
      status: "ACTIVE",
      currentPhase: 0,
      votingOpen: false,
      votingLocked: false,
      revealOpen: false,
      activeAnnouncement: null,
      createdAt: new Date().toISOString(),
    },
    players: [],
    characters: structuredClone(ACTIVE_CHARACTERS),
    factions: structuredClone(ACTIVE_FACTIONS),
    phases: structuredClone(PHASES),
    evidence: structuredClone(ACTIVE_EVIDENCE_SEED),
    messages: structuredClone(ACTIVE_ORACLE_MESSAGES_SEED),
    events: [],
    votes: [],
    messagePresets: structuredClone(MESSAGE_PRESETS),
    rosterAssignments: [],
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
  // Backfill for state persisted on disk before rosterAssignments existed.
  if (!globalThis.__ORACLE_STATE__.rosterAssignments) {
    globalThis.__ORACLE_STATE__.rosterAssignments = [];
  }
  // Backfill for state persisted on disk before the points system existed.
  for (const p of globalThis.__ORACLE_STATE__.players) {
    if (!p.objectiveCompletions) p.objectiveCompletions = [];
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

  // RESUME: if someone with this exact name (case/whitespace-insensitive —
  // same normalization as the roster's usernames) has already joined and
  // isn't REMOVED, hand back that same player record instead of minting a
  // new one. This is what lets a guest who accidentally logs out, closes
  // the tab, or switches devices get back to exactly where they were —
  // same character, same evidence they've received, same objectives
  // they've claimed, same vote — just by typing their name/username again.
  const key = normalizeUsername(realName);
  const existingPlayer = key
    ? state.players.find((p) => p.status !== "REMOVED" && normalizeUsername(p.realName) === key)
    : undefined;
  if (existingPlayer) {
    if (existingPlayer.status === "ABSENT") existingPlayer.status = "ACTIVE";
    if (!existingPlayer.objectiveCompletions) existingPlayer.objectiveCompletions = [];
    commit(state);
    return existingPlayer;
  }

  // If the host pre-assigned this username to a specific character (via the
  // host dashboard's roster panel), honor that instead of auto-picking —
  // unless that character is already held by another active player (e.g. a
  // duplicate join under the same name), in which case fall back to the
  // normal tier-based pick rather than double-casting a role.
  const assigned = getCharacterForUsername(realName);
  const assignedTaken =
    !!assigned &&
    state.players.some(
      (p) => p.status !== "REMOVED" && p.characterId === assigned.id
    );
  const character =
    assigned && !assignedTaken ? assigned : pickNextCharacter(state.characters, state.players);
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
    objectiveCompletions: [],
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

// ---------------------------------------------------------------------------
// Roster (pre-party username → character assignments)
// ---------------------------------------------------------------------------

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

// Guest-initiated: called when someone types a brand-new username at
// /preview. Creates a pending (characterId: null) slot if this username
// hasn't been seen before; if it has, leaves whatever's already there alone
// (so re-visiting /preview never clobbers a host's assignment). Always
// returns the resulting assignment.
export function registerUsername(username: string) {
  const state = getStateRef();
  const key = normalizeUsername(username);
  if (!key) return null;
  const existing = state.rosterAssignments.find((r) => r.username === key);
  if (existing) return existing;
  const created = { username: key, displayUsername: username.trim(), characterId: null };
  state.rosterAssignments.push(created);
  commit(state);
  return created;
}

export function setRosterAssignment(username: string, characterId: string) {
  const state = getStateRef();
  const key = normalizeUsername(username);
  if (!key) return;
  const existing = state.rosterAssignments.find((r) => r.username === key);
  if (existing) {
    existing.characterId = characterId;
    existing.displayUsername = username.trim();
  } else {
    state.rosterAssignments.push({ username: key, displayUsername: username.trim(), characterId });
  }
  commit(state);
}

export function removeRosterAssignment(username: string) {
  const state = getStateRef();
  const key = normalizeUsername(username);
  state.rosterAssignments = state.rosterAssignments.filter((r) => r.username !== key);
  commit(state);
}

export function getRosterAssignments() {
  return getStateRef().rosterAssignments;
}

export function getRosterAssignmentFor(username: string) {
  const state = getStateRef();
  const key = normalizeUsername(username);
  if (!key) return null;
  return state.rosterAssignments.find((r) => r.username === key) ?? null;
}

export function getCharacterForUsername(username: string): Character | null {
  const state = getStateRef();
  const key = normalizeUsername(username);
  if (!key) return null;
  const assignment = state.rosterAssignments.find((r) => r.username === key);
  if (!assignment || !assignment.characterId) return null;
  return state.characters.find((c) => c.id === assignment.characterId) ?? null;
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

// ---------------------------------------------------------------------------
// Scoring
// ----------------------------------------------------------------------------
// Each objective type has a base value; claiming it earlier in the night
// (lower game phase) adds a bonus on top, capped so there's no reward for
// claiming something before it's even plausible. Once a claim is locked in
// its points never change, even if this formula later does — see
// ObjectiveCompletion in lib/types.ts. A correct final accusation (vote vs.
// the real SOLUTION for this scenario) adds a one-time bonus of its own,
// computed in computeLeaderboard — guessing the killer (what players are
// actually asked) is worth more than guessing the hidden second culprit.
// ---------------------------------------------------------------------------

const BASE_OBJECTIVE_POINTS: Record<string, number> = {
  PRIMARY: 30,
  SECRET: 35,
  SOCIAL: 20,
  BONUS: 10,
};

const KILLER_GUESS_POINTS = 50;
const MASTERMIND_GUESS_POINTS = 30;

export function computeObjectivePoints(type: string, phaseCompleted: number): number {
  const base = BASE_OBJECTIVE_POINTS[type] ?? 15;
  const earlyBonus = Math.max(0, 8 - phaseCompleted) * 3; // up to +24 at phase 0, +0 from phase 8 on
  return base + earlyBonus;
}

// Player-initiated, one-way: once claimed it stays claimed (the Game
// Master can revoke it from the host dashboard, but the player can't
// un-claim it themselves — that's what keeps the early-claim bonus honest).
export function claimObjective(playerId: string, characterId: string, type: string) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return null;
  if (!player.objectiveCompletions) player.objectiveCompletions = [];
  const objectiveKey = `${characterId}:${type}`;
  const existing = player.objectiveCompletions.find((c) => c.objectiveKey === objectiveKey);
  if (existing) return existing; // already claimed (or revoked) — no-op either way
  const phaseCompleted = state.game.currentPhase;
  const completion = {
    objectiveKey,
    type: type as any,
    phaseCompleted,
    points: computeObjectivePoints(type, phaseCompleted),
    revoked: false,
    completedAt: new Date().toISOString(),
  };
  player.objectiveCompletions.push(completion);
  commit(state);
  return completion;
}

export function setObjectiveCompletionRevoked(playerId: string, objectiveKey: string, revoked: boolean) {
  const state = getStateRef();
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return;
  const completion = (player.objectiveCompletions ?? []).find((c) => c.objectiveKey === objectiveKey);
  if (!completion) return;
  completion.revoked = revoked;
  commit(state);
}

// Host-facing scoreboard: live at any time (so the Game Master can keep an
// eye on it mid-game and revoke bad claims), including the final-accusation
// bonus once that player has a vote on file. This is never sent to players
// directly — the player-facing /api/leaderboard route only exposes it once
// the Game Master opens the reveal (game.revealOpen), and strips everything
// but name/points/rank.
export function computeLeaderboard(state: GameState) {
  return state.players
    .filter((p) => p.status !== "REMOVED")
    .map((p) => {
      const character = state.characters.find((c) => c.id === p.characterId);
      const completions = (p.objectiveCompletions ?? []).filter((c) => !c.revoked);
      const objectivePoints = completions.reduce((sum, c) => sum + c.points, 0);
      const vote = state.votes.find((v) => v.playerId === p.id);
      let finalGuessPoints = 0;
      let finalGuessCorrect: "KILLER" | "MASTERMIND" | "NO" | "NONE" = "NONE";
      if (vote && vote.accusedCharacterId) {
        if (vote.accusedCharacterId === ACTIVE_SOLUTION.killerCharacterId) {
          finalGuessPoints = KILLER_GUESS_POINTS;
          finalGuessCorrect = "KILLER";
        } else if (vote.accusedCharacterId === ACTIVE_SOLUTION.mastermindCharacterId) {
          finalGuessPoints = MASTERMIND_GUESS_POINTS;
          finalGuessCorrect = "MASTERMIND";
        } else {
          finalGuessCorrect = "NO";
        }
      }
      return {
        playerId: p.id,
        realName: p.realName,
        characterName: character?.name ?? "UNASSIGNED",
        status: p.status,
        objectivePoints,
        finalGuessPoints,
        finalGuessCorrect,
        total: objectivePoints + finalGuessPoints,
        completions,
      };
    })
    .sort((a, b) => b.total - a.total);
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
  data: { accusedCharacterId: string | null; why: string }
) {
  const state = getStateRef();
  if (state.game.votingLocked) return null;
  const existing = state.votes.find((v) => v.playerId === playerId);
  const vote: Vote = {
    playerId,
    accusedCharacterId: data.accusedCharacterId,
    why: data.why,
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
