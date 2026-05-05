import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#080c14",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Egg shape via SVG */}
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
          <defs>
            <radialGradient id="g" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#fff5b3" />
              <stop offset="45%" stopColor="#ffd21a" />
              <stop offset="100%" stopColor="#806400" />
            </radialGradient>
          </defs>
          <ellipse cx="11" cy="15" rx="9" ry="11" fill="url(#g)" />
          {/* gloss */}
          <ellipse cx="8" cy="11" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
