"use client";

import { useEffect } from "react";

/**
 * Drives every scroll effect on the page from one place:
 * - `data-reveal` / `data-words`: get `.is-in` once they enter the viewport.
 * - `data-parallax="y" | "x"` + `data-speed`: drift relative to scroll.
 * Uses one IntersectionObserver per effect and a single rAF loop that only
 * touches on-screen elements. Respects prefers-reduced-motion.
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal], [data-words]");

    if (reduce || !("IntersectionObserver" in window)) return;

    root.classList.add("motion-ready");

    // Masked lines start fully clipped by their parent, which the observer
    // reports as not intersecting, so watch the mask and reveal the line.
    const targets = new Map<Element, HTMLElement>();
    revealEls.forEach((el) => {
      const watched = el.dataset.reveal === "line" && el.parentElement ? el.parentElement : el;
      targets.set(watched, el);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.get(entry.target)?.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach((_, watched) => revealObserver.observe(watched));

    // Parallax is a desktop nicety; phones get reveals and floating only.
    const parallaxEls = window.matchMedia("(min-width: 768px)").matches
      ? document.querySelectorAll<HTMLElement>("[data-parallax]")
      : [];
    const visible = new Set<HTMLElement>();
    const offsets = new WeakMap<HTMLElement, number>();

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        schedule();
      },
      { rootMargin: "25% 0px" },
    );
    parallaxEls.forEach((el) => parallaxObserver.observe(el));

    let frame = 0;
    function update() {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of visible) {
        const current = offsets.get(el) ?? 0;
        const rect = el.getBoundingClientRect();
        const axis = el.dataset.parallax === "x" ? "x" : "y";
        // Measure without the offset we applied ourselves.
        const center = rect.top + rect.height / 2 - (axis === "y" ? current : 0);
        const speed = Number(el.dataset.speed ?? 0.1);
        const next = Math.round((center - vh / 2) * -speed * 10) / 10;
        if (next === current) continue;
        offsets.set(el, next);
        el.style.setProperty(axis === "y" ? "--py" : "--px", `${next}px`);
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      revealObserver.disconnect();
      parallaxObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
