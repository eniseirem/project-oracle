import { getHostKey } from "@/lib/client/session";

export async function hostFetch(path: string, options: RequestInit = {}) {
  const key = getHostKey();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (key) headers.set("x-oracle-host-key", key);
  return fetch(path, { ...options, headers, cache: "no-store" });
}

export async function hostPost(path: string, body: any) {
  return hostFetch(path, { method: "POST", body: JSON.stringify(body) });
}
