import type { CSSProperties, ReactNode } from "react";
import { ConceptCarousel } from "@/components/ConceptCarousel";
import {
  ComfortRoutineScreen,
  CycleOverviewScreen,
  DailyCheckInScreen,
  UpcomingDaysScreen,
} from "@/components/mockups/Screens";

type Screen = {
  title: string;
  body: string;
  screen: ReactNode;
  /** Desktop stage placement */
  x: string;
  y: string;
  w: string;
  speed: string;
};

// Most differentiating first; the cycle overview is the least unique.
const screens: Screen[] = [
  {
    title: "Upcoming days",
    body: "Know which days will hit harder, before they arrive.",
    screen: <UpcomingDaysScreen />,
    x: "1%",
    y: "4%",
    w: "23%",
    speed: "0.05",
  },
  {
    title: "Comfort routine",
    body: "Your go-to comforts, ready when you need them.",
    screen: <ComfortRoutineScreen />,
    x: "26.5%",
    y: "14%",
    w: "21.5%",
    speed: "0.12",
  },
  {
    title: "Daily check-in",
    body: "A quick check-in to spot your own patterns.",
    screen: <DailyCheckInScreen />,
    x: "52%",
    y: "2%",
    w: "21.5%",
    speed: "0.08",
  },
  {
    title: "Cycle overview",
    body: "Where you are in your cycle, at a glance.",
    screen: <CycleOverviewScreen id="concept-cycle" />,
    x: "77.5%",
    y: "16%",
    w: "21.5%",
    speed: "0.16",
  },
];

export function ConceptReveal() {
  return (
    <section
      id="concept"
      aria-labelledby="concept-title"
      className="below-fold relative overflow-hidden bg-blush py-16 md:grain sm:py-28 lg:py-36"
    >
      {/* Oversized background word (desktop only) */}
      <p
        aria-hidden="true"
        data-parallax="x"
        data-speed="0.25"
        className="display pointer-events-none absolute top-[26%] left-0 hidden text-[34vw] whitespace-nowrap text-burgundy/[0.06] italic select-none lg:block"
      >
        first look · first look
      </p>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p data-reveal className="text-xs font-semibold tracking-[0.2em] text-rose-ink uppercase">
            03 — A first look at Relief
          </p>
          <h2
            id="concept-title"
            className="display mt-4 text-[2.9rem] text-ink sm:text-[9vw] lg:mt-6 lg:text-[6.2vw] 2xl:text-[6.25rem]"
          >
            <span className="line-mask">
              <span data-reveal="line" className="block">Plan for the days</span>
            </span>
            <span className="line-mask">
              <em data-reveal="line" style={{ "--d": "120ms" } as CSSProperties} className="block text-wine">
                that hit hardest.
              </em>
            </span>
          </h2>
        </div>
        <p data-reveal className="text-base text-ink-soft italic lg:pb-3">
          Early concept designs.
        </p>
      </div>

      <ConceptCarousel
        items={screens.map((s, i) => ({
          label: s.title,
          style: { "--x": s.x, "--y": s.y, "--w": s.w } as CSSProperties,
          content: (
            <div data-parallax="y" data-speed={s.speed} className="w-full max-w-[250px] lg:max-w-none">
              <figure data-reveal="scale" style={{ "--d": `${i * 100}ms` } as CSSProperties} className="group">
                <div
                  className="animate-float transition-transform duration-700 ease-[var(--ease-out-soft)] lg:group-hover:-translate-y-3"
                  style={{ animationDelay: `${i * -1.7}s` }}
                >
                  {s.screen}
                </div>
                <figcaption className="mt-5 flex gap-3 lg:mt-7">
                  <span className="pt-1 font-serif text-sm text-wine">0{i + 1}</span>
                  <span>
                    <span className="block font-serif text-xl text-ink">{s.title}</span>
                    <span className="mt-1 block text-base leading-snug text-ink-soft">{s.body}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ),
        }))}
      />
    </section>
  );
}
