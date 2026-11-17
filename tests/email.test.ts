import { beforeEach, describe, expect, it } from "vitest";
import { confirmationEmail, emailLinks, sendConfirmationEmail } from "@/lib/email";
import { readToken } from "@/lib/signup-session";

beforeEach(() => {
  process.env.SIGNUP_COOKIE_SECRET = "test-secret-for-unit-tests";
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
});

describe("confirmation email", () => {
  it("builds links that never contain the email", () => {
    const links = emailLinks("jane@example.com", "https://relief.test")!;
    for (const url of Object.values(links)) {
      expect(url.startsWith("https://relief.test/")).toBe(true);
      expect(url).not.toContain("jane");
    }
  });

  it("puts working confirm and unsubscribe tokens in the links", () => {
    const links = emailLinks("jane@example.com", "https://relief.test")!;
    const confirm = new URL(links.confirm).searchParams.get("t");
    const unsubscribe = new URL(links.unsubscribePage).searchParams.get("t");
    expect(readToken(confirm, "confirm")).toBe("jane@example.com");
    expect(readToken(unsubscribe, "unsubscribe")).toBe("jane@example.com");
  });

  it("includes the confirm and unsubscribe links in both versions", () => {
    const links = emailLinks("jane@example.com", "https://relief.test")!;
    const { html, text } = confirmationEmail(links);
    for (const body of [html, text]) {
      expect(body).toContain(links.confirm);
      expect(body).toContain(links.unsubscribePage);
    }
  });

  it("is skipped, not sent, when Resend isn't configured", async () => {
    await expect(sendConfirmationEmail("jane@example.com", "https://relief.test")).resolves.toBe("skipped");
  });
});
