function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Relief",
  title: "Relief — Be ready for the hard days",
  description:
    "For women with painful periods. Relief helps you see your crampy, low-energy days coming and plan the comfort that actually helps, before they hit. Join the early-access waitlist.",
  shareDescription:
    "See your crampy, low-energy days coming and plan the comfort that helps. Join the Relief early-access waitlist.",
  url: resolveSiteUrl(),
  // Optional. When unset, the footer contact link is hidden.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
};
