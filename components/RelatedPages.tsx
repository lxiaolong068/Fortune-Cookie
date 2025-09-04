import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ExternalLink } from 'lucide-react'

export interface RelatedPage {
  title: string
  description: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

interface RelatedPagesProps {
  title?: string
  pages: RelatedPage[]
  className?: string
}

export function RelatedPages({ 
  title = "Related Pages", 
  pages, 
  className = "" 
}: RelatedPagesProps) {
  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {page.icon && <page.icon className="w-5 h-5 text-amber-600" />}
                  <span className="group-hover:text-amber-600 transition-colors">
                    {page.title}
                  </span>
                  {page.external ? (
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {page.description}
                </CardDescription>
                
                {page.external ? (
                  <a
                    href={page.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    Visit Page
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  <Link
                    href={page.href}
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Predefined related page sets for common use cases
export const fortuneRelatedPages: RelatedPage[] = [
  {
    title: "AI Fortune Generator",
    description: "Create personalized fortune cookie messages with our AI-powered generator.",
    href: "/generator"
  },
  {
    title: "Browse Fortune Messages",
    description: "Explore our collection of traditional and modern fortune cookie messages.",
    href: "/browse"
  },
  {
    title: "Fortune Cookie History",
    description: "Learn about the fascinating origins and cultural significance of fortune cookies.",
    href: "/who-invented-fortune-cookies"
  }
]

export const recipeRelatedPages: RelatedPage[] = [
  {
    title: "Fortune Cookie Recipes",
    description: "Step-by-step guides to making delicious fortune cookies at home.",
    href: "/recipes"
  },
  {
    title: "How to Make Fortune Cookies",
    description: "Complete tutorial on creating perfect fortune cookies from scratch.",
    href: "/how-to-make-fortune-cookies"
  },
  {
    title: "Funny Fortune Messages",
    description: "Add humor to your homemade cookies with these hilarious fortune messages.",
    href: "/funny-fortune-cookie-messages"
  }
]

export const messageRelatedPages: RelatedPage[] = [
  {
    title: "Message Categories",
    description: "Browse fortune messages by theme: love, success, wisdom, and more.",
    href: "/messages"
  },
  {
    title: "Generate Custom Messages",
    description: "Create unique fortune cookie messages tailored to your preferences.",
    href: "/generator"
  },
  {
    title: "Fortune Cookie History",
    description: "Discover the cultural background behind these beloved treats.",
    href: "/who-invented-fortune-cookies"
  }
]
