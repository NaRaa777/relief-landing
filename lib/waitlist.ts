// Shared between client components and API routes.

export const WAITLIST_SOURCES = ["hero", "final_cta"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

export type WaitlistResponse =
  | { status: "joined" }
  | { status: "already_joined" }
  | { status: "error"; code: WaitlistErrorCode; message: string };

export type WaitlistErrorCode =
  | "invalid_email"
  | "invalid_request"
  | "not_configured"
  | "server_error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

/* ------------------------------------------------------------------ */
/* Attribution                                                         */
/* ------------------------------------------------------------------ */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "referrer",
  "landing_path",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

export function sanitizeAttribution(input: unknown): Attribution {
  const out: Attribution = {};
  if (!input || typeof input !== "object") return out;
  for (const key of ATTRIBUTION_KEYS) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, 300);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Post-signup survey                                                  */
/* ------------------------------------------------------------------ */

export const PAIN_LEVELS = [
  ["barely", "Barely"],
  ["mild", "Mild"],
  ["moderate", "Moderate"],
  ["strong", "Strong"],
  ["ruins_my_day", "It ruins my day"],
] as const;

export const CURRENT_METHODS = [
  ["painkillers", "Painkillers"],
  ["heating_pad", "Heating pad"],
  ["tracker_app", "Period tracker app"],
  ["rest_cancel_plans", "Rest & cancel plans"],
  ["nothing", "Nothing really"],
  ["other", "Other"],
] as const;

export const WOULD_PAY = [
  ["yes", "Yes"],
  ["maybe", "Maybe"],
  ["no", "No"],
] as const;

export type PainLevel = (typeof PAIN_LEVELS)[number][0];
export type CurrentMethod = (typeof CURRENT_METHODS)[number][0];
export type WouldPay = (typeof WOULD_PAY)[number][0];

export type SurveyAnswers = {
  pain_level: PainLevel | null;
  current_methods: CurrentMethod[];
  would_pay: WouldPay | null;
};

function pick<T extends string>(options: readonly (readonly [T, string])[], value: unknown) {
  return options.some(([v]) => v === value) ? (value as T) : null;
}

export function sanitizeSurvey(input: unknown): SurveyAnswers {
  const raw = (input ?? {}) as Record<string, unknown>;
  const methods = Array.isArray(raw.current_methods) ? raw.current_methods : [];
  return {
    pain_level: pick(PAIN_LEVELS, raw.pain_level),
    current_methods: [...new Set(methods)]
      .map((m) => pick(CURRENT_METHODS, m))
      .filter((m): m is CurrentMethod => m !== null),
    would_pay: pick(WOULD_PAY, raw.would_pay),
  };
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export const EVENT_NAMES = [
  "page_view",
  "form_focus",
  "signup_submitted",
  "welcome_viewed",
  "survey_step_completed",
  "survey_skipped",
  "survey_completed",
  "share_clicked",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
