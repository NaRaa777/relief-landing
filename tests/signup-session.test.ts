import { beforeEach, describe, expect, it } from "vitest";
import { createToken, readToken } from "@/lib/signup-session";

beforeEach(() => {
  process.env.SIGNUP_COOKIE_SECRET = "test-secret-for-unit-tests";
});

describe("encrypted email tokens", () => {
  it("round-trips the email for the same purpose", () => {
    const token = createToken("jane@example.com", "signup")!;
    expect(readToken(token, "signup")).toBe("jane@example.com");
  });

  it("never contains the email in readable form", () => {
    const token = createToken("jane@example.com", "confirm")!;
    expect(token).not.toContain("jane");
    expect(Buffer.from(token, "base64url").toString("latin1")).not.toContain("jane@example.com");
  });

  it("rejects a token made for another purpose", () => {
    const confirm = createToken("jane@example.com", "confirm")!;
    expect(readToken(confirm, "signup")).toBeNull();
    expect(readToken(confirm, "unsubscribe")).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = createToken("jane@example.com", "signup", 0)!;
    expect(readToken(token, "signup", Date.now())).toBeNull();
  });

  it("rejects a tampered token", () => {
    const token = createToken("jane@example.com", "signup")!;
    const raw = Buffer.from(token, "base64url");
    raw[raw.length - 1] ^= 1;
    expect(readToken(raw.toString("base64url"), "signup")).toBeNull();
  });

  it("rejects a token made with another secret", () => {
    const token = createToken("jane@example.com", "signup")!;
    process.env.SIGNUP_COOKIE_SECRET = "a-different-secret";
    expect(readToken(token, "signup")).toBeNull();
  });

  it("handles missing and garbage input", () => {
    expect(readToken(undefined, "signup")).toBeNull();
    expect(readToken("", "signup")).toBeNull();
    expect(readToken("not-a-token", "signup")).toBeNull();
  });
});
