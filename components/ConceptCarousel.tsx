"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type CarouselItem = {
  label: string;
  content: ReactNode;
  /** Desktop stage placement (CSS variables --x, --y, --w). */
  style: CSSProperties;
};

/**
 * Mobile: one-phone-at-a-time swipe carousel with snap and dots.
 * Desktop (lg+): the same items placed on an art-directed stage.
 */
export function ConceptCarousel({ items }: { items: CarouselItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function goTo(i: number) {
    const track = trackRef.current;
    const el = track?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (!track || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <>
      <ul
        ref={trackRef}
        aria-label="Early concept designs"
        className="relative mt-10 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:mx-auto lg:mt-16 lg:block lg:aspect-[1/0.64] lg:max-w-7xl lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li
            key={item.label}
            data-index={i}
            style={item.style}
            aria-label={`${i + 1} of ${items.length}: ${item.label}`}
            className="flex w-full shrink-0 snap-center justify-center px-14 sm:px-28 lg:absolute lg:top-[var(--y)] lg:left-[var(--x)] lg:block lg:w-[var(--w)] lg:px-0"
          >
            {item.content}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center gap-1 lg:hidden">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${item.label}`}
            aria-current={active === i}
            className="grid size-11 place-items-center"
          >
            <span
              className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                active === i ? "w-6 bg-burgundy" : "w-2 bg-burgundy/35"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
