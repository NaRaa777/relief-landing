# Relief — waitlist landing page

A mobile-first landing page for **Relief**, a pre-launch iOS app for women
with painful periods: it helps them anticipate their harder days and prepare
comfort routines in advance. The page exists to validate demand from TikTok
traffic (US, women 18–34, mostly inside TikTok's in-app browser). The one
success metric is the waitlist sign-up rate. It is **not** the app itself.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase
(waitlist storage, via its REST API — no client library) · Vercel.

## Project structure

```
app/
  page.tsx                 Landing page (composes the sections)
  welcome/page.tsx         Post-signup page: 3-question survey + share
  confirmed/page.tsx       Where the confirmation email's link lands
  unsubscribe/page.tsx     Unsubscribe button (link from every email)
  privacy/page.tsx         Privacy page linked from the footer
  api/waitlist/route.ts    Validates and stores emails, sets the signup cookie, sends the confirmation email
  api/survey/route.ts      Stores the /welcome survey (who = signup cookie)
  api/confirm/route.ts     Records an email confirmation (double opt-in)
  api/unsubscribe/route.ts Records an unsubscribe (form + RFC 8058 one-click)
  api/events/route.ts      First-party analytics sink (always 204)
  layout.tsx               Fonts, SEO and social metadata
  opengraph-image.tsx      Generated 1200×630 social sharing image
  icon.svg, robots.ts, sitemap.ts
components/
  WaitlistForm.tsx         Signup form used in the hero and the final CTA
  WelcomeSurvey.tsx        One-question-per-screen survey and thank-you step
  ShareBlock.tsx           Native share sheet with copy-link fallback
  StickyCta.tsx            Mobile bottom "Join the waitlist" bar
  ConceptCarousel.tsx      Swipe carousel with dots (mobile) / stage (desktop)
  Analytics.tsx            Records page_view
  MotionProvider.tsx       Scroll reveals + desktop parallax
  sections/                Hero, Statement, HowItWorks, ConceptReveal, Join
  TikTokPixel.tsx          Optional TikTok Pixel (off without an ID)
  EmailPages.tsx, MessageShell.tsx  Confirmed / unsubscribe pages
  mockups/                 Phone frame + concept app screens
  SiteHeader.tsx, SiteFooter.tsx, Words.tsx, Wordmark.tsx
lib/
  waitlist.ts              Shared validation, survey options, event names
  supabase.ts              Server-side inserts via Supabase's REST API
  signup-session.ts        Encrypted, expiring email tokens (signup cookie, email links)
  email.ts                 Confirmation email via Resend's REST API
  rate-limit.ts            In-memory per-IP rate limiter for the API routes
  client/                  analytics, UTM/referrer capture, shared signup state
  site.ts                  Site name, description, URL, contact email
supabase/schema.sql        Tables, insert-only RLS policies, reporting views
proxy.ts                   Sends visitors without a signup cookie from /welcome to /
tests/                     Vitest unit tests (tokens, rate limit, validation, email)
```

## Local setup

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Without Supabase credentials the page still renders, but submitting the form
returns a clear **"Waitlist storage isn't configured"** message in development
(and a generic "temporarily unavailable" message in production). Signups are
never faked.

### Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
   It creates the `waitlist`, `waitlist_survey`, `waitlist_confirmations`,
   `waitlist_unsubscribes` and `events` tables with insert-only RLS policies
   (the public key can't read anything), plus views for reading results. It's safe to re-run: on an existing project it
   just adds the new columns and tables.
3. In **Project Settings → API**, copy the project URL and the **anon /
   publishable** key into `.env.local`:

   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-or-publishable-key
   ```

   Don't use the `service_role` / secret key — it bypasses RLS and isn't
   needed. The key is only read on the server and never sent to the browser.
4. Restart `npm run dev` and submit the form. New rows appear in
   **Table Editor → waitlist**. Submitting the same email again shows
   "You're already on the list" instead of creating a duplicate.

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Anon / publishable key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO and social previews. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Enables the footer "Contact" link and is shown on `/privacy` |
| `SIGNUP_COOKIE_SECRET` | Yes in production | Encrypts the `/welcome` signup cookie and the email links. A long random string. |
| `RESEND_API_KEY`, `EMAIL_FROM` | For email | Sends the confirmation email (double opt-in). Without them, no email is sent. |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Optional | Turns on the TikTok Pixel (page view + `CompleteRegistration`), and the matching paragraph on `/privacy`. |

## Reading the results

In **SQL Editor** (or Table Editor → views):

```sql
-- Visitors → form focus → sign-ups → survey, per day and UTM source
select * from funnel_daily;

-- Every sign-up with confirmation, unsubscribe and survey answers
select * from waitlist_with_survey order by signed_up_at desc;

-- The only list you should email: confirmed and not unsubscribed
select * from waitlist_mailable;

-- Answer breakdowns
select pain_level, count(*) from waitlist_survey group by 1 order by 2 desc;
select would_pay, count(*) from waitlist_survey group by 1 order by 2 desc;
```

Share links carry `utm_source=share&utm_medium=referral`, so referred
sign-ups show up as their own source.

**Use UTMs on every TikTok link** (for example
`?utm_source=tiktok&utm_medium=organic&utm_campaign=<video-name>`). TikTok's
in-app browser usually sends no referrer, so without UTMs most traffic looks
like "(none)".

## Analytics events

| Event | When | Props |
| --- | --- | --- |
| `page_view` | Page load | — |
| `form_focus` | First focus of a form's email field | `source` (`hero` / `final_cta`) |
| `signup_submitted` | Successful sign-up (new or duplicate) | `source`, `status` (`joined` / `already_joined`) |
| `welcome_viewed` | `/welcome` opened after signup | — |
| `survey_step_completed` | A question answered | `step` (`1`–`3`) |
| `survey_skipped` | "Skip" tapped on a question | `step` (`1`–`3`) |
| `survey_completed` | Survey answers saved | `pain_level`, `current_methods`, `would_pay` |
| `share_clicked` | Share button tapped | `method` (`native` / `copy`) |

Each event also stores a random per-tab session ID, the path, UTMs, referrer
and landing path. Events are mirrored to `window.dataLayer`.

To add an event, add its name to `EVENT_NAMES` in `lib/waitlist.ts`. The
database only checks the format (lowercase and underscores), so no SQL change
is needed.

If `NEXT_PUBLIC_TIKTOK_PIXEL_ID` is set, the landing page (only) loads the
TikTok Pixel and reports `CompleteRegistration` on new signups. It never
receives the email or survey answers.

## Waitlist behavior

- Client and server both validate the email, with friendly inline errors; the
  server is the source of truth.
- The button is disabled with a loading state while submitting, and a request
  guard prevents double submissions.
- Duplicate emails get "You're already on the list" — never an error.
- After signing up (new or duplicate), the visitor goes to `/welcome`: one
  optional question per screen, then a thank-you with a native share sheet
  (copy-link fallback). The email never appears in a URL: `/api/waitlist`
  sets a 1-hour, httpOnly, AES-GCM-encrypted cookie, and `/api/survey` reads
  the email from it. Opening `/welcome` without that cookie redirects home.
- Survey answers are health information. A consent notice is shown before the
  first question, and answers are saved in one request only when the visitor
  finishes (`completed = true`, with the `consent_version` she saw). Nothing
  is saved if she leaves mid-way.
- New signups get one confirmation email (double opt-in). Its links carry
  encrypted tokens, never the email. Confirming records a row in
  `waitlist_confirmations`; every email has an unsubscribe link (page with a
  button, plus the RFC 8058 one-click header). Only email `waitlist_mailable`.
- The API routes are rate-limited per IP (in memory: waitlist 5/min, survey
  5/10 min, events 120/min).
- Signup state is shared across the page: the other form shows "You're on the
  list" and the mobile sticky CTA disappears. Only a "joined" flag is kept in
  `localStorage` (never the email).
- A hidden honeypot field quietly rejects simple bots.

## Performance & accessibility

- No images or WebGL: the 3D shapes are CSS gradients, and the phone screens
  are HTML, so there is nothing heavy to download. Film grain and parallax are
  desktop-only; below-the-fold sections use `content-visibility: auto`.
- Hero entrances are pure CSS; scroll reveals are driven by `MotionProvider`
  via `data-reveal`, `data-words` and `data-parallax`. Content stays visible
  without JavaScript, and all motion is disabled for `prefers-reduced-motion`.
- Body text is ≥ 16px on mobile with WCAG AA contrast, inputs are 16px (no iOS
  zoom), and tap targets are ≥ 44px.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npm test        # Vitest unit tests
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project** and import the repository (the framework
   is detected automatically).
3. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SIGNUP_COOKIE_SECRET`,
   `RESEND_API_KEY`, `EMAIL_FROM` and, once you have a domain,
   `NEXT_PUBLIC_SITE_URL` under **Settings → Environment Variables**.
4. In **Firewall → Rules**, add a rate-limit rule for `/api/` (for example
   30 requests per minute per IP). The in-app limiter is per server instance;
   this one is global.
5. Deploy. Test one signup on the live URL, click the confirmation email, and
   check both rows in Supabase.

Before emailing the list about launch: marketing emails in the US
(CAN-SPAM) must include a physical postal address, and the survey stores
health information, so have the privacy page reviewed by a lawyer.

## Copy guidelines

US English, warm and direct, short sentences. Say "cramps" and "painful
periods" plainly. Never claim Relief relieves, treats, cures or reduces pain:
talk about anticipating, planning, comfort and feeling prepared. No invented
numbers, testimonials or social proof. The concept section carries a single
"Early concept designs." label, and the footer disclaimer says the app is in
development.
