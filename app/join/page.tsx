"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OracleBrand } from "@/components/ui/OracleBrand";
import { Button } from "@/components/ui/Button";
import { setPlayerId } from "@/lib/client/session";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gameCode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "SOMETHING WENT WRONG");
        setLoading(false);
        return;
      }
      setPlayerId(json.playerId);
      router.push("/game");
    } catch {
      setError("NETWORK ERROR");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs animate-fadeIn">
        <OracleBrand size="md" />
        <p className="mt-2 text-center text-oracle-textDim text-xs uppercase tracking-widest">
          Enrollment
        </p>

        <div className="mt-10 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-oracle-textDim mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME"
              className="w-full bg-oracle-panel border border-oracle-border rounded-sm px-4 py-3 text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60"
              maxLength={40}
            />
            <p className="mt-1 text-oracle-textFaint text-[10px] uppercase tracking-widest">
              Use the same name you previewed with. If you get logged out or
              switch devices, typing it again here picks up exactly where
              you left off.
            </p>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-oracle-textDim mb-1">
              Game Code
            </label>
            <input
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="e.g. ORACLE"
              className="w-full bg-oracle-panel border border-oracle-border rounded-sm px-4 py-3 text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60 uppercase"
              maxLength={20}
            />
          </div>

          {error && (
            <p className="text-oracle-redBright text-xs uppercase tracking-wide">{error}</p>
          )}

          <Button
            variant="primary"
            full
            disabled={loading || !name.trim() || !gameCode.trim()}
            onClick={handleJoin}
          >
            {loading ? "CONNECTING…" : "ENTER EXPERIMENT"}
          </Button>
        </div>
      </div>
    </main>
  );
}
