import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eggthropic — Independent Claude Lab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080c14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: 600,
            height: 400,
            background: "radial-gradient(ellipse, rgba(245,185,48,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Egg icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 18,
            background: "rgba(245,185,48,0.12)",
            border: "1.5px solid rgba(245,185,48,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <svg viewBox="0 0 32 32" width={52} height={52}>
            <defs>
              <radialGradient id="g" cx="38%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="55%" stopColor="#f5b930" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            <ellipse cx="16" cy="17.5" rx="9.5" ry="11.5" fill="url(#g)" />
            <ellipse cx="13" cy="13" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.35)" transform="rotate(-20,13,13)" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2.5px",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          Eggthropic
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            marginBottom: 36,
            letterSpacing: "-0.3px",
          }}
        >
          Independent Claude Lab
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Claude Code", "Agent Skills", "MCP", "UX Experiments"].map((label) => (
            <div
              key={label}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#64748b",
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 14,
            color: "#334155",
            letterSpacing: "0.5px",
          }}
        >
          www.eggthropic.com · Independent — not affiliated with Anthropic
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
