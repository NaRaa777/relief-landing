// Server-only. Encrypted, expiring tokens that carry an email address without
// ever exposing it (AES-256-GCM: unreadable and tamper-proof without the key).
//
// - "signup": the httpOnly cookie set by /api/waitlist so /welcome knows who
//   is answering the survey. The email never goes in a URL.
// - "confirm" / "unsubscribe": the links in the confirmation email. The URL
//   holds the encrypted token, never the email itself.
//
// The anon key can only INSERT (no SELECT), so the API can't read back the
// new row's id. The email is the link instead: it is unique on `waitlist`.

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type TokenPurpose = "signup" | "confirm" | "unsubscribe";

export const SIGNUP_COOKIE = "relief_signup";
export const SIGNUP_COOKIE_MAX_AGE = 60 * 60; // 1 hour, in seconds

const TTL_SECONDS: Record<TokenPurpose, number> = {
  signup: SIGNUP_COOKIE_MAX_AGE,
  confirm: 14 * 24 * 60 * 60, // 14 days to click the confirmation link
  unsubscribe: 5 * 365 * 24 * 60 * 60, // unsubscribe links must keep working
};

export const signupCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SIGNUP_COOKIE_MAX_AGE,
};

let warned = false;

function getKey() {
  // Set SIGNUP_COOKIE_SECRET in every environment. The fallback derives a key
  // from the Supabase anon key, which is meant to be public, so it is only a
  // safety net for local setups.
  if (!process.env.SIGNUP_COOKIE_SECRET && process.env.NODE_ENV === "production" && !warned) {
    warned = true;
    console.warn("[signup-session] SIGNUP_COOKIE_SECRET is not set; using a weaker fallback key.");
  }
  const secret =
    process.env.SIGNUP_COOKIE_SECRET ||
    (process.env.SUPABASE_ANON_KEY ? `relief-signup-cookie:${process.env.SUPABASE_ANON_KEY}` : "");
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

export function createToken(email: string, purpose: TokenPurpose, now = Date.now()): string | null {
  const key = getKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const payload = JSON.stringify({ e: email, p: purpose, x: now + TTL_SECONDS[purpose] * 1000 });
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

/**
 * Returns the email, or null if the token is missing, forged, expired or made
 * for another purpose (a confirm link can't be used as a signup cookie).
 */
export function readToken(token: string | null | undefined, purpose: TokenPurpose, now = Date.now()): string | null {
  const key = getKey();
  if (!key || !token) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const { e, p, x } = JSON.parse(json) as { e?: unknown; p?: unknown; x?: unknown };
    if (typeof e !== "string" || p !== purpose || typeof x !== "number" || x < now) return null;
    return e;
  } catch {
    return null;
  }
}

export const createSignupToken = (email: string) => createToken(email, "signup");
export const readSignupToken = (token: string | undefined) => readToken(token, "signup");
