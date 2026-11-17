import { readToken } from "@/lib/signup-session";
import { getMissingSupabaseEnv, insertRow } from "@/lib/supabase";

// Unsubscribes the email inside an encrypted token. POST only, so link
// scanners that open every URL in an email can't unsubscribe anyone:
// - the /unsubscribe page posts its form here (token in the body), and
// - mail apps' one-click button posts here (RFC 8058, token in the URL).

export async function POST(request: Request) {
  const url = new URL(request.url);
  let token = url.searchParams.get("t");
  const fromForm = !token;
  if (!token) {
    const form = await request.formData().catch(() => null);
    const value = form?.get("t");
    token = typeof value === "string" ? value : null;
  }

  const email = readToken(token, "unsubscribe");
  const done = (status?: "invalid" | "error") => {
    if (!fromForm) return new Response(null, { status: status ? 400 : 200 });
    const next = new URL("/unsubscribe", url.origin);
    next.searchParams.set("status", status ?? "done");
    // Keep the token on a server error so the visitor can simply retry.
    if (status === "error" && token) next.searchParams.set("t", token);
    return Response.redirect(next, 303);
  };

  if (!email) return done("invalid");
  if (getMissingSupabaseEnv().length > 0) return done("error");

  try {
    await insertRow("waitlist_unsubscribes", { email });
    return done();
  } catch (error) {
    console.error("[unsubscribe]", error);
    return done("error");
  }
}
