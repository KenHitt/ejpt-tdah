import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "eJPT en 3 meses",
    short_name: "eJPT",
    description: "Entrenador de pentesting. Teoría y recall también sin red.",
    start_url: "/teoria",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#059669",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
