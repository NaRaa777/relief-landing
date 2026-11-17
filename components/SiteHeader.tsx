import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

// Logo only: the hero form and the sticky mobile CTA cover signup, and
// fewer links means fewer ways to leave the page.
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 text-cream">
      <a
        href="#main"
        className="sr-only rounded-full bg-cream px-4 py-2 text-burgundy focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center px-5 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-8 sm:pt-[calc(1.75rem+env(safe-area-inset-top))]">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md" aria-label="Relief home">
          <Wordmark />
        </Link>
      </div>
    </header>
  );
}
