import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#140404",
          color: "#ff3b3b",
          fontSize: 64,
          fontFamily: "monospace",
          fontWeight: 700,
        }}
      >
        eJ
      </div>
    ),
    { ...size }
  );
}
