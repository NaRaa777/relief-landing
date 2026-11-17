import { beforeEach, describe, expect, it } from "vitest";
import { allowRequest, clientIp, resetRateLimits } from "@/lib/rate-limit";

beforeEach(() => resetRateLimits());

describe("allowRequest", () => {
  it("allows up to the limit, then blocks", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) expect(allowRequest("waitlist", "1.2.3.4", 5, 60_000, now)).toBe(true);
    expect(allowRequest("waitlist", "1.2.3.4", 5, 60_000, now)).toBe(false);
  });

  it("resets after the window", () => {
    const now = 1_000_000;
    for (let i = 0; i < 6; i++) allowRequest("waitlist", "1.2.3.4", 5, 60_000, now);
    expect(allowRequest("waitlist", "1.2.3.4", 5, 60_000, now + 60_001)).toBe(true);
  });

  it("counts each IP and each scope separately", () => {
    const now = 1_000_000;
    for (let i = 0; i < 6; i++) allowRequest("waitlist", "1.2.3.4", 5, 60_000, now);
    expect(allowRequest("waitlist", "5.6.7.8", 5, 60_000, now)).toBe(true);
    expect(allowRequest("events", "1.2.3.4", 5, 60_000, now)).toBe(true);
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for address", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" } });
    expect(clientIp(req)).toBe("9.9.9.9");
  });

  it("falls back to unknown", () => {
    expect(clientIp(new Request("http://x"))).toBe("unknown");
  });
});
