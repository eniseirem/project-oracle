"use client";

import { useState } from "react";
import { OracleBrand } from "@/components/ui/OracleBrand";
import { Button } from "@/components/ui/Button";
import { setHostKey } from "@/lib/client/session";

export function HostLogin({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/host/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      setHostKey(code);
      onSuccess();
    } else {
      setError("INCORRECT ACCESS CODE");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs text-center">
        <OracleBrand size="md" />
        <p className="mt-2 text-oracle-textDim text-xs uppercase tracking-widest">
          Game Master Access
        </p>
        <div className="mt-10 space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="ACCESS CODE"
            className="w-full bg-oracle-panel border border-oracle-border rounded-sm px-4 py-3 text-center text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60 tracking-widest"
          />
          {error && <p className="text-oracle-redBright text-xs uppercase tracking-wide">{error}</p>}
          <Button variant="primary" full disabled={loading || !code} onClick={submit}>
            {loading ? "VERIFYING…" : "AUTHENTICATE"}
          </Button>
        </div>
        <p className="mt-10 text-oracle-textFaint text-[10px] uppercase tracking-widest">
          default code: ORACLE-GM-1 (set ORACLE_HOST_CODE to change it)
        </p>
      </div>
    </main>
  );
}
