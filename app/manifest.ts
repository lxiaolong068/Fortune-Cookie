import { MetadataRoute } from "next";
import { getBlobUrl } from "@/lib/blob-urls";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fortune Cookie - AI Generator",
    short_name: "Fortune Cookie AI",
    description:
      "Free online AI-powered fortune cookie generator with personalized messages and lucky numbers",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f59e0b",
    icons: [
      {
        src: getBlobUrl("/favicon-16x16.png"),
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: getBlobUrl("/favicon-32x32.png"),
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: getBlobUrl("/android-chrome-192x192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: getBlobUrl("/android-chrome-512x512.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["entertainment", "lifestyle", "games"],
    lang: "en",
    orientation: "portrait-primary",
  };
}
