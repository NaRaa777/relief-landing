import type { Metadata } from "next";
import { Wordmark } from "@/components/Wordmark";
import { WelcomeSurvey } from "@/components/WelcomeSurvey";

// Reached only right after signing up: proxy.ts sends everyone else home.
export const metadata: Metadata = {
  title: "You’re on the list — Relief",
  robots: { index: false, follow: false },
  alternates: { canonical: "/welcome" },
};

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-plum text-cream">
      {/* Soft brand light, kept away from the text column. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-30%] right-[-60%] h-[70%] w-[130%] rounded-full bg-[radial-gradient(closest-side,#7a2a3d,transparent)] opacity-70 sm:right-[-20%] sm:w-[80%]" />
        <div className="shape shape-rose animate-drift top-[-78px] right-[-58px] size-[136px] sm:top-[-80px] sm:right-[-40px] sm:size-[260px]" />
      </div>

      <header className="relative mx-auto w-full max-w-md px-5 pt-3 sm:pt-8">
        <Wordmark />
      </header>

      <main id="main" className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pt-10">
        <WelcomeSurvey />
      </main>
    </div>
  );
}
