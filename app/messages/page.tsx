import { permanentRedirect } from "next/navigation";
import { Metadata } from "next";

// Return minimal metadata for redirect page
export const metadata: Metadata = {
  title: "Redirecting to Explore...",
  robots: { index: false, follow: true },
};

/**
 * Legacy /messages page - 301 redirect to /explore
 *
 * This redirect preserves SEO value while consolidating
 * content browsing into a single unified experience.
 */
export default function MessagesRedirectPage() {
  permanentRedirect("/explore");
}
