"use client";

import { useEffect, useState } from "react";
import { useSignup } from "@/lib/client/signup-store";

/**
 * Mobile-only bottom bar. Appears once the hero form has scrolled out of
 * view, hides while the final form is on screen and after signup.
 */
export function StickyCta() {
  const signup = useSignup();
  const [heroVisible, setHeroVisible] = useState(true);
  const [joinVisible, setJoinVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-form");
    const join = document.getElementById("join");
    if (!hero || !join || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === join) setJoinVisible(e.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(join);
    return () => observer.disconnect();
  }, []);

  const show = !signup && !heroVisible && !joinVisible;

  function goToForm() {
    const input = document.querySelector<HTMLInputElement>("#join input[type=email]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Focus inside the tap so mobile browsers open the keyboard.
    input?.focus({ preventScroll: true });
    (input ?? document.getElementById("join"))?.scrollIntoView({
      block: "center",
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <button
        type="button"
        onClick={goToForm}
        tabIndex={show ? 0 : -1}
        className="h-13 w-full rounded-full bg-burgundy text-base font-semibold text-cream shadow-[0_16px_40px_-12px_rgb(28_8_17/0.7)] ring-1 ring-white/10 active:scale-[0.99]"
      >
        Join the waitlist
      </button>
    </div>
  );
}
