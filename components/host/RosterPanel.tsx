"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { hostFetch, hostPost } from "@/lib/client/hostApi";

interface RosterAssignment {
  username: string;
  displayUsername: string;
  characterId: string | null;
}

const TIER_ORDER = ["CORE", "EXTENDED", "OPTIONAL"];

export function RosterPanel({ characters }: { characters: any[] }) {
  const [assignments, setAssignments] = useState<RosterAssignment[]>([]);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [savingUsername, setSavingUsername] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // For pre-registering a guest who hasn't visited /preview yet.
  const [newUsername, setNewUsername] = useState("");
  const [newCharacterId, setNewCharacterId] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  async function load() {
    const res = await hostFetch("/api/host/roster");
    if (res.ok) {
      const json = await res.json();
      setAssignments(json.assignments ?? []);
    }
    setLoaded(true);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function assign(username: string, characterId: string) {
    if (!characterId) return;
    setSavingUsername(username);
    await hostPost("/api/host/roster", { username, characterId });
    setSavingUsername(null);
    load();
  }

  async function remove(username: string) {
    await hostPost("/api/host/roster", { action: "REMOVE", username });
    load();
  }

  async function addNew() {
    if (!newUsername.trim() || !newCharacterId) return;
    setAddingNew(true);
    await hostPost("/api/host/roster", { username: newUsername, characterId: newCharacterId });
    setNewUsername("");
    setNewCharacterId("");
    setAddingNew(false);
    load();
  }

  const takenIds = new Set(assignments.filter((a) => a.characterId).map((a) => a.characterId));
  const pending = assignments.filter((a) => !a.characterId);
  const assigned = assignments.filter((a) => a.characterId);

  function CharacterSelect({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-oracle-panelAlt border border-oracle-border rounded-sm px-2 py-2 text-xs text-oracle-text disabled:opacity-50"
      >
        <option value="">Character…</option>
        {TIER_ORDER.map((tier) => (
          <optgroup key={tier} label={tier}>
            {characters
              .filter((c) => c.tier === tier)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {takenIds.has(c.id) && c.id !== value ? " (assigned)" : ""}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    );
  }

  return (
    <Panel>
      <p className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-1">
        Roster
      </p>
      <p className="text-oracle-textFaint text-[11px] leading-relaxed mb-3">
        Guests pick their own username at <span className="text-oracle-text">/preview</span>{" "}
        and show up below, waiting on a character. Pick one for each of them —
        they'll see it next time they check /preview, and joining with that
        same username on the night automatically gives them that character.
      </p>

      {loaded && pending.length > 0 && (
        <div className="mb-4">
          <p className="text-oracle-amber text-[10px] uppercase tracking-widest mb-2">
            Waiting for a character ({pending.length})
          </p>
          <ul className="space-y-1">
            {pending.map((a) => (
              <li
                key={a.username}
                className="flex items-center justify-between gap-2 text-xs bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2"
              >
                <span className="text-oracle-text truncate flex-1">{a.displayUsername}</span>
                <CharacterSelect
                  value={picks[a.username] ?? ""}
                  onChange={(v) => setPicks((p) => ({ ...p, [a.username]: v }))}
                  disabled={savingUsername === a.username}
                />
                <Button
                  variant="primary"
                  className="!py-2 !text-xs whitespace-nowrap"
                  disabled={!picks[a.username] || savingUsername === a.username}
                  onClick={() => assign(a.username, picks[a.username])}
                >
                  Assign
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loaded && pending.length === 0 && assigned.length === 0 && (
        <p className="text-oracle-textFaint text-[11px] mb-3">
          Nobody's registered a username yet — send guests to{" "}
          <span className="text-oracle-text">/preview</span> to pick one. Guests
          who join on the night without a pre-assigned character get
          auto-assigned in tier order as usual.
        </p>
      )}

      {assigned.length > 0 && (
        <div>
          <p className="text-oracle-textDim text-[10px] uppercase tracking-widest mb-2">
            Assigned ({assigned.length})
          </p>
          <ul className="space-y-1">
            {assigned.map((a) => {
              const c = characters.find((ch) => ch.id === a.characterId);
              return (
                <li
                  key={a.username}
                  className="flex items-center justify-between gap-2 text-xs bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2"
                >
                  <span className="text-oracle-text truncate">{a.displayUsername}</span>
                  <span className="text-oracle-textDim flex-1 text-right truncate">
                    {c?.name ?? a.characterId}
                  </span>
                  <button
                    onClick={() => remove(a.username)}
                    className="text-oracle-redBright text-[10px] uppercase tracking-widest flex-shrink-0"
                  >
                    remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <details className="mt-4">
        <summary className="text-oracle-textFaint text-[10px] uppercase tracking-widest cursor-pointer">
          pre-register a username manually
        </summary>
        <div className="flex flex-col gap-2 sm:flex-row mt-2">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="USERNAME"
            className="flex-1 bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60"
          />
          <CharacterSelect value={newCharacterId} onChange={setNewCharacterId} />
          <Button
            variant="primary"
            className="!py-2 !text-xs whitespace-nowrap"
            disabled={addingNew || !newUsername.trim() || !newCharacterId}
            onClick={addNew}
          >
            Add
          </Button>
        </div>
      </details>
    </Panel>
  );
}
