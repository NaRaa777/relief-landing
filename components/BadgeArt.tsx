import type { ReactNode } from "react";

// Compact page illustration (no phone mockup), safe to use in client components.

const icons: Record<"check" | "mail" | "question", ReactNode> = {
  check: <path d="M8 16.5l5.2 5.2L24 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  mail: (
    <>
      <rect x="6" y="9" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2.4" />
      <path d="M7.5 11l8.5 6.5L24.5 11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  question: (
    <>
      <path d="M12 12.5a4 4 0 1 1 5.6 3.7c-1 .5-1.6 1.3-1.6 2.3v.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="23.5" r="1.7" fill="currentColor" />
    </>
  ),
};

/**
 * Compact illustration for the top of a page: a cream "pearl" badge with an
 * icon, held by the brand's 3D shapes. Hidden on desktop when `desktop` is
 * false (the PhoneStage takes over there).
 */
export function BadgeArt({ icon, desktop = false }: { icon: keyof typeof icons; desktop?: boolean }) {
  return (
    <div aria-hidden="true" className={`relative mb-8 h-36 w-full max-w-[18rem] ${desktop ? "" : "lg:hidden"}`}>
      <div className="shape shape-rose animate-drift top-1 left-[30%] size-32" />
      <div className="shape shape-plum animate-float-slow bottom-1 left-0 size-14" />
      <div className="shape shape-pearl animate-float top-4 right-2 h-7 w-20 [--r:-22deg]" />
      <div className="absolute top-[34%] left-[18%] grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff_0,#f8f1e9_45%,#e7bfb7_100%)] text-burgundy shadow-[0_24px_40px_-16px_rgb(10_2_6/0.75),inset_-6px_-8px_16px_rgb(150_70_80/0.25)]">
        <svg viewBox="0 0 32 32" className="size-9" fill="none">
          {icons[icon]}
        </svg>
      </div>
    </div>
  );
}
