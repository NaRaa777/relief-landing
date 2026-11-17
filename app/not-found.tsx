import type { Metadata } from "next";
import Link from "next/link";
import { MessageShell } from "@/components/MessageShell";
import { BadgeArt, PhoneStage } from "@/components/PageArt";

export const metadata: Metadata = {
  title: "Page not found — Relief",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <MessageShell art={<PhoneStage screen="comfort" />}>
      <BadgeArt icon="question" />
      <p className="text-xs font-semibold tracking-[0.16em] text-blush uppercase">Error 404</p>
      <h1 className="mt-3 font-serif text-[2rem] leading-[1.1] tracking-tight sm:text-[2.4rem]">
        This page is taking a rest day.
      </h1>
      <p className="mt-3 text-base leading-relaxed text-cream/85 sm:text-lg">
        The link may be old or mistyped. Everything about Relief is on the home
        page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-full bg-cream px-7 text-base font-semibold text-plum transition-colors hover:bg-blush"
      >
        Back to Relief
      </Link>
    </MessageShell>
  );
}
