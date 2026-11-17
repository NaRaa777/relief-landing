import { cookies } from "next/headers";
import { SIGNUP_COOKIE, readSignupToken } from "@/lib/signup-session";
import { getMissingSupabaseEnv, insertRow, notConfiguredMessage } from "@/lib/supabase";
import { sanitizeSurvey } from "@/lib/waitlist";

// Saves /welcome survey answers. Who is answering comes from the encrypted
// signup cookie set by /api/waitlist, never from the request body or URL.
// Body: { answers, completed }. `completed: false` is a partial save sent
// when the visitor leaves mid-way.

export async function POST(request: Request) {
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
  const completed = payload.completed === true;

  const missing = getMissingSupabaseEnv();
  if (missing.length > 0) {
    return Response.json({ ok: false, message: notConfiguredMessage(missing) }, { status: 503 });
  }

  try {
    await insertRow("waitlist_survey", { email, ...answers, completed });
    // Done: /welcome has nothing more to do for this visitor.
    if (completed) cookieStore.delete(SIGNUP_COOKIE);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[survey]", error);
    return Response.json(
      { ok: false, message: "We couldn’t save your answers. Please try again." },
      { status: 502 },
    );
  }
}
