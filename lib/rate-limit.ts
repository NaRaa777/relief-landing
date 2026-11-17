// Server-only. A small fixed-window rate limiter, kept in memory.
//
// On Vercel each server instance has its own memory, so this is a first line
// of defence against one client hammering an endpoint, not a hard global cap.
// For a hard cap, add a rate-limit rule in Vercel → Firewall (see README).

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, w] of buckets) if (w.resetAt <= now) buckets.delete(key);
}

/** The client's IP as seen by Vercel / most proxies, or "unknown". */
export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the request is allowed. `limit` requests per `windowMs`
 * for each (scope, key) pair.
 */
export function allowRequest(scope: string, key: string, limit: number, windowMs: number, now = Date.now()) {
  sweep(now);
  const id = `${scope}:${key}`;
  const current = buckets.get(id);
  if (!current || current.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

/** Test helper. */
export function resetRateLimits() {
  buckets.clear();
  lastSweep = 0;
}
