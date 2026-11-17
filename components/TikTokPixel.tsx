import Script from "next/script";

// TikTok Pixel, for measuring TikTok ads. Off unless NEXT_PUBLIC_TIKTOK_PIXEL_ID
// is set. Loaded on the landing page only: it gets a page view and, from the
// waitlist form, a CompleteRegistration event. Never the email or any survey
// answer (see /privacy, which mentions the pixel only when it is on).

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";

export function TikTokPixel() {
  // Pixel IDs are uppercase letters and digits; anything else is ignored so
  // the value can't inject script.
  if (!/^[A-Z0-9]{10,32}$/.test(PIXEL_ID)) return null;

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load("${PIXEL_ID}");ttq.page();}(window,document,"ttq");`}
    </Script>
  );
}
