import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Screen background. */
  surface?: "ivory" | "blush" | "plum";
};

const surfaces = {
  ivory: "bg-cream text-ink",
  blush: "bg-[#f6e4df] text-ink",
  plum: "bg-plum text-cream",
};

/**
 * Concept device frame. Purely illustrative: screens inside are visual
 * concepts for an app that is still in development.
 */
export function Phone({ children, className = "", surface = "ivory" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[9/19.4] rounded-[15%/7%] bg-[linear-gradient(145deg,#3a1825,#12050a_55%,#2a0f19)] p-[2.6%] shadow-[0_50px_100px_-30px_rgb(20_4_10/0.75),0_18px_36px_-18px_rgb(20_4_10/0.6),inset_0_0_0_1px_rgb(255_255_255/0.12)] ${className}`}
    >
      <div
        className={`phone-screen relative size-full overflow-hidden rounded-[12.5%/5.8%] ${surfaces[surface]}`}
      >
        <div className="phone-ui flex h-full flex-col">
          <StatusBar light={surface === "plum"} />
          <div className="flex flex-1 flex-col px-[1.35em] pb-[1.1em]">{children}</div>
        </div>
        {/* Glass sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.22)_0%,rgb(255_255_255/0)_28%)]" />
      </div>
    </div>
  );
}

function StatusBar({ light }: { light: boolean }) {
  return (
    <div className="relative flex items-center justify-between px-[1.9em] pt-[1.05em] pb-[0.6em] text-[0.92em] font-semibold">
      <span>9:41</span>
      <span className="absolute top-[0.75em] left-1/2 h-[1.75em] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-[0.3em]">
        <span className="flex items-end gap-[0.12em]">
          {[0.4, 0.6, 0.8, 1].map((h) => (
            <span key={h} className="w-[0.22em] rounded-full bg-current" style={{ height: `${h * 0.8}em` }} />
          ))}
        </span>
        <span
          className={`relative ml-[0.2em] h-[0.85em] w-[1.7em] rounded-[0.25em] border ${
            light ? "border-cream/60" : "border-ink/50"
          } p-[0.1em]`}
        >
          <span className="block h-full w-[72%] rounded-[0.12em] bg-current" />
        </span>
      </span>
    </div>
  );
}

/** Bottom tab bar shared by the concept screens. */
export function TabBar({ active, light = false }: { active: number; light?: boolean }) {
  return (
    <div
      className={`mt-auto flex items-center justify-around rounded-full px-[1em] py-[0.85em] ${
        light ? "bg-white/10" : "bg-white/80 shadow-[0_0.4em_1.2em_-0.6em_rgb(107_38_51/0.35)]"
      }`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`block size-[0.6em] rounded-full ${
            i === active ? (light ? "bg-blush" : "bg-burgundy") : light ? "bg-cream/30" : "bg-ink/15"
          }`}
        />
      ))}
    </div>
  );
}
