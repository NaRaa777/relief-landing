import { readToken } from "@/lib/signup-session";
import { getMissingSupabaseEnv, insertRow } from "@/lib/supabase";

// The "Confirm my email" link: /api/confirm?t=<encrypted token>.
// Records the confirmation, then sends the visitor to a branded page.
// Confirming twice is fine (the duplicate is ignored).

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = readToken(url.searchParams.get("t"), "confirm");
  const to = (path: string) => Response.redirect(new URL(path, url.origin), 303);

  if (!email) return to("/confirmed?status=expired");
  if (getMissingSupabaseEnv().length > 0) return to("/confirmed?status=error");

  try {
    await insertRow("waitlist_confirmations", { email });
    return to("/confirmed");
  } catch (error) {
    console.error("[confirm]", error);
    return to("/confirmed?status=error");
  }
}
