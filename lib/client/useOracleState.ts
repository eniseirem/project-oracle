"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPlayerId } from "@/lib/client/session";

export function usePlayerState(pollMs = 4000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerIdRef = useRef<string | null>(null);

  const fetchOnce = useCallback(async () => {
    const playerId = getPlayerId();
    playerIdRef.current = playerId;
    if (!playerId) {
      setLoading(false);
      setError("NOT_JOINED");
      return;
    }
    try {
      const res = await fetch(`/api/state?playerId=${playerId}`, { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "ERROR");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("NETWORK");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnce();
    const interval = setInterval(fetchOnce, pollMs);
    return () => clearInterval(interval);
  }, [fetchOnce, pollMs]);

  return { data, loading, error, playerId: playerIdRef.current, refresh: fetchOnce };
}

export function useDisplayState(pollMs = 3000) {
  const [data, setData] = useState<any>(null);

  const fetchOnce = useCallback(async () => {
    try {
      const res = await fetch("/api/display", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      // ignore transient network errors, keep showing last known state
    }
  }, []);

  useEffect(() => {
    fetchOnce();
    const interval = setInterval(fetchOnce, pollMs);
    return () => clearInterval(interval);
  }, [fetchOnce, pollMs]);

  return data;
}
