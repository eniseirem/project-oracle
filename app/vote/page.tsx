"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { getPlayerId } from "@/lib/client/session";
import { usePlayerState } from "@/lib/client/useOracleState";

export default function VotePage() {
  const router = useRouter();
  const { data: playerData, error: playerError } = usePlayerState();
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>([]);
  const [votingOpen, setVotingOpen] = useState(false);
  const [votingLocked, setVotingLocked] = useState(false);
  const [accused, setAccused] = useState("");
  const [why, setWhy] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (playerError === "NOT_JOINED" || playerError === "PLAYER NOT FOUND") router.push("/join");
  }, [playerError, router]);

  async function load() {
    const playerId = getPlayerId();
    if (!playerId) return;
    const res = await fetch(`/api/vote?playerId=${playerId}`, { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setCharacters(json.characters);
    setVotingOpen(json.votingOpen);
    setVotingLocked(json.votingLocked);
    if (json.vote) {
      setAccused(json.vote.accusedCharacterId ?? "");
      setWhy(json.vote.why ?? "");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    const playerId = getPlayerId();
    if (!playerId) return;
    setStatus("saving");
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        accusedCharacterId: accused || null,
        why,
      }),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  if (!votingOpen) {
    return (
      <main className="min-h-screen pb-16">
        <TopBar title="Final Accusation" phase={playerData?.game?.currentPhase} />
        <div className="max-w-md mx-auto px-6 pt-16 text-center">
          <p className="text-oracle-textDim text-sm uppercase tracking-widest">
            Voting has not opened yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <TopBar title="Final Accusation" phase={playerData?.game?.currentPhase} />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-5">
        <p className="text-center font-display uppercase tracking-widest text-oracle-redBright text-sm">
          Who do you believe is behind what happened tonight?
        </p>

        {votingLocked && (
          <p className="text-center text-oracle-amber text-xs uppercase tracking-widest">
            VOTING IS LOCKED — your last saved answer is shown below.
          </p>
        )}

        <Panel>
          <label className="block text-[11px] uppercase tracking-widest text-oracle-textDim mb-2">
            Your accusation
          </label>
          <select
            value={accused}
            onChange={(e) => setAccused(e.target.value)}
            disabled={votingLocked}
            className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-3 text-oracle-text disabled:opacity-50"
          >
            <option value="">— SELECT —</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Panel>

        <Panel>
          <label className="block text-[11px] uppercase tracking-widest text-oracle-textDim mb-2">
            Why? (optional)
          </label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            disabled={votingLocked}
            rows={3}
            maxLength={240}
            className="w-full bg-oracle-panelAlt border border-oracle-border rounded-sm px-3 py-2 text-oracle-text text-sm disabled:opacity-50"
            placeholder="A short reason…"
          />
        </Panel>

        <Button variant="primary" full disabled={votingLocked || status === "saving"} onClick={submit}>
          {status === "saving" ? "SUBMITTING…" : "LOCK ACCUSATION"}
        </Button>
        {status === "saved" && (
          <p className="text-center text-oracle-textDim text-xs uppercase tracking-widest">
            Saved. You can change this until ORACLE locks voting.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-oracle-redBright text-xs uppercase tracking-widest">
            Could not save — try again.
          </p>
        )}
      </div>
    </main>
  );
}
