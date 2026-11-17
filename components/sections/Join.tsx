import type { CSSProperties } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ComfortRoutineScreen } from "@/components/mockups/Screens";

const perks = ["Free to join", "First invites to early access", "Only emails about Relief"];

// The founder's own story (first name is a pen name). Keep it true and short.
function FounderNote() {
  return (
    <figure data-reveal className="mb-12 max-w-md sm:mb-16">
      <blockquote className="font-serif text-[1.2rem] leading-relaxed text-ink sm:text-[1.35rem]">
        <p>
          I&rsquo;m Maya, 23, and painful periods have been part of my life for
          years. The hard days always seem to catch me off guard, right when I
          have plans. So I&rsquo;m building Relief to see them coming and feel
          ready.
        </p>
        <p className="mt-4">
          If your month looks a lot like mine, save your spot below. I&rsquo;d
          love to have you along for the ride. 💌
        </p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 text-base text-ink-soft">
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-full bg-burgundy font-serif text-lg text-cream"
        >
          M
        </span>
        <span>
          <span className="block font-medium text-ink">Maya</span>
          Founder of Relief
        </span>
      </figcaption>
    </figure>
  );
}

export function Join() {
  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="relative scroll-mt-4 overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-blush)_100%)] px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <FounderNote />

          <h2
            id="join-title"
            className="display text-[3.4rem] text-ink sm:text-[11vw] lg:text-[8vw] 2xl:text-[8.25rem]"
          >
            <span className="line-mask">
              <span data-reveal="line" className="block">Be first</span>
            </span>
            <span className="line-mask">
              <em data-reveal="line" style={{ "--d": "120ms" } as CSSProperties} className="block text-wine">
                in line.
              </em>
            </span>
          </h2>

          <p
            data-reveal
            style={{ "--d": "150ms" } as CSSProperties}
            className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft sm:mt-8"
          >
            Join the waitlist and help shape what Relief becomes.
          </p>

          <div data-reveal style={{ "--d": "250ms" } as CSSProperties} className="mt-6 max-w-md sm:mt-8">
            <WaitlistForm source="final_cta" label="Your email address" hideLabel />
          </div>

          <ul className="mt-4 flex flex-col gap-2 text-base text-ink sm:flex-row sm:flex-wrap sm:gap-x-6">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-wine" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden="true" className="relative hidden h-[680px] lg:col-span-5 lg:block">
          <div data-parallax="y" data-speed="0.1" className="absolute top-[4%] right-[-10%] aspect-square w-[80%]">
            <div className="shape shape-rose animate-drift inset-0" />
          </div>
          <div data-parallax="y" data-speed="0.22" className="absolute bottom-[8%] left-0 aspect-square w-[30%]">
            <div className="shape shape-blush animate-float-slow inset-0" />
          </div>
          <div className="absolute top-[6%] left-1/2 w-[58%] max-w-[290px] -translate-x-1/2">
            <div data-reveal="scale">
              <div className="animate-float [--r:6deg]">
                <ComfortRoutineScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
