"use client";

import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FortuneStyle } from "@/lib/fortune-database";
import { useLocale } from "@/lib/locale-context";

interface GenerateSimilarButtonProps {
  message: string;
  category: string;
  style?: FortuneStyle;
  tags?: string[];
  className?: string;
}

/**
 * GenerateSimilarButton - Navigate to AI generator with pre-filled context
 *
 * Creates a URL with query parameters to pre-fill the generator with:
 * - category/theme matching the current message
 * - style preference (classic, poetic, modern, playful, calm)
 * - reference message for context
 */
export function GenerateSimilarButton({
  message,
  category,
  style,
  tags,
  className,
}: GenerateSimilarButtonProps) {
  const router = useRouter();
  const { t, getLocalizedHref } = useLocale();

  const handleClick = () => {
    // Build URL params for the generator
    const params = new URLSearchParams();

    // Pass category to generator (generator maps category to theme)
    params.set("category", category);

    // Add style if available
    if (style) {
      params.set("style", style);
    }

    // Add a shortened reference message (first 100 chars) for context
    const shortMessage =
      message.length > 100 ? message.slice(0, 100) + "..." : message;
    params.set("ref", shortMessage);

    const cleanedTags = tags?.map((tag) => tag.trim()).filter(Boolean);
    if (cleanedTags && cleanedTags.length > 0) {
      params.set("tags", cleanedTags.join(","));
    }

    // Navigate to generator with params
    router.push(`${getLocalizedHref("/generator")}?${params.toString()}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      title={t("messages.generateSimilar.title")}
      className={`h-8 w-8 text-[#888888] hover:text-[#FF6B3D] hover:bg-[#FFE4D6] ${className || ""}`}
      aria-label={t("messages.generateSimilar.ariaLabel")}
    >
      <Wand2 className="h-4 w-4" />
    </Button>
  );
}

export default GenerateSimilarButton;
