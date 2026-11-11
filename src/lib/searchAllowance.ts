import { createHmac, timingSafeEqual, createHash } from "node:crypto";

export const FREE_SEARCHES = 3;
export function readAllowance(value: string | undefined, secret: string): string[] {
  if (!value) return [];
  try {
    const [payload, signature] = value.split(".");
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return [];
    const hashes: unknown = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Array.isArray(hashes) && hashes.length <= FREE_SEARCHES && hashes.every(h => typeof h === "string" && /^[a-f0-9]{64}$/.test(h)) ? hashes : [];
  } catch { return []; }
}
export function signAllowance(hashes: string[], secret: string) {
  const payload = Buffer.from(JSON.stringify(hashes)).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}
export function searchHash(answers: Record<string, string>) {
  return createHash("sha256").update(JSON.stringify(Object.entries(answers).sort(([a], [b]) => a.localeCompare(b)))).digest("hex");
}
export function allowSearch(hashes: string[], hash: string, paid: boolean, hasResults = true) {
  const allowed = paid || hashes.includes(hash) || hashes.length < FREE_SEARCHES;
  const next = allowed && !paid && hasResults && !hashes.includes(hash) ? [...hashes, hash] : hashes;
  return { allowed, hashes: next, remaining: Math.max(0, FREE_SEARCHES - next.length) };
}
