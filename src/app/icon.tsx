import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#10b981",
          fontSize: 72,
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
