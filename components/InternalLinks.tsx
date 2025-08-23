import Link from 'next/link'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowRight, ExternalLink, Sparkles, MessageSquare, Clock, ChefHat, Search, Heart, Smile, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InternalLinkProps {
  href: string
  title: string
  description?: string
  badge?: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
  className?: string
}

export function InternalLink({
  href,
  title,
  description,
  badge,
  icon: Icon,
  external = false,
  className
}: InternalLinkProps) {
  const LinkComponent = external ? 'a' : Link
  const linkProps = external 
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  return (
    <LinkComponent {...linkProps} className={cn('block group', className)}>
      <Card className="p-4 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-amber-100">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <Badge className="bg-amber-100 text-amber-800 text-xs">
                {badge}
              </Badge>
            )}
            {external ? (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
            ) : (
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
            )}
          </div>
        </div>
      </Card>
    </LinkComponent>
  )
}

// Related pages component
export function RelatedPages({ currentPage }: { currentPage: string }) {
  const allPages = [
    {
      href: '/',
      title: 'Fortune Cookie Generator',
      description: 'Generate personalized fortune cookies with AI',
      icon: Sparkles,
      badge: 'Popular'
    },
    {
      href: '/generator',
      title: 'AI Generator',
      description: 'Advanced AI-powered fortune creation',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      href: '/messages',
      title: 'Fortune Messages',
      description: 'Browse our collection of fortune messages',
      icon: MessageSquare
    },
    {
      href: '/browse',
      title: 'Search & Browse',
      description: 'Search and filter fortune messages',
      icon: Search
    },
    {
      href: '/history',
      title: 'Fortune Cookie History',
      description: 'Learn about fortune cookie origins',
      icon: Clock
    },
    {
      href: '/recipes',
      title: 'Fortune Cookie Recipes',
      description: 'Make your own fortune cookies at home',
      icon: ChefHat
    },
    {
      href: '/who-invented-fortune-cookies',
      title: 'Who Invented Fortune Cookies?',
      description: 'Discover the surprising history',
      icon: Clock,
      badge: 'Popular'
    },
    {
      href: '/how-to-make-fortune-cookies',
      title: 'How to Make Fortune Cookies',
      description: 'Easy step-by-step tutorial',
      icon: ChefHat,
      badge: 'Tutorial'
    },
    {
      href: '/funny-fortune-cookie-messages',
      title: 'Funny Fortune Messages',
      description: 'Hilarious and witty fortune sayings',
      icon: Smile,
      badge: 'Funny'
    }
  ]

  // Filter out current page and get 3-4 related pages
  const relatedPages = allPages
    .filter(page => page.href !== currentPage)
    .slice(0, 4)

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Related Pages
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {relatedPages.map((page) => (
          <InternalLink
            key={page.href}
            href={page.href}
            title={page.title}
            description={page.description}
            icon={page.icon}
            badge={page.badge}
          />
        ))}
      </div>
    </section>
  )
}

// Category navigation component
export function CategoryNavigation() {
  const categories = [
    {
      href: '/messages?category=inspirational',
      title: 'Inspirational Messages',
      description: 'Motivational and uplifting fortunes',
      icon: Sparkles,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      href: '/messages?category=funny',
      title: 'Funny Messages',
      description: 'Humorous and witty fortunes',
      icon: Smile,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      href: '/messages?category=love',
      title: 'Love & Romance',
      description: 'Messages about love and relationships',
      icon: Heart,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      href: '/messages?category=success',
      title: 'Success & Career',
      description: 'Professional and achievement-focused',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-800'
    }
  ]

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Browse by Category
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="group">
            <Card className="p-4 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                  <category.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Breadcrumb navigation
export function Breadcrumbs({ 
  items 
}: { 
  items: Array<{ name: string; href?: string }> 
}) {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ArrowRight className="w-3 h-3 mx-2 text-gray-400" />
            )}
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-amber-600 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Footer links component
export function FooterLinks() {
  const linkGroups = [
    {
      title: 'Generate',
      links: [
        { href: '/', title: 'Fortune Generator' },
        { href: '/generator', title: 'AI Generator' },
        { href: '/browse', title: 'Browse Messages' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { href: '/history', title: 'History' },
        { href: '/who-invented-fortune-cookies', title: 'Who Invented?' },
        { href: '/recipes', title: 'Recipes' }
      ]
    },
    {
      title: 'Messages',
      links: [
        { href: '/messages', title: 'All Messages' },
        { href: '/funny-fortune-cookie-messages', title: 'Funny Messages' },
        { href: '/how-to-make-fortune-cookies', title: 'How to Make' }
      ]
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {linkGroups.map((group) => (
        <div key={group.title}>
          <h3 className="font-semibold text-gray-800 mb-4">{group.title}</h3>
          <ul className="space-y-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Call-to-action links
export function CTALinks({ exclude }: { exclude?: string[] }) {
  const ctas = [
    {
      href: '/generator',
      title: 'Try AI Generator',
      description: 'Create personalized fortunes with AI',
      primary: true
    },
    {
      href: '/browse',
      title: 'Browse Messages',
      description: 'Explore our fortune collection',
      primary: false
    },
    {
      href: '/recipes',
      title: 'Make Your Own',
      description: 'Learn to bake fortune cookies',
      primary: false
    }
  ].filter(cta => !exclude?.includes(cta.href))

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {ctas.map((cta) => (
        <Link key={cta.href} href={cta.href}>
          <Card className={cn(
            'p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 text-center',
            cta.primary 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500' 
              : 'bg-white/90 backdrop-blur-sm border-amber-200'
          )}>
            <h3 className={cn(
              'font-semibold mb-1',
              cta.primary ? 'text-white' : 'text-gray-800'
            )}>
              {cta.title}
            </h3>
            <p className={cn(
              'text-sm',
              cta.primary ? 'text-amber-100' : 'text-gray-600'
            )}>
              {cta.description}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
