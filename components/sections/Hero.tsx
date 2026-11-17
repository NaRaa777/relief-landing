import { WaitlistForm } from "@/components/WaitlistForm";
import { HeadsUpScreen } from "@/components/mockups/Screens";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-plum text-cream md:grain lg:min-h-[100svh]"
    >
      {/* Light environment */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-30%] h-[80%] w-[110%] rounded-full bg-[radial-gradient(closest-side,#7a2a3d,transparent)] opacity-80 lg:right-[-10%] lg:w-[80%]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-plum-deep/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:px-8 sm:pt-[calc(7rem+env(safe-area-inset-top))] lg:pt-[calc(9rem+env(safe-area-inset-top))]">
        <div className="relative z-20 lg:max-w-[56%]">
          <p className="animate-rise text-xs leading-snug font-semibold tracking-[0.14em] text-blush uppercase sm:tracking-[0.22em]">
            Early access · For women with painful periods
          </p>

          <h1
            id="hero-title"
            className="display mt-3 text-[3.4rem] sm:mt-6 sm:text-[11vw] lg:text-[8.2vw] 2xl:text-[8.5rem]"
          >
            <span className="line-mask">
              <span className="animate-line block [animation-duration:0.9s]">Be ready</span>
            </span>
            <span className="line-mask">
              <span className="animate-line block [animation-delay:80ms] [animation-duration:0.9s]">for the</span>
            </span>
            <span className="line-mask">
              <em className="animate-line block text-blush [animation-delay:160ms] [animation-duration:0.9s]">
                hard days.
              </em>
            </span>
          </h1>

          <p className="animate-rise mt-4 max-w-md text-base leading-[1.5] text-cream/90 [animation-delay:250ms] sm:mt-7 sm:text-lg">
            Relief helps you see your crampy, low-energy days coming &mdash; and plan
            the comfort you rely on, before they hit.
          </p>

          <div id="hero-form" className="animate-rise mt-5 max-w-md [animation-delay:320ms] sm:mt-8">
            <WaitlistForm
              source="hero"
              tone="dark"
              label="Your email address"
              hideLabel
              hint="Free. Early access invites only. No spam."
            />
          </div>
        </div>

        {/* Product stage */}
        <div
          aria-hidden="true"
          // Tall enough for the whole phone plus 24px for its tilt and shadow,
          // at every phone width: the phone is 62% of this stage's width
          // (min(22rem, 100vw - 2.5rem)) and 19.4/9 times as tall as wide.
          className="relative z-10 mx-auto mt-6 h-[calc(min(22rem,100vw-2.5rem)*1.3364+24px)] max-w-[22rem] sm:h-[660px] sm:max-w-md lg:absolute lg:top-0 lg:right-[-2%] lg:mt-0 lg:h-full lg:max-h-[960px] lg:w-[50%] lg:max-w-none"
        >
          <div data-parallax="y" data-speed="0.06" className="absolute top-[2%] right-[-30%] aspect-square w-[80%] lg:top-[6%] lg:right-[-14%]">
            <div className="animate-fade absolute inset-0">
              <div className="shape shape-rose animate-drift inset-0" />
            </div>
          </div>

          <div data-parallax="y" data-speed="0.14" className="absolute bottom-[22%] left-[-10%] aspect-square w-[34%] lg:bottom-[20%] lg:left-[6%]">
            <div className="shape shape-plum animate-float-slow inset-0" />
          </div>

          <div className="absolute top-0 left-1/2 z-10 w-[62%] max-w-[300px] -translate-x-1/2 lg:top-[16%] lg:left-[52%]">
            <div className="animate-rise [animation-delay:300ms]">
              <div className="animate-float [--r:-5deg]">
                <HeadsUpScreen />
              </div>
            </div>
          </div>

          {/* Behind the phone (z-0), so it never covers the mockup's content. */}
          <div data-parallax="y" data-speed="0.24" className="absolute right-[-6%] bottom-[18%] z-0 h-[10%] w-[34%] lg:right-[4%] lg:bottom-[9%] lg:w-[28%]">
            <div className="shape shape-pearl animate-float inset-0 [--r:-26deg] [animation-delay:-5s]" />
          </div>
        </div>
      </div>

      {/* Soft fade at the bottom edge (phones/tablets), so the phone's
          shadow melts into the section end instead of a hard cut. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-plum to-transparent lg:hidden" />
    </section>
  );
}
