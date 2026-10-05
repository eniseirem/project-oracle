"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Panel } from "@/components/ui/Panel";
import { getPlayerId } from "@/lib/client/session";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const playerId = getPlayerId() ?? "";
    const res = await fetch(`/api/leaderboard?playerId=${playerId}`, { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setOpen(!!json.open);
    setRows(json.rows ?? null);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen pb-16">
      <TopBar title="Final Standings" />
      <div className="max-w-md mx-auto px-6 pt-6 space-y-3">
        {!open && (
          <p className="text-center text-oracle-textDim text-sm uppercase tracking-widest pt-10">
            Not revealed yet. Check back once ORACLE reaches its conclusion.
          </p>
        )}
        {open &&
          rows?.map((r) => (
            <Panel key={r.rank}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-oracle-amber w-6">#{r.rank}</span>
                  <span
                    className={`font-display text-sm uppercase tracking-wide ${
                      r.isYou ? "text-oracle-redBright" : "text-oracle-text"
                    }`}
                  >
                    {r.realName}
                    {r.isYou ? " (you)" : ""}
                  </span>
                </div>
                <span className="text-oracle-textDim text-sm">{r.total} PTS</span>
              </div>
            </Panel>
          ))}
      </div>
    </main>
  );
}
