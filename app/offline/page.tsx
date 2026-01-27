import { Metadata } from "next";
import { OfflinePageContent } from "./OfflinePageContent";

export const metadata: Metadata = {
  title: "Offline Mode - Fortune Cookie AI",
  description:
    "You are currently offline. Enjoy cached fortunes while you wait for your connection to return.",
  robots: "noindex, nofollow",
};

export default function OfflinePage() {
  return <OfflinePageContent />;
}
