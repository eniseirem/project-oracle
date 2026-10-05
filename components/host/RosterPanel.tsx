"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { hostFetch, hostPost } from "@/lib/client/hostApi";

interface RosterAssignment {
  username: string;
  displayUsername: string;
  characterId: string;
}

const TIER_ORDER = ["CORE", "EXTENDED", "OPTIONAL"];

export function RosterPanel({ characters }: { characters: any[] }) {
  const [assignments, setAssignments] = useState<RosterAssignment[]>([]);
  const [username, setUsername] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  async function assign() {
    if (!username.trim() || !characterId) return;
    setLoading(true);
    await hostPost("/api/host/roster", { username, characterId });
    setUsername("");
    setCharacterId("");
    setLoading(false);
    load();
  }

  async function remove(u: string) {
    await hostPost("/api/host/roster", { action: "REMOVE", username: u });
    load();
  }

  const takenIds = new Set(assignments.map((a) => a.characterId));

  return (
    <Panel>
      <p className="font-display text-xs uppercase tracking-[0.2em] text-oracle-textDim mb-1">
        Pre-Assign Roster
      </p>
      <p className="text-oracle-textFaint text-[11px] leading-relaxed mb-3">
        Give each guest a username ahead of time and pick their character. They
        can preview it at <span className="text-oracle-text">/preview</span>{" "}
        before the party, and joining with the same username on the night
        automatically gives them that same character.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="USERNAME"
          className="flex-1 bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-xs text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60"
        />
        <select
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          className="bg-oracle-panelAlt border border-oracle-border rounded-sm px-2 py-2 text-xs text-oracle-text"
        >
          <option value="">Character…</option>
          {TIER_ORDER.map((tier) => (
            <optgroup key={tier} label={tier}>
              {characters
                .filter((c) => c.tier === tier)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {takenIds.has(c.id) ? " (assigned)" : ""}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <Button
          variant="primary"
          className="!py-2 !text-xs whitespace-nowrap"
          disabled={loading || !username.trim() || !characterId}
          onClick={assign}
        >
          Assign
        </Button>
      </div>

      {loaded && assignments.length === 0 && (
        <p className="text-oracle-textFaint text-[11px] mt-3">
          No pre-assignments yet — guests who join without one get auto-assigned
          in tier order as usual.
        </p>
      )}

      {assignments.length > 0 && (
        <ul className="mt-3 space-y-1">
          {assignments.map((a) => {
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
      )}
    </Panel>
  );
}
