import { cookies } from "next/headers";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { SIGNUP_COOKIE, readSignupToken } from "@/lib/signup-session";
import { getMissingSupabaseEnv, insertRow, notConfiguredMessage } from "@/lib/supabase";
import { sanitizeSurvey } from "@/lib/waitlist";

// Saves /welcome survey answers, once, when the visitor finishes. Who is
// answering comes from the encrypted signup cookie set by /api/waitlist,
// never from the request body or URL. Body: { answers }.

// Bump when the consent notice on /welcome or the survey section of /privacy
// changes, so each row records which wording the visitor saw.
const SURVEY_CONSENT_VERSION = "2026-11-survey-v1";

export async function POST(request: Request) {
  if (!allowRequest("survey", clientIp(request), 5, 10 * 60_000)) {
    return Response.json(
      { ok: false, message: "That’s a lot of tries. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) ?? {};
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const email = readSignupToken(cookieStore.get(SIGNUP_COOKIE)?.value);
  if (!email) {
    return Response.json(
      { ok: false, code: "expired", message: "This page timed out, so we couldn’t save your answers. Your spot on the waitlist is safe." },
      { status: 401 },
    );
  }

  const answers = sanitizeSurvey(payload.answers);
  if (!answers.pain_level && !answers.would_pay && answers.current_methods.length === 0) {
    return Response.json({ ok: false, message: "No answers to save." }, { status: 400 });
  }

  const missing = getMissingSupabaseEnv();
  if (missing.length > 0) {
    return Response.json({ ok: false, message: notConfiguredMessage(missing) }, { status: 503 });
  }

  try {
    await insertRow("waitlist_survey", {
      email,
      ...answers,
      completed: true,
      consent_version: SURVEY_CONSENT_VERSION,
    });
    // Done: /welcome has nothing more to do for this visitor.
    cookieStore.delete(SIGNUP_COOKIE);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[survey]", error);
    return Response.json(
      { ok: false, message: "We couldn’t save your answers. Please try again." },
      { status: 502 },
    );
  }
}
