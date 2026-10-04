import type { Character, EvidenceItem, GameState, Player, PhaseReveal, Relationship } from "@/lib/types";
import { isEvidenceVisibleToPlayer, isMessageVisibleToPlayer } from "@/lib/store";

export interface PublicEvidenceCard {
  id: string;
  title: string | null;
  description: string | null;
  visibility: EvidenceItem["visibility"];
  status: EvidenceItem["status"];
  authenticity?: EvidenceItem["authenticity"];
  locked: boolean;
}

export function toPublicEvidenceCard(e: EvidenceItem, visible: boolean): PublicEvidenceCard {
  if (!visible) {
    return {
      id: e.id,
      title: null,
      description: null,
      visibility: e.visibility,
      status: "LOCKED",
      locked: true,
    };
  }
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    visibility: e.visibility,
    status: e.status,
    authenticity: e.authenticity,
    locked: false,
  };
}

export function visiblePhaseReveals(character: Character, currentPhase: number) {
  return character.phaseReveals.map((r: PhaseReveal) => ({
    phase: r.phase,
    title: r.phase <= currentPhase ? r.title : "CLASSIFIED",
    content: r.phase <= currentPhase ? r.content : null,
    locked: r.phase > currentPhase,
  }));
}

export function visibleRelationships(
  state: GameState,
  character: Character,
  currentPhase: number
) {
  return character.relationships
    .filter((r: Relationship) => r.revealPhase <= currentPhase)
    .map((r) => {
      const other = state.characters.find((c) => c.id === r.characterId);
      return {
        characterId: r.characterId,
        name: other?.name ?? "UNKNOWN SUBJECT",
        label: r.label,
        note: r.note,
      };
    });
}

export function buildPlayerPayload(state: GameState, player: Player) {
  const character = state.characters.find((c) => c.id === player.characterId) ?? null;
  const currentPhase = state.game.currentPhase;

  const evidence = state.evidence.map((e) =>
    toPublicEvidenceCard(e, isEvidenceVisibleToPlayer(e, player))
  );

  const messages = state.messages
    .filter((m) => isMessageVisibleToPlayer(state, m, player))
    .sort((a, b) => (a.sentAt! < b.sentAt! ? -1 : 1));

  const newEvidenceCount = Math.max(
    0,
    evidence.filter((e) => !e.locked).length - player.lastSeenEvidenceCount
  );
  const newMessageCount = Math.max(0, messages.length - player.lastSeenOracleCount);

  return {
    game: {
      currentPhase,
      status: state.game.status,
      votingOpen: state.game.votingOpen,
      votingLocked: state.game.votingLocked,
      revealOpen: state.game.revealOpen,
      activeAnnouncement: state.game.activeAnnouncement,
    },
    player: {
      id: player.id,
      realName: player.realName,
      status: player.status,
      completedObjectives: player.completedObjectives,
    },
    character: character
      ? {
          id: character.id,
          name: character.name,
          tier: character.tier,
          costumeSuggestion: character.costumeSuggestion,
          publicBio: character.publicBio,
          secret: character.secret,
          whatYouKnow: character.whatYouKnow,
          objectives: character.objectives,
          relationships: visibleRelationships(state, character, currentPhase),
          phaseReveals: visiblePhaseReveals(character, currentPhase),
        }
      : null,
    evidence,
    messages,
    badges: {
      evidence: newEvidenceCount,
      oracle: newMessageCount,
    },
    allCharacterNames: state.characters.map((c) => ({ id: c.id, name: c.name })),
  };
}

export function buildDisplayPayload(state: GameState) {
  return {
    currentPhase: state.game.currentPhase,
    status: state.game.status,
    activeAnnouncement: state.game.activeAnnouncement,
    votingOpen: state.game.votingOpen,
    revealOpen: state.game.revealOpen,
  };
}

export function buildHostPayload(state: GameState) {
  return {
    game: state.game,
    players: state.players.map((p) => {
      const character = state.characters.find((c) => c.id === p.characterId);
      return {
        id: p.id,
        realName: p.realName,
        characterId: p.characterId,
        characterName: character?.name ?? "UNASSIGNED",
        tier: character?.tier ?? null,
        factionId: character?.factionId ?? null,
        status: p.status,
        importantClue: character?.importantClues?.[0]?.text ?? null,
      };
    }),
    characters: state.characters,
    factions: state.factions,
    phases: state.phases,
    evidence: state.evidence,
    messages: state.messages
      .filter((m) => m.sentAt)
      .sort((a, b) => (a.sentAt! < b.sentAt! ? 1 : -1)),
    messagePresets: state.messagePresets,
    events: state.events,
    votes: state.votes,
  };
}
