import { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

const baseUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Browse 500+ Fortune Cookie Messages by Category',
  description: 'Search and filter our complete collection of 500+ fortune cookie messages. Browse by category: inspirational, funny, love, success, wisdom, friendship, health, and travel.',
  openGraph: {
    title: 'Browse 500+ Fortune Cookie Messages by Category',
    description: 'Search and filter our complete collection of 500+ fortune cookie messages across 8 categories.',
    type: 'website',
    url: `${baseUrl}/browse`,
  },
  alternates: {
    canonical: '/browse',
  },
}

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
