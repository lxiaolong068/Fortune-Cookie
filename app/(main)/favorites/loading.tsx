import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FavoritesLoading() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden relative bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-amber-300 animate-pulse" />
              <div className="h-12 w-64 bg-amber-100 rounded animate-pulse" />
            </div>
            <div className="h-6 w-96 max-w-full bg-amber-50 rounded mx-auto animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white/80 backdrop-blur-sm border-amber-100 animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-4 bg-amber-100 rounded w-1/4 mb-4" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-amber-50 rounded w-full" />
                    <div className="h-4 bg-amber-50 rounded w-5/6" />
                    <div className="h-4 bg-amber-50 rounded w-4/6" />
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                    <div className="h-7 w-7 bg-amber-100 rounded-full" />
                  </div>
                  <div className="h-3 bg-amber-100 rounded w-1/3 mb-4" />
                  <div className="pt-3 border-t border-amber-100 flex justify-between">
                    <div className="h-8 w-20 bg-amber-50 rounded" />
                    <div className="h-8 w-8 bg-amber-50 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
