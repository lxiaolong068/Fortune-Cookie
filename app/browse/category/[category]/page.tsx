import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFortunesByCategory, getDatabaseStats } from '@/lib/fortune-database'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Smile, Heart, TrendingUp, Brain, Users, Activity, Plane } from 'lucide-react'
import { BreadcrumbStructuredData, ItemListStructuredData } from '@/components/StructuredData'
import Link from 'next/link'

// Category configuration
const categoryConfig: Record<string, { icon: any, color: string, description: string }> = {
    inspirational: {
        icon: Sparkles,
        color: 'bg-blue-100 text-blue-800',
        description: 'Find motivation and inspiration for your daily life with our collection of inspirational fortune cookie messages.'
    },
    funny: {
        icon: Smile,
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Add some humor to your day with our hilarious and witty fortune cookie sayings.'
    },
    love: {
        icon: Heart,
        color: 'bg-pink-100 text-pink-800',
        description: 'Discover romantic insights and relationship wisdom with our love-themed fortune cookies.'
    },
    success: {
        icon: TrendingUp,
        color: 'bg-green-100 text-green-800',
        description: 'Unlock the secrets to success and career growth with these motivational fortune messages.'
    },
    wisdom: {
        icon: Brain,
        color: 'bg-purple-100 text-purple-800',
        description: 'Ancient wisdom and philosophical thoughts to guide your journey.'
    },
    friendship: {
        icon: Users,
        color: 'bg-orange-100 text-orange-800',
        description: 'Celebrate friendship and connection with these heartwarming messages.'
    },
    health: {
        icon: Activity,
        color: 'bg-red-100 text-red-800',
        description: 'Positive affirmations and wisdom for a healthy mind and body.'
    },
    travel: {
        icon: Plane,
        color: 'bg-indigo-100 text-indigo-800',
        description: 'Inspiring quotes for adventurers and travelers.'
    }
}

interface Props {
    params: Promise<{ category: string }>
}

export async function generateStaticParams() {
    const stats = getDatabaseStats()
    return Object.keys(stats.categories).map((category) => ({
        category,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params
    const config = categoryConfig[category]

    if (!config) {
        return {
            title: 'Category Not Found',
        }
    }

    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)

    return {
        title: `${capitalizedCategory} Fortune Cookie Messages - Fortune Cookie AI`,
        description: config.description,
        openGraph: {
            title: `${capitalizedCategory} Fortune Cookie Messages`,
            description: config.description,
            type: 'website',
        },
        alternates: {
            canonical: `/browse/category/${category}`,
        },
    }
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params

    if (!categoryConfig[category]) {
        notFound()
    }

    const fortunes = getFortunesByCategory(category)
    const config = categoryConfig[category]
    const Icon = config.icon
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)

    return (
        <>
            <BreadcrumbStructuredData items={[
                { name: 'Home', url: '/' },
                { name: 'Browse', url: '/browse' },
                { name: `${capitalizedCategory} Fortunes`, url: `/browse/category/${category}` }
            ]} />

            <ItemListStructuredData
                name={`${capitalizedCategory} Fortune Cookie Messages`}
                description={config.description}
                url={`/browse/category/${category}`}
                items={fortunes.map(f => ({
                    name: f.message,
                    category: f.category
                }))}
            />

            <main className="min-h-screen w-full overflow-x-hidden relative">
                <DynamicBackgroundEffects />
                <div className="relative z-10">
                    <div className="container mx-auto px-4 py-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className={`p-3 rounded-full ${config.color.split(' ')[0]}`}>
                                    <Icon className={`w-8 h-8 ${config.color.split(' ')[1]}`} />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                                {capitalizedCategory} Fortune Messages
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                                {config.description}
                            </p>

                            <Link href="/browse">
                                <Badge variant="outline" className="hover:bg-amber-50 cursor-pointer transition-colors">
                                    ← Back to All Categories
                                </Badge>
                            </Link>
                        </div>

                        {/* Fortune List */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fortunes.map((fortune) => (
                                <Card key={fortune.id} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={config.color}>
                                            <Icon className="w-3 h-3 mr-1" />
                                            {fortune.category}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs text-gray-500">{fortune.popularity}/10</span>
                                        </div>
                                    </div>

                                    <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                                        "{fortune.message}"
                                    </blockquote>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Lucky Numbers:</p>
                                            <div className="flex gap-1">
                                                {fortune.luckyNumbers.map((number) => (
                                                    <span
                                                        key={number}
                                                        className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                                    >
                                                        {number}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {fortune.tags.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Tags:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {fortune.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
