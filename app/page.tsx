import { Metadata } from 'next'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import {
  WebsiteStructuredData,
  WebApplicationStructuredData,
  OrganizationStructuredData
} from '@/components/StructuredData'
import { generateSEOMetadata } from '@/components/SEO'
import { FortuneCookie } from '@/components/FortuneCookie'

// 注意：Edge Runtime 已禁用，因为它与某些客户端组件（如 Framer Motion）不兼容
// 如果需要启用，请确保所有依赖都支持 Edge Runtime
// export const runtime = 'edge'

// Enable static generation with revalidation for optimal performance
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = generateSEOMetadata({
  title: 'Fortune Cookie - Free Online AI Generator',
  description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom cookies with our AI.',
  image: '/og-image.png',
  url: '/',
  type: 'website'
})

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <WebsiteStructuredData />
      <WebApplicationStructuredData />
      <OrganizationStructuredData />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <FortuneCookie />
        </div>

      {/* SEO-optimized hidden content */}
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
