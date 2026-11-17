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
  privacy/page.tsx         Privacy page linked from the footer
  api/waitlist/route.ts    Validates and stores emails + attribution, sets the signup cookie
  api/survey/route.ts      Stores the /welcome survey (who = signup cookie)
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
  sections/                Hero, Statement, ConceptReveal, Join
  mockups/                 Phone frame + concept app screens
  SiteHeader.tsx, SiteFooter.tsx, Words.tsx, Wordmark.tsx
lib/
  waitlist.ts              Shared validation, survey options, event names
  supabase.ts              Server-side inserts via Supabase's REST API
  signup-session.ts        Encrypted httpOnly cookie linking /welcome to a signup
  client/                  analytics, UTM/referrer capture, shared signup state
  site.ts                  Site name, description, URL, contact email
supabase/schema.sql        Tables, insert-only RLS policies, reporting views
proxy.ts                   Sends visitors without a signup cookie from /welcome to /
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
   It creates the `waitlist`, `waitlist_survey` and `events` tables with
   insert-only RLS policies (the public key can't read anything), plus two
   views for reading results. It's safe to re-run: on an existing project it
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
| `SIGNUP_COOKIE_SECRET` | Optional | Encrypts the 1-hour cookie linking `/welcome` answers to a signup. Defaults to a key derived from `SUPABASE_ANON_KEY`. |

## Reading the results

In **SQL Editor** (or Table Editor → views):

```sql
-- Visitors → form focus → sign-ups → survey, per day and UTM source
select * from funnel_daily;

-- Every sign-up with its latest survey answers
select * from waitlist_with_survey order by signed_up_at desc;

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
and landing path. Events are mirrored to `window.dataLayer` if you later add a
tag manager (or the TikTok Pixel for ads).

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
- Answers are saved in one request at the end (`completed = true`). If the
  visitor leaves mid-way, what they answered so far is saved with
  `completed = false`.
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
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project** and import the repository (the framework
   is detected automatically).
3. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY` and, once you have a domain,
   `NEXT_PUBLIC_SITE_URL` under **Settings → Environment Variables**.
4. Deploy. Test one signup on the live URL and check it in Supabase.

## Copy guidelines

US English, warm and direct, short sentences. Say "cramps" and "painful
periods" plainly. Never claim Relief relieves, treats, cures or reduces pain:
talk about anticipating, planning, comfort and feeling prepared. No invented
numbers, testimonials or social proof. The concept section carries a single
"Early concept designs." label, and the footer disclaimer says the app is in
development.
