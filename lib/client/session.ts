const PLAYER_ID_KEY = "oracle_player_id";
const HOST_KEY_KEY = "oracle_host_key";

export function getPlayerId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PLAYER_ID_KEY);
  } catch {
    return null;
  }
}

export function setPlayerId(id: string) {
  try {
    window.localStorage.setItem(PLAYER_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function clearPlayerId() {
  try {
    window.localStorage.removeItem(PLAYER_ID_KEY);
  } catch {
    // ignore
  }
}

export function getHostKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(HOST_KEY_KEY);
  } catch {
    return null;
  }
}

export function setHostKey(key: string) {
  try {
    window.localStorage.setItem(HOST_KEY_KEY, key);
  } catch {
    // ignore
  }
}

export function clearHostKey() {
  try {
    window.localStorage.removeItem(HOST_KEY_KEY);
  } catch {
    // ignore
  }
}
