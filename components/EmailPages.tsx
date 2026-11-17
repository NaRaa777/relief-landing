"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const heading = "font-serif text-[1.9rem] leading-tight tracking-tight";
const body = "mt-3 text-base leading-relaxed text-cream/85";
const primary =
  "inline-flex h-13 w-full items-center justify-center rounded-full bg-cream px-7 text-base font-semibold text-plum transition-colors hover:bg-blush";
const secondary = "mt-5 self-center rounded-md px-2 py-2 text-[15px] text-cream/85 underline underline-offset-4 hover:text-cream";

/** /confirmed — where the "Confirm my email" link lands. */
export function ConfirmedMessage() {
  const status = useSearchParams().get("status");

  if (status === "expired") {
    return (
      <>
        <h1 className={heading}>This link has expired</h1>
        <p className={body}>
          Confirmation links work for 14 days. Join again with the same email and
          we&rsquo;ll send you a fresh one.
        </p>
        <Link href="/#join" className={`${primary} mt-8`}>
          Join the waitlist
        </Link>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
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
      <h1 className={heading}>You&rsquo;re confirmed 💌</h1>
      <p className={body}>
        Thank you. We&rsquo;ll email you when early access to Relief opens, and
        only about Relief.
      </p>
      <Link href="/" className={`${primary} mt-8`}>
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
        <h1 className={heading}>You&rsquo;re unsubscribed</h1>
        <p className={body}>You won&rsquo;t get any more emails about Relief. Take care of yourself.</p>
        <Link href="/" className={secondary}>
          Back to Relief
        </Link>
      </>
    );
  }

  if (status === "invalid" || (!status && !token)) {
    return (
      <>
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
      <h1 className={heading}>Unsubscribe from Relief?</h1>
      <p className={body}>You&rsquo;ll stop getting emails about Relief&rsquo;s early access.</p>
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
