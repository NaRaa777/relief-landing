import { ImageResponse } from "next/og";

export const alt = "Relief — Be ready for the hard days. Early-access waitlist for painful periods.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Be ready for the hard days.";
const WORDMARK = "Relief";
const SUBTITLE = "For painful periods · Join the early-access waitlist";

/**
 * Loads Fraunces (the site's display font) from Google Fonts, only for the
 * characters drawn here. Falls back to Georgia if the fetch fails, so the
 * build never breaks because of the network.
 */
async function loadFraunces(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const fraunces = await loadFraunces(HEADLINE + WORDMARK + SUBTITLE);
  const serif = fraunces ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 82% 30%, #e9b3ad 0%, #c47a80 14%, #7a2a3d 30%, rgba(122,42,61,0) 48%), radial-gradient(circle at 10% 100%, #4a1822 0%, rgba(74,24,34,0) 50%), #2c0f1c",
          color: "#f8f1e9",
          fontFamily: serif,
        }}
      >
        {/* Same mark as the site's Wordmark: a ring with a bright arc. */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="#f8f1e9" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M12 3.5a8.5 8.5 0 0 1 8 5.7" fill="none" stroke="#f8f1e9" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 44, letterSpacing: "-0.02em" }}>{WORDMARK}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 86, lineHeight: 1, letterSpacing: "-0.04em", maxWidth: 900 }}>
            {HEADLINE}
          </div>
          <div style={{ fontSize: 32, color: "rgba(248,241,233,0.78)" }}>{SUBTITLE}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fraunces ? [{ name: "Fraunces", data: fraunces, style: "normal", weight: 400 }] : undefined,
    },
  );
}
