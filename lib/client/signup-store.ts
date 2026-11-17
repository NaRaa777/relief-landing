"use client";

import { useSyncExternalStore } from "react";
import type { WaitlistSource } from "@/lib/waitlist";

// Signup state shared by both forms and the sticky CTA, so signing up in one
// place updates the whole page. Only a "joined" flag is kept (no email).

export type Signup = {
  status: "joined" | "already_joined";
  source: WaitlistSource | null;
};

const STORAGE_KEY = "relief_joined";
const listeners = new Set<() => void>();
let state: Signup | null = null;
let hydrated = false;

function read(): Signup | null {
  if (!hydrated) {
    hydrated = true;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        state = { status: "joined", source: null };
      }
    } catch {
      // Storage unavailable: treat as a fresh visitor.
    }
  }
  return state;
}

export function setSignup(next: Signup) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Non-critical.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSignup() {
  return useSyncExternalStore(subscribe, read, () => null);
}
