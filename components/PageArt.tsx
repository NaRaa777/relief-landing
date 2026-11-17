import { ComfortRoutineScreen, HeadsUpScreen } from "@/components/mockups/Screens";

// Brand illustrations for the small, focused pages (/welcome, /confirmed,
// /unsubscribe, 404). Same sculpted shapes and phone mockups as the landing
// page, so these pages feel like part of it. Purely decorative.

type Screen = "heads-up" | "comfort" | "none";

/** Desktop (lg+) right-hand stage: a floating phone among 3D shapes. */
export function PhoneStage({ screen = "heads-up" }: { screen?: Screen }) {
  return (
    <div aria-hidden="true" className="relative hidden h-[min(680px,78vh)] min-h-[520px] lg:block">
      <div className="absolute top-[2%] right-[-8%] aspect-square w-[78%]">
        <div className="shape shape-rose animate-drift inset-0" />
      </div>
      <div className="absolute bottom-[8%] left-[0%] aspect-square w-[24%]">
        <div className="shape shape-plum animate-float-slow inset-0" />
      </div>
      {screen !== "none" ? (
        <div className="absolute top-[4%] left-1/2 w-[50%] max-w-[290px] -translate-x-1/2">
          <div className="animate-float [--r:-5deg]">
            {screen === "heads-up" ? <HeadsUpScreen /> : <ComfortRoutineScreen />}
          </div>
        </div>
      ) : (
        <div className="absolute top-[34%] left-[22%] aspect-square w-[34%]">
          <div className="shape shape-blush animate-float-slow inset-0 [animation-delay:-3s]" />
        </div>
      )}
      <div className="absolute right-[2%] bottom-[16%] h-[8%] w-[30%]">
        <div className="shape shape-pearl animate-float inset-0 [--r:-24deg] [animation-delay:-4s]" />
      </div>
    </div>
  );
}

export { BadgeArt } from "@/components/BadgeArt";
