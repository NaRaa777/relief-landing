import type { Attribution } from "@/lib/waitlist";

const STORAGE_KEY = "relief_attribution";
let cached: Attribution | null = null;

/**
 * First-touch attribution for this browser session: UTM parameters, the
 * referrer and the landing path. Kept in sessionStorage so a visitor who
 * scrolls, reloads or navigates to /privacy and back keeps the original UTMs.
 * TikTok's in-app browser often sends no referrer, so UTMs matter most.
 */
export function getAttribution(): Attribution {
  if (cached) return cached;
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return (cached = JSON.parse(stored) as Attribution);
  } catch {
    // Storage can be unavailable (private mode, blocked); fall through.
  }

  const params = new URLSearchParams(window.location.search);
  const next: Attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = params.get(key);
    if (value) next[key] = value;
  }
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    next.referrer = document.referrer;
  }
  next.landing_path = window.location.pathname + window.location.search;

  cached = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Non-critical.
  }
  return next;
}
