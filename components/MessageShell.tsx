import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/Wordmark";

/**
 * Calm, focused page in the /welcome style: logo, one message, and on
 * desktop an illustration on the right so the page never feels empty.
 */
export function MessageShell({ children, art }: { children: ReactNode; art?: ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-plum text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-30%] right-[-60%] h-[70%] w-[130%] rounded-full bg-[radial-gradient(closest-side,#7a2a3d,transparent)] opacity-70 sm:right-[-20%] sm:w-[80%]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-plum-deep/70 to-transparent" />
      </div>

      <header className="relative mx-auto w-full max-w-md px-5 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-[calc(2rem+env(safe-area-inset-top))] lg:max-w-6xl lg:px-8">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md" aria-label="Relief home">
          <Wordmark />
        </Link>
      </header>

      <main
        id="main"
        className="relative mx-auto grid w-full max-w-md flex-1 px-5 pt-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:pt-12 lg:max-w-6xl lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-0"
      >
        <div className="flex flex-col lg:max-w-md">{children}</div>
        {art}
      </main>
    </div>
  );
}
