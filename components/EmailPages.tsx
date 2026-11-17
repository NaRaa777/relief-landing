"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgeArt } from "@/components/BadgeArt";
import { ShareBlock } from "@/components/ShareBlock";

const heading = "font-serif text-[2rem] leading-[1.1] tracking-tight sm:text-[2.4rem]";
const body = "mt-3 text-base leading-relaxed text-cream/85 sm:text-lg";
const primary =
  "inline-flex h-13 w-full items-center justify-center rounded-full bg-cream px-7 text-base font-semibold text-plum transition-colors hover:bg-blush";
const secondary =
  "mt-4 self-center rounded-md px-2 py-2 text-[15px] text-cream/85 underline underline-offset-4 hover:text-cream lg:self-start";

const nextSteps = [
  { title: "We build it with you", body: "The women on this list shape what Relief does first." },
  { title: "You’re first in", body: "When early access opens, you get the invite before anyone else." },
  { title: "Only emails about Relief", body: "No spam, ever. Leave with one tap whenever you like." },
];

function NextSteps() {
  return (
    <div className="mt-8 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 sm:p-6">
      <h2 className="text-xs font-semibold tracking-[0.16em] text-blush uppercase">What happens next</h2>
      <ol className="mt-4 space-y-4">
        {nextSteps.map((step, i) => (
          <li key={step.title} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-cream font-serif text-sm text-plum"
            >
              {i + 1}
            </span>
            <span>
              <span className="block font-medium">{step.title}</span>
              <span className="mt-0.5 block text-[15px] leading-snug text-cream/80">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** /confirmed — where the "Confirm my email" link lands. */
export function ConfirmedMessage() {
  const status = useSearchParams().get("status");

  if (status === "expired") {
    return (
      <>
        <BadgeArt icon="mail" />
        <h1 className={heading}>This link has expired</h1>
        <p className={body}>
          Confirmation links work for 14 days. Join again with the same email and
          we&rsquo;ll send you a fresh one.
        </p>
        <Link href="/#join" className={`${primary} mt-8`}>
          Join the waitlist
        </Link>
        <Link href="/" className={secondary}>
          Back to Relief
        </Link>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <BadgeArt icon="question" />
        <h1 className={heading}>We couldn&rsquo;t confirm that just now</h1>
        <p className={body}>Something went wrong on our side. Please tap the link in your email again in a moment.</p>
        <Link href="/" className={secondary}>
          Back to Relief
        </Link>
      </>
    );
  }

  return (
    <>
      <BadgeArt icon="check" />
      <h1 className={heading}>You&rsquo;re confirmed 💌</h1>
      <p className={body}>Thank you for being here. Your spot on the Relief waitlist is saved.</p>

      <NextSteps />

      <p className="mt-8 text-[15px] leading-snug text-cream/85">
        Know someone who dreads that time of the month? Send them Relief.
      </p>
      <ShareBlock tone="dark" className="mt-3 w-full" />
      <Link href="/" className={secondary}>
        Back to Relief
      </Link>
    </>
  );
}

/** /unsubscribe — a button, so link scanners can't unsubscribe anyone. */
export function UnsubscribeForm() {
  const params = useSearchParams();
  const status = params.get("status");
  const token = params.get("t");

  if (status === "done") {
    return (
      <>
        <BadgeArt icon="check" />
        <h1 className={heading}>You&rsquo;re unsubscribed</h1>
        <p className={body}>
          You won&rsquo;t get any more emails about Relief. Thank you for
          giving it a look, and take good care of yourself.
        </p>
        <Link href="/" className={`${primary} mt-8`}>
          Back to Relief
        </Link>
      </>
    );
  }

  if (status === "invalid" || (!status && !token)) {
    return (
      <>
        <BadgeArt icon="question" />
        <h1 className={heading}>This link doesn&rsquo;t work</h1>
        <p className={body}>
          Use the unsubscribe link at the bottom of any Relief email, or reply to
          that email and we&rsquo;ll remove you.
        </p>
        <Link href="/" className={secondary}>
          Back to Relief
        </Link>
      </>
    );
  }

  return (
    <>
      <BadgeArt icon="mail" />
      <h1 className={heading}>Unsubscribe from Relief?</h1>
      <p className={body}>
        You&rsquo;ll stop getting emails about Relief&rsquo;s early access. You
        can always join again later.
      </p>
      {status === "error" && (
        <p role="alert" className="mt-4 text-[15px] font-medium text-[#ffc7ce]">
          That didn&rsquo;t work on our side. Please try again in a moment.
        </p>
      )}
      <form action="/api/unsubscribe" method="post" className="mt-8">
        <input type="hidden" name="t" value={token ?? ""} />
        <button type="submit" className={primary}>
          Unsubscribe
        </button>
      </form>
      <Link href="/" className={secondary}>
        Keep me on the list
      </Link>
    </>
  );
}
