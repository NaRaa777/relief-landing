import { Words } from "@/components/Words";

const notes = [
  { text: "The cramps that hit mid-meeting", pos: "lg:top-[6%] lg:right-[4%]", rot: "lg:rotate-3", speed: "0.12" },
  { text: "The plans you quietly cancel", pos: "lg:top-[40%] lg:right-[-2%]", rot: "lg:-rotate-2", speed: "0.2" },
  { text: "“It’s just a period”", pos: "lg:top-[68%] lg:right-[26%]", rot: "lg:rotate-2", speed: "0.08" },
  { text: "The heating pad you can never find", pos: "lg:bottom-[-14%] lg:right-[2%]", rot: "lg:-rotate-3", speed: "0.16" },
];

export function Statement() {
  return (
    <section
      aria-labelledby="statement-title"
      className="below-fold relative overflow-hidden py-16 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="px-5 text-xs font-semibold tracking-[0.2em] text-rose-ink uppercase sm:px-8">
          01 — The overlooked days
        </p>

        <div className="relative mt-5 sm:mt-8">
          <h2
            id="statement-title"
            data-words
            className="display max-w-[13ch] px-5 text-[2.9rem] text-ink sm:px-8 sm:text-[9vw] lg:max-w-[12ch] lg:text-[7vw] 2xl:text-[7rem]"
          >
            <Words
              segments={[
                { text: "Every month, a few days ask" },
                { text: "more", em: true },
                { text: "of you. Most of us just push through." },
              ]}
            />
          </h2>

          {/* Mobile: tags wrap so all four are readable. Desktop: floating tags. */}
          <ul
            aria-label="Sound familiar?"
            className="mt-7 flex flex-wrap gap-2 px-5 sm:px-8 lg:mt-0 lg:block lg:p-0"
          >
            {notes.map((note, i) => (
              <li
                key={note.text}
                data-parallax="y"
                data-speed={note.speed}
                className={`lg:absolute ${note.pos}`}
              >
                <span
                  data-reveal
                  style={{ "--d": `${200 + i * 100}ms` } as React.CSSProperties}
                  className={`inline-flex min-h-10 items-center rounded-full border border-burgundy/30 bg-white/70 px-3.5 text-[15px] whitespace-nowrap text-burgundy sm:min-h-11 sm:px-4 sm:text-base shadow-[0_10px_30px_-18px_rgb(107_38_51/0.6)] transition-[rotate,background-color,color] duration-500 lg:bg-cream lg:hover:rotate-0 lg:hover:bg-burgundy lg:hover:text-cream ${note.rot}`}
                >
                  {note.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8 grid gap-10 px-5 sm:mt-16 sm:px-8 lg:mt-28 lg:grid-cols-12">
          <div aria-hidden="true" className="relative hidden lg:col-span-5 lg:block">
            <div data-parallax="y" data-speed="0.12" className="absolute -top-6 left-[8%] aspect-square w-44">
              <div className="shape shape-blush animate-float-slow inset-0" />
            </div>
            <div data-parallax="y" data-speed="0.22" className="absolute top-16 left-[42%] h-12 w-36">
              <div className="shape shape-pearl animate-float inset-0 [--r:24deg] [animation-delay:-2s]" />
            </div>
          </div>
          <p
            data-reveal
            className="max-w-xl text-lg leading-relaxed text-ink-soft sm:text-2xl lg:col-span-6 lg:col-start-7"
          >
            It&rsquo;s a real part of life that usually gets handled alone, on the
            fly, and without much kindness. Relief starts from a simple idea:{" "}
            <span className="text-ink">you deserve better than just getting through it.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
