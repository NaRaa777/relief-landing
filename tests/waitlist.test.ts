import { describe, expect, it } from "vitest";
import { isValidEmail, normalizeEmail, sanitizeAttribution, sanitizeSurvey } from "@/lib/waitlist";

describe("emails", () => {
  it("normalizes case and spaces", () => {
    expect(normalizeEmail("  Jane@Example.COM ")).toBe("jane@example.com");
  });

  it("accepts real addresses and rejects broken ones", () => {
    expect(isValidEmail("jane@example.com")).toBe(true);
    expect(isValidEmail("jane@example")).toBe(false);
    expect(isValidEmail("jane example.com")).toBe(false);
    expect(isValidEmail(`${"a".repeat(250)}@x.com`)).toBe(false);
  });
});

describe("sanitizeSurvey", () => {
  it("keeps only known answers", () => {
    expect(
      sanitizeSurvey({
        pain_level: "strong",
        current_methods: ["painkillers", "painkillers", "made_up", 42],
        would_pay: "definitely",
        email: "sneaky@example.com",
      }),
    ).toEqual({ pain_level: "strong", current_methods: ["painkillers"], would_pay: null });
  });

  it("handles garbage input", () => {
    expect(sanitizeSurvey(null)).toEqual({ pain_level: null, current_methods: [], would_pay: null });
    expect(sanitizeSurvey("nope")).toEqual({ pain_level: null, current_methods: [], would_pay: null });
  });
});

describe("sanitizeAttribution", () => {
  it("keeps known keys, trims and caps length", () => {
    const out = sanitizeAttribution({ utm_source: " tiktok ", evil: "x", referrer: "r".repeat(500) });
    expect(out).toEqual({ utm_source: "tiktok", referrer: "r".repeat(300) });
  });
});
