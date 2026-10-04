"use client";

import { useEffect, useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { hostPost } from "@/lib/client/hostApi";

export function MessageComposer({
  players,
  factions,
  presets,
  quickTargetPlayerId,
  onChanged,
}: {
  players: any[];
  factions: any[];
  presets: { id: string; label: string; content: string }[];
  quickTargetPlayerId: string | null;
  onChanged: () => void;
}) {
  const [recipientType, setRecipientType] = useState<"everyone" | "single" | "faction">("everyone");
  const [recipientPlayerId, setRecipientPlayerId] = useState("");
  const [recipientFactionId, setRecipientFactionId] = useState("");
  const [content, setContent] = useState("");
  const [confidence, setConfidence] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (quickTargetPlayerId) {
      setRecipientType("single");
      setRecipientPlayerId(quickTargetPlayerId);
    }
  }, [quickTargetPlayerId]);

  async function send() {
    if (!content.trim()) return;
    setSending(true);
    setSent(false);
    await hostPost("/api/host/message", {
      recipientType,
      recipientPlayerId: recipientType === "single" ? recipientPlayerId : undefined,
      recipientFactionId: recipientType === "faction" ? recipientFactionId : undefined,
      content,
      confidence: confidence || undefined,
    });
    setSending(false);
    setSent(true);
    setContent("");
    setConfidence("");
    onChanged();
  }

  return (
    <Panel>
      <PanelHeader>Message Composer</PanelHeader>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-oracle-textDim mb-1">Recipient</p>
          <div className="grid grid-cols-3 gap-2">
            {(["everyone", "single", "faction"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRecipientType(t)}
                className={`text-[11px] uppercase tracking-wide py-2 rounded-sm border ${
                  recipientType === t
                    ? "bg-oracle-red/80 border-oracle-red text-white"
                    : "border-oracle-border text-oracle-textDim"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {recipientType === "single" && (
          <select
            value={recipientPlayerId}
            onChange={(e) => setRecipientPlayerId(e.target.value)}
            className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-sm text-oracle-text"
          >
            <option value="">— SELECT PLAYER —</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.realName} ({p.characterName})
              </option>
            ))}
          </select>
        )}

        {recipientType === "faction" && (
          <select
            value={recipientFactionId}
            onChange={(e) => setRecipientFactionId(e.target.value)}
            className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-sm text-oracle-text"
          >
            <option value="">— SELECT FACTION —</option>
            {factions.map((f: any) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="MESSAGE CONTENT…"
          className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-sm text-oracle-text"
        />

        <input
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          placeholder="CONFIDENCE % (optional, e.g. 91.2)"
          className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text"
        />

        <div>
          <p className="text-[10px] uppercase tracking-widest text-oracle-textDim mb-1">Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setContent(preset.content)}
                className="text-[10px] uppercase tracking-wide px-3 py-2 rounded-sm bg-oracle-panelAlt border border-oracle-border text-oracle-textDim hover:text-oracle-text"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" full disabled={sending || !content.trim()} onClick={send}>
            {sending ? "SENDING…" : "SEND NOW"}
          </Button>
          <Button
            variant="secondary"
            full
            disabled={!content.trim()}
            onClick={async () => {
              const label = window.prompt("Preset name:");
              if (!label) return;
              await hostPost("/api/host/preset", { label, content });
              onChanged();
            }}
          >
            SAVE AS PRESET
          </Button>
        </div>
        {sent && (
          <p className="text-center text-oracle-textDim text-xs uppercase tracking-widest">
            Message sent.
          </p>
        )}
      </div>
    </Panel>
  );
}
