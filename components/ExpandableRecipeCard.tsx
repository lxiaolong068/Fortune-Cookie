'use client'

import { useState, useId } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, ChefHat, Utensils, Star, Sparkles, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Recipe {
  id: string
  title: string
  difficulty: string
  time: string
  servings: string
  rating: number
  description: string
  extendedDescription: string
  ingredients: string[]
  instructions: string[]
}

interface ExpandableRecipeCardProps {
  recipe: Recipe
}

export function ExpandableRecipeCard({ recipe }: ExpandableRecipeCardProps) {
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false)
  const [stepsExpanded, setStepsExpanded] = useState(false)

  const ingredientsId = useId()
  const stepsId = useId()
  const titleId = useId()

  const visibleIngredients = 4
  const visibleSteps = 3
  const hasMoreIngredients = recipe.ingredients.length > visibleIngredients
  const hasMoreSteps = recipe.instructions.length > visibleSteps

  return (
    <Card
      className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200"
      aria-labelledby={titleId}
    >
      {/* Header with Title and Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 id={titleId} className="text-xl font-semibold text-gray-800">
            {recipe.title} Recipe
          </h2>
          <div
            className="flex items-center gap-1"
            aria-label={`Rated ${recipe.rating} out of 5 stars`}
          >
            <Star className="w-4 h-4 text-yellow-500 fill-current" aria-hidden="true" />
            <span className="text-sm text-gray-600">{recipe.rating}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-gray-600 text-sm mb-2">
          {recipe.description}
        </p>

        {/* Extended Description for SEO */}
        <p className="text-gray-500 text-sm mb-3 leading-relaxed">
          {recipe.extendedDescription}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
            {recipe.time}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Users className="w-3 h-3 mr-1" aria-hidden="true" />
            {recipe.servings}
          </Badge>
          <Badge className={cn(
            "text-purple-800",
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 'bg-purple-100'
          )}>
            <ChefHat className="w-3 h-3 mr-1" aria-hidden="true" />
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {/* Ingredients Section - All content in DOM for SEO */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Utensils className="w-4 h-4" aria-hidden="true" />
            Ingredients
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            For {recipe.servings}, you will need:
          </p>
          <ul
            id={ingredientsId}
            className="text-sm text-gray-600 space-y-1"
          >
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-start gap-2",
                  !ingredientsExpanded && index >= visibleIngredients && "hidden"
                )}
              >
                <span className="text-amber-500 mt-1" aria-hidden="true">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
          {hasMoreIngredients && (
            <button
              onClick={() => setIngredientsExpanded(!ingredientsExpanded)}
              aria-expanded={ingredientsExpanded}
              aria-controls={ingredientsId}
              className="mt-2 min-h-[44px] px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors flex items-center gap-1"
            >
              {ingredientsExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  Hide Ingredients
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  Show All {recipe.ingredients.length} Ingredients
                </>
              )}
            </button>
          )}
        </div>

        {/* Instructions Section - All content in DOM for SEO */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">
            Step-by-Step Instructions
          </h3>
          <ol
            id={stepsId}
            className="text-sm text-gray-600 space-y-2"
          >
            {recipe.instructions.map((step, index) => (
              <li
                key={index}
                className={cn(
                  "flex gap-2",
                  !stepsExpanded && index >= visibleSteps && "hidden"
                )}
              >
                <span className="text-amber-500 font-medium flex-shrink-0">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {hasMoreSteps && (
            <button
              onClick={() => setStepsExpanded(!stepsExpanded)}
              aria-expanded={stepsExpanded}
              aria-controls={stepsId}
              className="mt-2 min-h-[44px] px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors flex items-center gap-1"
            >
              {stepsExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  Hide Steps
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  Show All {recipe.instructions.length} Steps
                </>
              )}
            </button>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-100">
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white min-h-[44px]">
            <Link href={`/generator?recipe=${recipe.id}`}>
              <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
              Generate Fortunes for This Recipe
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-amber-300 hover:bg-amber-50 min-h-[44px]">
            <Link href="/messages">
              <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
              Browse Message Library
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
