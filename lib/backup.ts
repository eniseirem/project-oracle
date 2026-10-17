import type { GameState } from "@/lib/types";

// ============================================================================
// OPTIONAL remote backup, on top of the in-memory + local-disk state in
// lib/store.ts. On a host like Render's free tier, a restart (idle
// spin-down, or Render restarting the service on its own) wipes BOTH memory
// and the local disk mirror, since the filesystem itself is ephemeral there.
// This gives the game a third copy that lives outside that process/disk
// entirely, using Upstash's free Redis REST API (no SDK needed - this is
// just two plain `fetch` calls).
//
// Fully optional and fails soft: if UPSTASH_REDIS_REST_URL /
// UPSTASH_REDIS_REST_TOKEN aren't set, every call here is a no-op. Nothing
// about normal gameplay depends on this working.
//
// Writes happen automatically (fire-and-forget) on every commit() in
// store.ts. Reading back is NOT automatic — it's a deliberate, host-only
// action (the "RESTORE FROM BACKUP" button on the Emergency panel), so a
// restart never silently overwrites fresher state with a stale backup.
// ============================================================================

const BACKUP_KEY = "oracle_state_backup";

function restConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export async function backupToRemote(state: GameState): Promise<void> {
  const config = restConfig();
  if (!config) return;
  try {
    await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", BACKUP_KEY, JSON.stringify(state)]),
    });
  } catch {
    // Best-effort only - never let a backup failure affect gameplay.
  }
}

export async function fetchRemoteBackup(): Promise<GameState | null> {
  const config = restConfig();
  if (!config) return null;
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["GET", BACKUP_KEY]),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || typeof json.result !== "string") return null;
    return JSON.parse(json.result) as GameState;
  } catch {
    return null;
  }
}

export function remoteBackupConfigured(): boolean {
  return restConfig() !== null;
}
