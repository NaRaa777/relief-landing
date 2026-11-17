// Server-only. Links the /welcome survey to a waitlist signup without ever
// putting the email in a URL: the waitlist API sets a short-lived, httpOnly
// cookie holding the email, encrypted with AES-256-GCM. The browser can't
// read it, and the survey API decrypts it to know who is answering.
//
// The anon key can only INSERT (no SELECT), so the API can't read back the
// new row's id. The email is the link instead: it is unique on `waitlist`.

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const SIGNUP_COOKIE = "relief_signup";
export const SIGNUP_COOKIE_MAX_AGE = 60 * 60; // 1 hour, in seconds

export const signupCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SIGNUP_COOKIE_MAX_AGE,
};

function getKey() {
  // SIGNUP_COOKIE_SECRET is optional. Without it, the key is derived from the
  // Supabase key, which only ever lives on the server in this app.
  const secret =
    process.env.SIGNUP_COOKIE_SECRET ||
    (process.env.SUPABASE_ANON_KEY ? `relief-signup-cookie:${process.env.SUPABASE_ANON_KEY}` : "");
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

export function createSignupToken(email: string): string | null {
  const key = getKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const payload = JSON.stringify({ e: email, x: Date.now() + SIGNUP_COOKIE_MAX_AGE * 1000 });
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

/** Returns the signup email, or null if the token is missing, forged or expired. */
export function readSignupToken(token: string | undefined): string | null {
  const key = getKey();
  if (!key || !token) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const { e, x } = JSON.parse(json) as { e?: unknown; x?: unknown };
    if (typeof e !== "string" || typeof x !== "number" || x < Date.now()) return null;
    return e;
  } catch {
    return null;
  }
}
