// MVP host authentication: a single shared passcode, checked on every
// mutating /api/host/* request via the `x-oracle-host-key` header.
// Set ORACLE_HOST_CODE in your environment before the party to change it
// from the default. This is intentionally lightweight — it exists so a
// random guest who finds the /host URL can't flip phases, not to withstand
// a determined attacker.
export const HOST_PASSCODE = process.env.ORACLE_HOST_CODE || "ORACLE-GM-1";

export function checkHostAuth(headerValue: string | null): boolean {
  return headerValue === HOST_PASSCODE;
}
