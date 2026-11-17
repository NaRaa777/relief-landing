import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy — Relief",
  description: "How Relief handles the email address and optional survey answers you share when joining the waitlist.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "November 17, 2026";
const tiktokPixel = Boolean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);

export default function PrivacyPage() {
  const contact = site.contactEmail ? (
    <a href={`mailto:${site.contactEmail}`} className="text-burgundy underline underline-offset-4">
      {site.contactEmail}
    </a>
  ) : null;

  return (
    <>
      {/* Plum header band: matches the plum page canvas behind the iOS status
          bar, like the top of every other page. */}
      <header className="bg-plum text-cream">
        <div className="mx-auto w-full max-w-3xl px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 sm:px-8">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md" aria-label="Relief home">
            <Wordmark />
          </Link>
        </div>
      </header>

      <main id="main" className="w-full flex-1 bg-cream">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Privacy</h1>
        <p className="mt-4 text-ink-soft">
          Relief is a period-care app that is still in development. This page
          explains what happens with the information you share on this website.
          Last updated {UPDATED}.
        </p>

        <div className="mt-12 space-y-10 leading-relaxed text-ink [&_h2]:scroll-mt-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_li]:mt-2 [&_p]:mt-3 [&_p]:text-ink-soft [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-soft">
          <section>
            <h2>Joining the waitlist</h2>
            <p>
              When you join, we store your email address, the date you signed
              up, which signup form you used, and how you found us (campaign
              tags in the link you clicked and the referring site, if any).
            </p>
            <p>
              We then send you one email asking you to confirm your address. If
              you don&rsquo;t confirm, we won&rsquo;t send you anything else.
            </p>
          </section>

          <section>
            <h2 id="survey">The optional survey (health information)</h2>
            <p>
              After signing up you can answer three optional questions: how
              painful your periods usually are, what you use to get through
              them, and whether you&rsquo;d pay for an app like Relief. This is
              information about your health, so we treat it with extra care:
            </p>
            <ul>
              <li>
                Your answers are saved, together with your email, only when you
                reach the end of the survey. If you skip or leave before the
                end, nothing is saved.
              </li>
              <li>We use them only to decide what to build. We never sell or share them.</li>
              <li>
                They are never sent to advertising or analytics companies.
              </li>
              <li>You can ask us to delete them at any time (see below).</li>
            </ul>
          </section>

          <section>
            <h2>Cookies and usage data</h2>
            <p>
              Right after you sign up, we set one short-lived cookie (it expires
              after one hour) so the survey page knows who is answering
              without putting your email in a link. Its contents are encrypted
              and can&rsquo;t be read by other websites or scripts.
            </p>
            <p>
              We also record usage events on this site (a visit, using the
              form, signing up, moving through the survey, sharing) with a
              random session ID, so we can see how well the page works. These
              events aren&rsquo;t linked to your email.
            </p>
            {tiktokPixel ? (
              <p>
                We use the TikTok Pixel to measure our TikTok ads. It is told
                when someone visits and when someone joins the waitlist, never
                your email or survey answers. You can limit ad tracking in your
                TikTok and device settings.
              </p>
            ) : (
              <p>We don&rsquo;t use advertising cookies or third-party trackers.</p>
            )}
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
              This information is stored with our database provider, Supabase.
              Confirmation emails are sent through our email provider, Resend.
              This site is hosted on Vercel.
            </p>
          </section>

          <section id="contact">
            <h2>Your choices</h2>
            <p>
              You can ask us to see, correct or delete your email and survey
              answers at any time
              {contact ? <> by writing to {contact}</> : " by replying to any email we send you"}.
              Every email we send has a link to unsubscribe.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-14 inline-flex rounded-full bg-burgundy px-6 py-3 font-medium text-cream hover:bg-burgundy-deep"
        >
          Back to Relief
        </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
