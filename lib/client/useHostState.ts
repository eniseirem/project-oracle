"use client";

import { useCallback, useEffect, useState } from "react";
import { hostFetch } from "@/lib/client/hostApi";
import { getHostKey } from "@/lib/client/session";

export function useHostState(pollMs = 3000) {
  const [data, setData] = useState<any>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOnce = useCallback(async () => {
    if (!getHostKey()) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    try {
      const res = await hostFetch("/api/host/state");
      if (res.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setData(await res.json());
        setUnauthorized(false);
      }
    } catch {
      // keep last known state on transient network errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnce();
    const interval = setInterval(fetchOnce, pollMs);
    return () => clearInterval(interval);
  }, [fetchOnce, pollMs]);

  return { data, loading, unauthorized, refresh: fetchOnce };
}
