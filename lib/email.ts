// Server-only. Sends the waitlist confirmation email through Resend's REST
// API (no SDK needed for one call). Off until RESEND_API_KEY and EMAIL_FROM
// are set, so local development and previews never send real email.

import { createToken } from "@/lib/signup-session";

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Links for one recipient. Tokens are encrypted; the email is never in the URL. */
export function emailLinks(email: string, origin: string) {
  const confirm = createToken(email, "confirm");
  const unsubscribe = createToken(email, "unsubscribe");
  if (!confirm || !unsubscribe) return null;
  return {
    confirm: `${origin}/api/confirm?t=${confirm}`,
    unsubscribePage: `${origin}/unsubscribe?t=${unsubscribe}`,
    // RFC 8058 one-click endpoint used by Gmail / Apple Mail's own button.
    unsubscribeOneClick: `${origin}/api/unsubscribe?t=${unsubscribe}`,
  };
}

export function confirmationEmail(links: NonNullable<ReturnType<typeof emailLinks>>) {
  const subject = "Confirm your spot on the Relief waitlist";
  const text = [
    "Thanks for joining the Relief waitlist.",
    "",
    "Tap the link below to confirm your email, so we can let you know when early access opens:",
    links.confirm,
    "",
    "If you didn't sign up, ignore this email and you won't hear from us again.",
    "",
    "Relief is a wellness app in development. It is not a medical service.",
    `Unsubscribe: ${links.unsubscribePage}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#f8f1e9;font-family:Helvetica,Arial,sans-serif;color:#2a1218">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f1e9;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#2c0f1c;border-radius:24px;color:#f8f1e9">
        <tr><td style="padding:36px 32px 8px;font-family:Georgia,serif;font-size:22px">Relief</td></tr>
        <tr><td style="padding:8px 32px 0;font-family:Georgia,serif;font-size:30px;line-height:1.15">You&rsquo;re almost on the list 💌</td></tr>
        <tr><td style="padding:16px 32px 0;font-size:16px;line-height:1.55;color:#f2d6d0">
          Confirm your email so we can let you know when early access opens.
        </td></tr>
        <tr><td style="padding:28px 32px 8px">
          <a href="${escapeHtml(links.confirm)}" style="display:inline-block;background:#f8f1e9;color:#2c0f1c;text-decoration:none;font-weight:bold;font-size:16px;padding:15px 28px;border-radius:999px">Confirm my email</a>
        </td></tr>
        <tr><td style="padding:16px 32px 36px;font-size:14px;line-height:1.5;color:#e7bfb7">
          If you didn&rsquo;t sign up, ignore this email and you won&rsquo;t hear from us again.
        </td></tr>
      </table>
      <p style="max-width:480px;margin:20px auto 0;font-size:12px;line-height:1.5;color:#553840">
        Relief is a wellness app in development. It is not a medical service.<br>
        <a href="${escapeHtml(links.unsubscribePage)}" style="color:#553840">Unsubscribe</a>
      </p>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}

/** Sends the confirmation email. Never throws: a failed email must not fail a signup. */
export async function sendConfirmationEmail(email: string, origin: string): Promise<"sent" | "skipped" | "failed"> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] RESEND_API_KEY / EMAIL_FROM not set: confirmation email not sent.");
    }
    return "skipped";
  }
  const links = emailLinks(email, origin);
  if (!links) return "failed";
  const { subject, text, html } = confirmationEmail(links);

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [email],
        subject,
        text,
        html,
        headers: {
          "List-Unsubscribe": `<${links.unsubscribeOneClick}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return "sent";
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    console.error(`[email] Resend failed (${res.status}): ${body?.message ?? "unknown error"}`);
    return "failed";
  } catch (error) {
    console.error("[email] Resend request failed", error);
    return "failed";
  }
}
