import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy — Relief",
  description: "How Relief handles the email address you share when joining the waitlist.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
        <Link href="/" className="inline-block rounded-md text-burgundy" aria-label="Relief home">
          <Wordmark />
        </Link>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Privacy</h1>
        <p className="mt-4 text-ink-soft">
          Relief is a period-care app that is still in development. This page
          explains what happens with the information you share on this website.
        </p>

        <div className="mt-12 space-y-10 leading-relaxed text-ink [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_p]:mt-3 [&_p]:text-ink-soft">
          <section>
            <h2>What we collect</h2>
            <p>
              When you join the waitlist, we store your email address, the date
              you signed up, which signup form you used, and how you found us
              (campaign tags in the link you clicked and the referring site, if
              any).
            </p>
            <p>
              After signing up you can answer a short, optional survey: how
              painful your periods usually are, what you use to get through
              them, and whether you&rsquo;d pay for an app like Relief. Your
              answers are stored with your email. You can skip it entirely.
            </p>
            <p>
              We also record anonymous usage events on this page (a visit, using
              the form, signing up, finishing the survey) with a random session
              ID, so we can see how well the page works. We don&rsquo;t use
              advertising cookies or third-party trackers.
            </p>
          </section>
          <section>
            <h2>How we use it</h2>
            <p>
              We use your email only to tell you about Relief&rsquo;s early
              access and development. Survey answers and usage data help us
              decide what to build. We don&rsquo;t sell or rent your information
              to anyone.
            </p>
          </section>
          <section>
            <h2>Where it&rsquo;s stored</h2>
            <p>
              This information is stored with our database provider, Supabase,
              and this site is hosted on Vercel.
            </p>
          </section>
          <section id="contact">
            <h2>Removing your data</h2>
            <p>
              You can ask us to remove your email and survey answers at any time
              {site.contactEmail ? (
                <>
                  {" "}by writing to{" "}
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="text-burgundy underline underline-offset-4"
                  >
                    {site.contactEmail}
                  </a>
                </>
              ) : (
                " by replying to any email we send you"
              )}
              .
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-14 inline-flex rounded-full bg-burgundy px-6 py-3 font-medium text-cream hover:bg-burgundy-deep"
        >
          Back to Relief
        </Link>
      </main>

      <SiteFooter />
    </>
  );
}
