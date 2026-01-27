"use client";

import { Heart, Sparkles } from "lucide-react";
import { FavoritesList } from "@/components/FavoritesList";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";

export function FavoritesPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="My Favorites"
        subtitle="Saved Fortunes"
        description="Your collection of saved fortune cookies. Revisit your favorite messages, share them with friends, or find inspiration whenever you need it."
        icon={Heart}
        iconGradient={{ from: "from-pink-500", to: "to-rose-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Favorites" }]}
        badge={<HeroBadge icon={Sparkles}>Personal Collection</HeroBadge>}
        size="md"
      />

      {/* Favorites List */}
      <PageSection padding="lg" bg="transparent">
        <FavoritesList />
      </PageSection>
    </PageLayout>
  );
}
