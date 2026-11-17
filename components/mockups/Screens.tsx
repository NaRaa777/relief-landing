import { Phone, TabBar } from "@/components/mockups/Phone";

// Concept screens for the Relief app. Every value shown is sample content for
// illustration only; nothing here is a working feature.

type ScreenProps = { className?: string };

/* --------------------------------------------------------------------- */

export function CycleOverviewScreen({
  className,
  id = "cycle",
}: ScreenProps & { id?: string }) {
  const gradientId = `${id}-arc`;
  const r = 42;
  const c = 2 * Math.PI * r;
  const day = 24;
  const length = 28;
  const progress = day / length;
  const marker = progress * Math.PI * 2 - Math.PI / 2;

  return (
    <Phone className={className} surface="plum">
      <div className="mt-[0.6em] flex items-center justify-between">
        <div>
          <p className="text-[0.85em] text-cream/60">Tuesday, Nov 12</p>
          <p className="font-serif text-[1.55em] leading-tight">Your cycle</p>
        </div>
        <span className="grid size-[2.3em] place-items-center rounded-full bg-white/10 font-serif text-[0.95em]">
          J
        </span>
      </div>

      <div className="relative mx-auto mt-[1.2em] w-[88%]">
        <svg viewBox="0 0 100 100" className="w-full">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f2d6d0" />
              <stop offset="100%" stopColor="#c98b8b" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(248 241 233 / 0.1)" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${c * progress} ${c}`}
            transform="rotate(-90 50 50)"
          />
          {/* Likely period window ahead (days 26–28) */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#e0707f"
            strokeOpacity="0.55"
            strokeWidth="7"
            strokeDasharray={`${c * 0.06} ${c}`}
            strokeDashoffset={-c * 0.92}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx={50 + r * Math.cos(marker)}
            cy={50 + r * Math.sin(marker)}
            r="5.2"
            fill="#f8f1e9"
            stroke="#2c0f1c"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-[0.8em] tracking-[0.2em] text-cream/60 uppercase">Day</p>
          <p className="font-serif text-[4.2em] leading-[0.95] font-light">{day}</p>
          <p className="text-[0.85em] text-cream/60">of {length}</p>
        </div>
      </div>

      <div className="mt-[1.1em] rounded-[1.3em] bg-white/[0.07] p-[1em] ring-1 ring-white/10">
        <div className="flex items-center gap-[0.5em]">
          <span className="size-[0.6em] rounded-full bg-[#e0707f]" />
          <p className="text-[0.85em] text-cream/70">Period likely in</p>
        </div>
        <p className="mt-[0.2em] font-serif text-[1.45em]">About 4 days</p>
      </div>

      <div className="mt-[0.7em] grid grid-cols-2 gap-[0.7em]">
        {[
          ["Energy", "Lower"],
          ["Mood", "Steady"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[1.1em] bg-white/[0.07] p-[0.85em] ring-1 ring-white/10">
            <p className="text-[0.78em] text-cream/60">{k}</p>
            <p className="text-[1.05em] font-medium">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-[1em]">
        <TabBar active={0} light />
      </div>
    </Phone>
  );
}

/* --------------------------------------------------------------------- */

/** Hero screen: leads with the heads-up and the plan, not the calendar. */
export function HeadsUpScreen({ className }: ScreenProps) {
  const plan = [
    ["Pack heat patches", true],
    ["Keep Saturday slow", false],
    ["Move Friday’s spin class", false],
  ] as const;

  return (
    <Phone className={className} surface="ivory">
      <div className="mt-[0.4em] flex items-center justify-between">
        <p className="font-serif text-[1.55em] leading-tight">Coming up</p>
        <span className="rounded-full bg-blush px-[0.8em] py-[0.3em] text-[0.78em] font-medium text-burgundy">
          This week
        </span>
      </div>

      <div className="relative mt-[0.9em] overflow-hidden rounded-[1.5em] bg-[linear-gradient(150deg,#8e2f45,#4a1822)] p-[1.15em] text-cream">
        <span className="absolute -top-[2.2em] -right-[2.2em] size-[6.5em] rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2d6d0,#c98b8b_45%,transparent_72%)] opacity-60" />
        <p className="relative text-[0.78em] font-semibold tracking-[0.16em] text-blush uppercase">Heads up</p>
        <p className="relative mt-[0.3em] font-serif text-[1.75em] leading-[1.05]">Heavier days likely</p>
        <p className="relative mt-[0.35em] text-[1em] font-medium text-cream/90">Thu – Sat</p>
        <div className="relative mt-[0.9em] grid grid-cols-3 gap-[0.4em] text-center text-[0.75em]">
          {[
            ["Thu", "Cramps"],
            ["Fri", "Low energy"],
            ["Sat", "Cramps"],
          ].map(([d, k]) => (
            <span key={d} className="rounded-[0.9em] bg-white/12 px-[0.3em] py-[0.5em]">
              <span className="block font-semibold">{d}</span>
              <span className="block text-cream/80">{k}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="mt-[1.1em] text-[0.95em] font-semibold">Plan ahead</p>
      <ul className="mt-[0.5em] space-y-[0.5em]">
        {plan.map(([label, done]) => (
          <li
            key={label}
            className="flex items-center gap-[0.7em] rounded-[1em] bg-white px-[0.9em] py-[0.75em] ring-1 ring-blush-deep/70"
          >
            <span
              className={`grid size-[1.35em] shrink-0 place-items-center rounded-full ${
                done ? "bg-burgundy text-cream" : "ring-[0.12em] ring-rose"
              }`}
            >
              {done && (
                <svg viewBox="0 0 16 16" className="size-[0.8em]" fill="none">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span className="text-[0.98em] font-medium">{label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-[1em]">
        <TabBar active={1} />
      </div>
    </Phone>
  );
}

/* --------------------------------------------------------------------- */

export function UpcomingDaysScreen({ className }: ScreenProps) {
  const week = [
    ["M", 11],
    ["T", 12],
    ["W", 13],
    ["T", 14],
    ["F", 15],
    ["S", 16],
    ["S", 17],
  ] as const;

  return (
    <Phone className={className} surface="ivory">
      <p className="mt-[0.6em] text-[0.85em] text-ink-soft">November</p>
      <p className="font-serif text-[1.55em] leading-tight">Coming up</p>

      <div className="mt-[1em] grid grid-cols-7 gap-[0.3em] text-center">
        {week.map(([d, n]) => {
          const today = n === 12;
          const likely = n >= 14 && n <= 16;
          return (
            <div key={n} className="flex flex-col items-center gap-[0.35em]">
              <span className="text-[0.72em] text-ink-soft">{d}</span>
              <span
                className={`grid size-[2.15em] place-items-center rounded-full text-[0.9em] font-medium ${
                  likely
                    ? "bg-burgundy text-cream"
                    : today
                      ? "ring-[0.12em] ring-burgundy"
                      : "bg-cream-deep"
                }`}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-[1.1em] overflow-hidden rounded-[1.4em] bg-[linear-gradient(150deg,#8e2f45,#4a1822)] p-[1.1em] text-cream">
        <p className="text-[0.78em] tracking-[0.16em] text-blush/80 uppercase">Heads up</p>
        <p className="mt-[0.3em] font-serif text-[1.45em] leading-tight">Heavier days likely</p>
        <p className="mt-[0.2em] text-[0.88em] text-cream/75">Thu, Nov 14 – Sat, Nov 16</p>
        <div className="mt-[0.8em] flex gap-[0.3em]">
          {[1, 0.75, 0.5].map((o) => (
            <span key={o} className="h-[0.35em] flex-1 rounded-full bg-blush" style={{ opacity: o }} />
          ))}
        </div>
      </div>

      <p className="mt-[1.1em] text-[0.85em] font-medium text-ink-soft">Plan ahead</p>
      <ul className="mt-[0.5em] space-y-[0.5em]">
        {[
          ["Move Friday’s spin class", true],
          ["Pack heat patches", false],
          ["Keep Saturday slow", false],
        ].map(([label, done]) => (
          <li
            key={label as string}
            className="flex items-center gap-[0.7em] rounded-[1em] bg-white/80 px-[0.85em] py-[0.7em] ring-1 ring-blush-deep/60"
          >
            <span
              className={`grid size-[1.25em] shrink-0 place-items-center rounded-full ${
                done ? "bg-burgundy" : "ring-[0.1em] ring-rose"
              }`}
            >
              {done && <span className="block size-[0.4em] rounded-full bg-cream" />}
            </span>
            <span className={`text-[0.92em] ${done ? "text-ink-soft line-through" : ""}`}>{label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-[1em]">
        <TabBar active={1} />
      </div>
    </Phone>
  );
}

/* --------------------------------------------------------------------- */

export function ComfortRoutineScreen({ className }: ScreenProps) {
  const items = [
    ["Heating pad", "20 min", true],
    ["Ginger tea", "Before bed", true],
    ["Gentle stretching", "10 min", false],
    ["Phone off", "By 10 pm", false],
  ] as const;

  return (
    <Phone className={className} surface="blush">
      <p className="mt-[0.6em] text-[0.85em] text-ink-soft">Tonight</p>
      <p className="font-serif text-[1.55em] leading-tight">Your comfort kit</p>

      <div className="relative mt-[1em] overflow-hidden rounded-[1.5em] bg-plum p-[1.1em] text-cream">
        <span className="absolute -top-[2.5em] -right-[2em] size-[7em] rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2d6d0,#c98b8b_45%,#6b2633_85%)] opacity-90" />
        <p className="relative text-[0.78em] tracking-[0.16em] text-blush/80 uppercase">Routine</p>
        <p className="relative mt-[0.3em] font-serif text-[1.5em] leading-tight">
          Slow evening
        </p>
        <p className="relative text-[0.88em] text-cream/70">4 steps · about 45 min</p>
        <div className="relative mt-[0.9em] h-[0.4em] rounded-full bg-white/15">
          <div className="h-full w-1/2 rounded-full bg-blush" />
        </div>
      </div>

      <ul className="mt-[0.9em] space-y-[0.55em]">
        {items.map(([name, meta, done]) => (
          <li
            key={name}
            className="flex items-center gap-[0.8em] rounded-[1.1em] bg-cream px-[0.9em] py-[0.75em]"
          >
            <span className="grid size-[2.1em] shrink-0 place-items-center rounded-[0.7em] bg-blush">
              <span className="block size-[0.8em] rounded-full bg-rose" />
            </span>
            <span className="flex-1">
              <span className="block text-[0.95em] font-medium">{name}</span>
              <span className="block text-[0.78em] text-ink-soft">{meta}</span>
            </span>
            <span
              className={`grid size-[1.4em] place-items-center rounded-full ${
                done ? "bg-burgundy text-cream" : "ring-[0.1em] ring-rose"
              }`}
            >
              {done && (
                <svg viewBox="0 0 16 16" className="size-[0.8em]" fill="none">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-[1em]">
        <TabBar active={2} />
      </div>
    </Phone>
  );
}

/* --------------------------------------------------------------------- */

export function DailyCheckInScreen({ className }: ScreenProps) {
  const feelings = [
    ["Calm", false],
    ["Tired", true],
    ["Crampy", true],
    ["Bloated", false],
    ["Irritable", false],
    ["Hopeful", false],
  ] as const;

  return (
    <Phone className={className} surface="ivory">
      <p className="mt-[0.6em] text-[0.85em] text-ink-soft">Daily check-in</p>
      <p className="font-serif text-[1.55em] leading-[1.1]">How are you feeling today?</p>

      <div className="mt-[1em] flex flex-wrap gap-[0.45em]">
        {feelings.map(([label, on]) => (
          <span
            key={label}
            className={`rounded-full px-[0.9em] py-[0.45em] text-[0.88em] ${
              on ? "bg-burgundy text-cream" : "bg-white ring-1 ring-blush-deep"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {[
        ["Energy", 0.35],
        ["Cramps", 0.7],
        ["Sleep", 0.55],
      ].map(([label, value]) => (
        <div key={label as string} className="mt-[1em]">
          <div className="flex justify-between text-[0.85em]">
            <span className="font-medium">{label}</span>
            <span className="text-ink-soft">{Math.round((value as number) * 10)}/10</span>
          </div>
          <div className="relative mt-[0.45em] h-[0.45em] rounded-full bg-cream-deep">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f2d6d0,#8e2f45)]"
              style={{ width: `${(value as number) * 100}%` }}
            />
            <span
              className="absolute top-1/2 size-[1.2em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0.15em_0.5em_rgb(42_18_24/0.3)] ring-[0.12em] ring-burgundy"
              style={{ left: `${(value as number) * 100}%` }}
            />
          </div>
        </div>
      ))}

      <div className="mt-[1.1em] rounded-[1em] bg-white px-[0.9em] py-[0.8em] text-[0.88em] text-ink-soft/70 ring-1 ring-blush-deep/70">
        Anything else on your mind?
      </div>

      <div className="mt-[0.9em] rounded-full bg-burgundy py-[0.85em] text-center text-[0.95em] font-medium text-cream">
        Save check-in
      </div>

      <div className="mt-[1.1em] rounded-[1.2em] bg-white/80 p-[0.9em] ring-1 ring-blush-deep/60">
        <div className="flex justify-between text-[0.8em]">
          <span className="font-medium">This week</span>
          <span className="text-ink-soft">Energy</span>
        </div>
        <div className="mt-[0.7em] flex h-[3.2em] items-end gap-[0.45em]">
          {[0.8, 0.7, 0.75, 0.55, 0.4, 0.35, 0].map((h, i) => (
            <span key={i} className="flex flex-1 flex-col items-center gap-[0.3em]">
              <span
                className={`w-full rounded-full ${h ? "bg-rose" : "bg-cream-deep"} ${i === 5 ? "bg-wine" : ""}`}
                style={{ height: `${Math.max(h, 0.12) * 2.4}em` }}
              />
              <span className="text-[0.65em] text-ink-soft">{"MTWTFSS"[i]}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-[1em]">
        <TabBar active={3} />
      </div>
    </Phone>
  );
}
