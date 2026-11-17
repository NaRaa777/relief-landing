// Server-only: imported by API routes, never by client components.
// Talks to Supabase's REST API (PostgREST) directly: a few inserts do not
// justify shipping the full client library.

const REQUEST_TIMEOUT_MS = 8000;

export function getMissingSupabaseEnv() {
  const missing: string[] = [];
  if (!process.env.SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!process.env.SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
  return missing;
}

export function notConfiguredMessage(missing: string[]) {
  return process.env.NODE_ENV === "development"
    ? `Waitlist storage isn't configured. Add ${missing.join(" and ")} to .env.local and restart the dev server.`
    : "Signups are temporarily unavailable. Please try again later.";
}

export type InsertResult = "inserted" | "duplicate";

export type Table = "waitlist" | "waitlist_survey" | "events";

export async function insertRow(
  table: Table,
  row: Record<string, unknown>,
): Promise<InsertResult> {
  const url = process.env.SUPABASE_URL!.replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY!;

  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Legacy anon keys are JWTs and go in the Authorization header too.
  // New-style publishable keys (sb_publishable_...) only use `apikey`.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (res.ok) return "inserted";

  const body = (await res.json().catch(() => null)) as {
    code?: string;
    message?: string;
  } | null;

  // 23505 = unique_violation (e.g. an email already on the waitlist).
  if (res.status === 409 || body?.code === "23505") return "duplicate";

  throw new Error(
    `Supabase insert into ${table} failed (${res.status}): ${body?.message ?? "unknown error"}`,
  );
}
