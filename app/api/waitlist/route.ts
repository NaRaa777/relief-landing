import { cookies } from "next/headers";
import { SIGNUP_COOKIE, createSignupToken, signupCookieOptions } from "@/lib/signup-session";
import { getMissingSupabaseEnv, insertRow, notConfiguredMessage } from "@/lib/supabase";
import {
  WAITLIST_SOURCES,
  isValidEmail,
  normalizeEmail,
  sanitizeAttribution,
  type WaitlistErrorCode,
  type WaitlistResponse,
} from "@/lib/waitlist";

function reply(body: WaitlistResponse, status = 200) {
  return Response.json(body, { status });
}

function fail(code: WaitlistErrorCode, message: string, status: number) {
  return reply({ status: "error", code, message }, status);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("invalid_request", "Invalid request.", 400);
  }

  const { email, source, company, attribution } = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field. Bots get a
  // generic response and nothing is stored.
  if (typeof company === "string" && company.length > 0) {
    return fail("invalid_request", "Invalid request.", 400);
  }

  if (typeof email !== "string" || !isValidEmail(normalizeEmail(email))) {
    return fail("invalid_email", "That email doesn’t look quite right. Mind checking it?", 400);
  }

  const missing = getMissingSupabaseEnv();
  if (missing.length > 0) {
    return fail("not_configured", notConfiguredMessage(missing), 503);
  }

  const safeSource =
    typeof source === "string" &&
    (WAITLIST_SOURCES as readonly string[]).includes(source)
      ? source
      : null;

  try {
    const normalized = normalizeEmail(email);
    const result = await insertRow("waitlist", {
      email: normalized,
      source: safeSource,
      ...sanitizeAttribution(attribution),
    });

    // Lets /welcome link survey answers to this signup. The email stays
    // encrypted in an httpOnly cookie, never in the URL.
    const token = createSignupToken(normalized);
    if (token) (await cookies()).set(SIGNUP_COOKIE, token, signupCookieOptions);

    return reply({ status: result === "duplicate" ? "already_joined" : "joined" });
  } catch (error) {
    console.error("[waitlist]", error);
    return fail(
      "server_error",
      "Something went wrong on our side. Please try again in a moment.",
      502,
    );
  }
}
