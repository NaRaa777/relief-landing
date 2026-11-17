"use client";

import { useState } from "react";
import { track } from "@/lib/client/analytics";

type Tone = "light" | "dark";

/**
 * Native share sheet where available (mobile), "Copy link" elsewhere.
 * Shares the homepage only, never anything about the visitor.
 */
export function ShareBlock({ tone, className = "mt-4" }: { tone: Tone; className?: string }) {
  const dark = tone === "dark";
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  async function share() {
    const url = `${window.location.origin}/?utm_source=share&utm_medium=referral`;
    if (navigator.share) {
      track("share_clicked", { method: "native" });
      try {
        await navigator.share({
          title: "Relief",
          text: "Found this app for painful periods — it helps you plan for the hard days. Join the waitlist:",
          url,
        });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return;
      }
    } else {
      track("share_clicked", { method: "copy" });
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`${className} inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-colors ${
        dark ? "bg-cream text-plum hover:bg-blush" : "bg-burgundy text-cream hover:bg-burgundy-deep"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
        {copied ? (
          <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11v4.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <span aria-live="polite">
        {copied ? "Link copied" : canShare ? "Share with a friend" : "Copy link"}
      </span>
    </button>
  );
}
