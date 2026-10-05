"use client";

import { useState } from "react";
import Link from "next/link";
import { OracleBrand } from "@/components/ui/OracleBrand";
import { Button } from "@/components/ui/Button";
import { Expandable } from "@/components/ui/Expandable";

interface PreviewCharacter {
  id: string;
  name: string;
  tier: string;
  costumeSuggestion: string;
  accentColor?: { name: string; hex: string };
  publicBio: string;
  secret: string;
  whatYouKnow: string;
  objectives: { type: string; text: string }[];
  relationships: { characterId: string; name: string; label: string; note: string }[];
}

type PreviewStatus = "REGISTERED_PENDING" | "PENDING" | "ASSIGNED";

export default function PreviewPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PreviewStatus | null>(null);
  const [displayUsername, setDisplayUsername] = useState("");
  const [character, setCharacter] = useState<PreviewCharacter | null>(null);

  async function lookup() {
    setError(null);
    setLoading(true);
    setCharacter(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/preview?username=${encodeURIComponent(username)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "SOMETHING WENT WRONG");
        setLoading(false);
        return;
      }
      setStatus(json.status);
      setDisplayUsername(json.displayUsername || username.trim());
      if (json.status === "ASSIGNED") {
        setCharacter(json.character);
      }
    } catch {
      setError("NETWORK ERROR");
    }
    setLoading(false);
  }

  if (status === "REGISTERED_PENDING" || status === "PENDING") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs animate-fadeIn text-center">
          <OracleBrand size="md" />
          <p className="mt-6 font-display text-lg uppercase tracking-wide text-oracle-text">
            {displayUsername}
          </p>
          <p className="mt-3 text-oracle-textFaint text-[11px] leading-relaxed">
            {status === "REGISTERED_PENDING"
              ? "You're registered! Your host hasn't assigned you a character yet — tell them the username above, then check back here."
              : "Still waiting on your host to assign you a character. Check back soon."}
          </p>
          <button
            onClick={() => {
              setStatus(null);
              setUsername("");
            }}
            className="mt-8 text-oracle-textDim text-xs uppercase tracking-widest hover:text-oracle-text underline"
          >
            try another username
          </button>
        </div>
      </main>
    );
  }

  if (character) {
    const c = character;
    return (
      <main className="min-h-screen pb-16">
        <div className="max-w-md mx-auto px-6 pt-10 space-y-4">
          <button
            onClick={() => {
              setCharacter(null);
              setUsername("");
            }}
            className="text-oracle-textDim text-xs uppercase tracking-widest hover:text-oracle-text"
          >
            ‹ preview another username
          </button>

          <div className="text-center mb-2 mt-4">
            <p className="text-oracle-redBright text-[11px] uppercase tracking-widest mb-1">
              Pre-Party Preview
            </p>
            <h1 className="font-display text-2xl uppercase tracking-wide text-oracle-text">
              {c.name}
            </h1>
            <p className="text-oracle-textFaint text-[11px] uppercase tracking-widest mt-1">
              {c.tier} SUBJECT
            </p>
            <p className="text-oracle-amber text-[11px] uppercase tracking-widest mt-2">
              Costume: {c.costumeSuggestion}
            </p>
            {c.accentColor && (
              <p className="text-oracle-textFaint text-[11px] uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: c.accentColor.hex }}
                />
                Accent: {c.accentColor.name}
              </p>
            )}
            <p className="text-oracle-textFaint text-[10px] mt-1">
              (optional — wear something close if you feel like it, don't worry if not)
            </p>
          </div>

          <Expandable title="Public Identity" defaultOpen>
            {c.publicBio}
          </Expandable>

          <Expandable title="Your Secret">{c.secret}</Expandable>

          <Expandable title="What You Know">{c.whatYouKnow}</Expandable>

          <Expandable title="Your Objectives" defaultOpen>
            {c.objectives.map((o) => `${o.type}: ${o.text}`).join("\n\n")}
          </Expandable>

          {c.relationships.length > 0 && (
            <Expandable title="People You Know Tonight">
              {c.relationships.map((r) => `${r.name} — ${r.label}\n${r.note}`).join("\n\n")}
            </Expandable>
          )}

          <p className="text-oracle-textFaint text-[10px] uppercase tracking-widest text-center pt-6">
            Everything else — new evidence, ORACLE messages, who else you know —
            unlocks live during the party. This is just the beginning.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs animate-fadeIn">
        <OracleBrand size="md" />
        <p className="mt-2 text-center text-oracle-textDim text-xs uppercase tracking-widest">
          Pre-Party Preview
        </p>
        <p className="mt-4 text-center text-oracle-textFaint text-[11px] leading-relaxed">
          Pick any username you like — first name is fine. Tell your host
          what you picked, so they know which one to assign a character to.
          Then come back here any time to check.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-oracle-textDim mb-1">
              Pick a username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="e.g. your first name"
              className="w-full bg-oracle-panel border border-oracle-border rounded-sm px-4 py-3 text-oracle-text placeholder:text-oracle-textFaint focus:outline-none focus:border-oracle-red/60"
              maxLength={40}
            />
          </div>

          {error && (
            <p className="text-oracle-redBright text-xs uppercase tracking-wide">{error}</p>
          )}

          <Button
            variant="primary"
            full
            disabled={loading || !username.trim()}
            onClick={lookup}
          >
            {loading ? "CHECKING…" : "CONTINUE"}
          </Button>
        </div>

        <p className="mt-10 text-center text-oracle-textFaint text-[10px] uppercase tracking-widest">
          <Link href="/join" className="underline">
            join the live game instead
          </Link>
        </p>
      </div>
    </main>
  );
}
