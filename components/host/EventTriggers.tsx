"use client";

import { Panel, PanelHeader } from "@/components/ui/Panel";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { hostPost } from "@/lib/client/hostApi";
import type { GameEventType } from "@/lib/types";

const TRIGGERS: { type: GameEventType; label: string }[] = [
  { type: "FIRST_MURDER", label: "FIRST MURDER" },
  { type: "ORACLE_PREDICTION_1", label: "ORACLE PREDICTION #1" },
  { type: "RELEASE_TIMELINE_CLUE", label: "RELEASE TIMELINE CLUE" },
  { type: "SECOND_INCIDENT", label: "SECOND INCIDENT" },
  { type: "OPEN_FINAL_VOTING", label: "OPEN FINAL VOTING" },
  { type: "BEGIN_REVEAL", label: "BEGIN REVEAL" },
];

export function EventTriggers({ onChanged }: { onChanged: () => void }) {
  async function fire(type: GameEventType) {
    await hostPost("/api/host/event", { type });
    onChanged();
  }

  return (
    <Panel>
      <PanelHeader>Story Triggers</PanelHeader>
      <div className="grid grid-cols-2 gap-2">
        {TRIGGERS.map((t) => (
          <ConfirmButton
            key={t.type}
            label={t.label}
            confirmLabel={`FIRE: ${t.label}?`}
            variant="danger"
            onConfirm={() => fire(t.type)}
          />
        ))}
      </div>
    </Panel>
  );
}
