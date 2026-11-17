import { ImageResponse } from "next/og";

export const alt = "Relief — Be ready for the hard days. Early-access waitlist for painful periods.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#f2d6d0",
            }}
          />
          <div style={{ fontSize: 36, color: "#f8f1e9" }}>Relief</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>
            Be ready for the hard days.
          </div>
          <div style={{ fontSize: 30, color: "rgba(248,241,233,0.72)" }}>
            For painful periods · Join the early-access waitlist
          </div>
        </div>
      </div>
    ),
    size,
  );
}
