import { allowRequest, clientIp } from "@/lib/rate-limit";
import { getMissingSupabaseEnv, insertRow } from "@/lib/supabase";
import { EVENT_NAMES, sanitizeAttribution } from "@/lib/waitlist";

// First-party analytics sink. Always answers 204 for well-formed events so a
// tracking hiccup can never affect the page.

function sanitizeProps(input: unknown) {
  const out: Record<string, string | string[]> = {};
  if (!input || typeof input !== "object") return out;
  for (const [key, value] of Object.entries(input).slice(0, 12)) {
    const k = key.slice(0, 40);
    if (typeof value === "string") out[k] = value.slice(0, 80);
    else if (Array.isArray(value)) {
      out[k] = value.filter((v) => typeof v === "string").slice(0, 10).map((v) => v.slice(0, 80));
    }
  }
  return out;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) ?? {};
  } catch {
    return new Response(null, { status: 400 });
  }

  const name = payload.name;
  if (typeof name !== "string" || !(EVENT_NAMES as readonly string[]).includes(name)) {
    return new Response(null, { status: 400 });
  }

  if (getMissingSupabaseEnv().length > 0) return new Response(null, { status: 204 });
  // Quietly drop floods so a script can't fill the analytics table.
  if (!allowRequest("events", clientIp(request), 120, 60_000)) return new Response(null, { status: 204 });

  try {
    await insertRow("events", {
      name,
      session_id: typeof payload.sessionId === "string" ? payload.sessionId.slice(0, 64) : null,
      path: typeof payload.path === "string" ? payload.path.slice(0, 200) : null,
      props: sanitizeProps(payload.props),
      ...sanitizeAttribution(payload.attribution),
    });
  } catch (error) {
    console.error("[events]", error);
  }
  return new Response(null, { status: 204 });
}
