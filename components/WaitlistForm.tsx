"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { ShareBlock } from "@/components/ShareBlock";
import { getAttribution } from "@/lib/client/attribution";
import { track } from "@/lib/client/analytics";
import { setSignup, useSignup } from "@/lib/client/signup-store";
import {
  isValidEmail,
  normalizeEmail,
  type WaitlistResponse,
  type WaitlistSource,
} from "@/lib/waitlist";

type Props = {
  source: WaitlistSource;
  tone?: "light" | "dark";
  label?: string;
  /** Keep the label for screen readers only (saves space in the hero). */
  hideLabel?: boolean;
  /** Small line under the form. */
  hint?: string;
};

export function WaitlistForm({
  source,
  tone = "light",
  label = "Your email",
  hideLabel = false,
  hint,
}: Props) {
  const id = useId();
  const inputId = `${id}-email`;
  const messageId = `${id}-message`;

  const router = useRouter();
  const signup = useSignup();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const focused = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dark = tone === "dark";

  // Returning visitors who already signed up in this browser.
  if (signup) return <JoinedNote tone={tone} />;

  function showError(message: string) {
    setError(message);
    inputRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const normalized = normalizeEmail(email);
    if (!normalized) return showError("Add your email to join the waitlist.");
    if (!isValidEmail(normalized)) {
      return showError("That email doesn’t look quite right. Mind checking it?");
    }

    const company =
      (event.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    inFlight.current = true;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, source, company, attribution: getAttribution() }),
      });
      const data = (await res.json().catch(() => null)) as WaitlistResponse | null;

      if (res.ok && data && data.status !== "error") {
        track("signup_submitted", { source, status: data.status });
        // The API set an httpOnly cookie that links /welcome to this signup;
        // the email itself never goes in the URL.
        router.push("/welcome");
        setSignup({ status: data.status, source });
        return;
      }
      showError(
        data?.status === "error" ? data.message : "Something went wrong. Please try again in a moment.",
      );
    } catch {
      showError("We couldn’t connect. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  const invalid = Boolean(error);

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="w-full">
      <label
        htmlFor={inputId}
        className={
          hideLabel
            ? "sr-only"
            : `mb-2 block text-base font-medium ${dark ? "text-cream" : "text-ink"}`
        }
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-1.5 rounded-full p-1.5 transition-shadow ${
          dark
            ? "bg-white/10 ring-1 ring-white/25 focus-within:ring-2 focus-within:ring-blush"
            : "bg-white shadow-[0_10px_40px_-18px_rgb(107_38_51/0.35)] ring-1 ring-blush-deep focus-within:ring-2 focus-within:ring-burgundy"
        } ${invalid ? (dark ? "ring-2 ring-[#ffb3bd]" : "ring-2 ring-wine") : ""}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          enterKeyHint="go"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          placeholder="Your email"
          value={email}
          onFocus={() => {
            if (focused.current) return;
            focused.current = true;
            track("form_focus", { source });
          }}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          aria-invalid={invalid}
          aria-describedby={messageId}
          className={`h-12 min-w-0 flex-1 rounded-full bg-transparent pl-4 text-base outline-none disabled:opacity-60 ${
            dark ? "text-cream placeholder:text-cream/70" : "text-ink placeholder:text-ink-soft"
          }`}
        />

        {/* Honeypot for bots: hidden from people and assistive tech. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={loading}
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-base font-semibold transition-[background-color,transform] duration-200 active:scale-[0.98] disabled:cursor-wait sm:px-6 ${
            dark
              ? "bg-cream text-plum hover:bg-blush"
              : "bg-burgundy text-cream hover:bg-burgundy-deep"
          }`}
        >
          {loading ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
              Joining&hellip;
            </>
          ) : (
            "Join the waitlist"
          )}
        </button>
      </div>

      {/* Persistent live region so screen readers announce changes. */}
      <p
        id={messageId}
        aria-live="polite"
        className={`mt-2.5 px-1 text-[15px] leading-snug ${
          invalid ? (dark ? "font-medium text-[#ffc7ce]" : "font-medium text-wine") : dark ? "text-cream/85" : "text-ink-soft"
        } ${!invalid && !hint && !loading ? "sr-only" : ""}`}
      >
        {invalid ? <span role="alert">{error}</span> : loading ? "Adding you to the waitlist…" : hint}
      </p>
    </form>
  );
}

/** Shown in the other form once the visitor has already signed up. */
function JoinedNote({ tone }: { tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      role="status"
      className={`rounded-3xl p-5 ${dark ? "bg-white/10 text-cream ring-1 ring-white/20" : "bg-white/80 text-ink ring-1 ring-blush-deep"}`}
    >
      <p className="font-serif text-2xl">You&rsquo;re on the list 💌</p>
      <p className={`mt-1 text-base ${dark ? "text-cream/85" : "text-ink-soft"}`}>
        We&rsquo;ll email you when early access opens.
      </p>
      <ShareBlock tone={tone} />
    </div>
  );
}
