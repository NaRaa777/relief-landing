import type { CSSProperties } from "react";

// The mechanism behind the promise, in plain words. Relief is in development,
// so this describes how it is designed to work, not results.
const steps = [
  {
    title: "Check in, in seconds",
    body: "Tap how you feel today: cramps, energy, mood. No long forms.",
  },
  {
    title: "Relief learns your pattern",
    body: "Over a few cycles, it notices which days tend to be your hardest.",
  },
  {
    title: "Get a heads-up and a plan",
    body: "A gentle nudge a few days ahead, with your comfort routine ready.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="below-fold relative overflow-hidden bg-cream-deep px-5 py-16 sm:px-8 sm:py-28 lg:py-32"
    >
      {/* Sculpted shapes beside the heading (desktop), like the other sections. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-16 right-[6%] hidden h-64 w-[34%] lg:block">
        <div data-parallax="y" data-speed="0.12" className="absolute top-0 right-[18%] aspect-square w-44">
          <div className="shape shape-blush animate-float-slow inset-0" />
        </div>
        <div data-parallax="y" data-speed="0.22" className="absolute top-36 right-0 h-12 w-36">
          <div className="shape shape-pearl animate-float inset-0 [--r:-18deg] [animation-delay:-3s]" />
        </div>
        <div data-parallax="y" data-speed="0.08" className="absolute top-24 left-[6%] aspect-square w-20">
          <div className="shape shape-plum animate-float-slow inset-0 [animation-delay:-6s]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <p data-reveal className="text-xs font-semibold tracking-[0.2em] text-rose-ink uppercase">
          02 — How it will work
        </p>
        <h2
          id="how-title"
          className="display mt-4 max-w-[14ch] text-[2.9rem] text-ink sm:mt-6 sm:text-[8vw] lg:text-[5.6vw] 2xl:text-[5.75rem]"
        >
          <span className="line-mask">
            <span data-reveal="line" className="block">Three small steps,</span>
          </span>
          <span className="line-mask">
            <em data-reveal="line" style={{ "--d": "120ms" } as CSSProperties} className="block text-wine">
              fewer surprises.
            </em>
          </span>
        </h2>

        <ol className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3 lg:gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--d": `${i * 120}ms` } as CSSProperties}
              className="flex gap-4 rounded-3xl bg-cream p-5 ring-1 ring-blush-deep/70 sm:items-center sm:gap-6 sm:p-7 lg:flex-col lg:items-start lg:gap-4"
            >
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-burgundy font-serif text-lg text-cream"
              >
                {i + 1}
              </span>
              <span>
                <span className="block font-serif text-xl leading-snug text-ink sm:text-2xl">{step.title}</span>
                <span className="mt-1 block text-base leading-relaxed text-ink-soft">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>

        <a
          href="#join"
          className="mt-8 hidden items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-base font-semibold text-cream transition-colors hover:bg-burgundy-deep md:inline-flex"
        >
          Join the waitlist
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
            <path d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
