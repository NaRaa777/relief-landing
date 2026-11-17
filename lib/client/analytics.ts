import { getAttribution } from "@/lib/client/attribution";
import type { EventName } from "@/lib/waitlist";

type Props = Record<string, string | string[]>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    ttq?: { track: (event: string, props?: Record<string, unknown>) => void };
  }
}

/**
 * Tells the TikTok Pixel (if it is on) that someone joined the waitlist.
 * Deliberately sends nothing about the person: no email, no survey answer.
 */
export function trackPixelSignup() {
  try {
    window.ttq?.track("CompleteRegistration");
  } catch {
    // Never let an ad tag break the signup.
  }
}

let sessionId: string | null = null;

function getSessionId() {
  if (sessionId) return sessionId;
  try {
    sessionId = sessionStorage.getItem("relief_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("relief_sid", sessionId);
    }
  } catch {
    sessionId ??= Math.random().toString(36).slice(2);
  }
  return sessionId;
}

/**
 * Records a funnel event in our own `events` table (via /api/events) and
 * mirrors it to `window.dataLayer` if a tag manager is ever added.
 * Fire-and-forget: never throws, never blocks the UI.
 */
export function track(name: EventName, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      name,
      props,
      sessionId: getSessionId(),
      path: window.location.pathname,
      attribution: getAttribution(),
    });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/events", blob)) {
      void fetch("/api/events", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
    window.dataLayer?.push({ event: name, ...props });
  } catch {
    // Analytics must never break the page.
  }
}
