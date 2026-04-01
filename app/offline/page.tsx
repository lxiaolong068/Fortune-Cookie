import { Metadata } from "next";
import { OfflinePageContent } from "./OfflinePageContent";

export const metadata: Metadata = {
  title: "Offline Mode - Fortune Cookie AI",
  description:
    "You're offline. Browse cached fortune cookies and saved favorites while your connection returns. Your generated fortunes and data remain accessible offline.",
  robots: "noindex, nofollow",
};

export default function OfflinePage() {
  return <OfflinePageContent />;
}
