import { Metadata } from 'next'
import { FortuneCookie } from '@/components/FortuneCookie'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import {
  WebsiteStructuredData,
  WebApplicationStructuredData,
  OrganizationStructuredData
} from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Fortune Cookie - Free Online AI Generator',
  description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom fortune cookies with our AI tool.',
  keywords: [
    'fortune cookie generator',
    'free online fortune cookie',
    'ai fortune cookie',
    'inspirational quotes',
    'lucky numbers',
    'personalized messages',
    'funny fortune cookies',
    'custom fortune cookie creator'
  ],
  openGraph: {
    title: 'Fortune Cookie - Free Online AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers.',
    type: 'website',
    url: 'https://fortune-cookie-ai.vercel.app',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fortune Cookie AI Generator - Free Online Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fortune Cookie - Free Online AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      {/* 结构化数据 */}
      <WebsiteStructuredData />
      <WebApplicationStructuredData />
      <OrganizationStructuredData />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <FortuneCookie />
        </div>
      
      {/* SEO优化的隐藏内容 */}
      <div className="sr-only">
        <h1>Fortune Cookie - Free Online AI Generator</h1>
        <p>
          Welcome to the best free online AI-powered fortune cookie generator! 
          Create personalized inspirational messages, funny quotes, and discover 
          your lucky numbers. Our AI tool generates unique fortune cookies for 
          entertainment, motivation, and fun.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Free online fortune cookie generator with AI</li>
          <li>Inspirational and motivational quotes</li>
          <li>Funny fortune cookie messages</li>
          <li>Lucky numbers for each fortune</li>
          <li>Custom message creation</li>
          <li>Beautiful animations and effects</li>
          <li>Mobile-friendly responsive design</li>
          <li>No registration required</li>
        </ul>
        <h2>How to Use</h2>
        <p>
          Simply click on the fortune cookie to crack it open and reveal your
          personalized message. Each fortune comes with lucky numbers and
          inspirational wisdom to brighten your day.
        </p>
      </div>
      </main>
    </>
  )
}
