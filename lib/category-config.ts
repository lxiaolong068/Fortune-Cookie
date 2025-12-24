import {
  Sparkles,
  Smile,
  Heart,
  TrendingUp,
  Brain,
  Users,
  Activity,
  Plane,
  Cake,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type FortuneCategory =
  | "inspirational"
  | "funny"
  | "love"
  | "success"
  | "wisdom"
  | "friendship"
  | "health"
  | "travel"
  | "birthday"
  | "study";

export interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  borderColor: string;
  description: string;
}

export const categoryConfig: Record<FortuneCategory, CategoryConfig> = {
  inspirational: {
    icon: Sparkles,
    label: "Inspirational",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverBgColor: "hover:bg-blue-100",
    borderColor: "border-blue-200",
    description: "Motivational messages to inspire your day",
  },
  funny: {
    icon: Smile,
    label: "Funny",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    hoverBgColor: "hover:bg-yellow-100",
    borderColor: "border-yellow-200",
    description: "Lighthearted fortunes to make you smile",
  },
  love: {
    icon: Heart,
    label: "Love",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    hoverBgColor: "hover:bg-pink-100",
    borderColor: "border-pink-200",
    description: "Romantic wisdom for matters of the heart",
  },
  success: {
    icon: TrendingUp,
    label: "Success",
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-100",
    borderColor: "border-green-200",
    description: "Guidance for achieving your goals",
  },
  wisdom: {
    icon: Brain,
    label: "Wisdom",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-100",
    borderColor: "border-purple-200",
    description: "Timeless insights and profound thoughts",
  },
  friendship: {
    icon: Users,
    label: "Friendship",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverBgColor: "hover:bg-orange-100",
    borderColor: "border-orange-200",
    description: "Celebrate the bonds that matter most",
  },
  health: {
    icon: Activity,
    label: "Health",
    color: "text-red-600",
    bgColor: "bg-red-50",
    hoverBgColor: "hover:bg-red-100",
    borderColor: "border-red-200",
    description: "Wellness and vitality fortunes",
  },
  travel: {
    icon: Plane,
    label: "Travel",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    hoverBgColor: "hover:bg-indigo-100",
    borderColor: "border-indigo-200",
    description: "Adventure awaits beyond the horizon",
  },
  birthday: {
    icon: Cake,
    label: "Birthday",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    hoverBgColor: "hover:bg-fuchsia-100",
    borderColor: "border-fuchsia-200",
    description: "Special wishes for your celebration",
  },
  study: {
    icon: BookOpen,
    label: "Study",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    hoverBgColor: "hover:bg-cyan-100",
    borderColor: "border-cyan-200",
    description: "Learning and academic encouragement",
  },
};

// Helper to get all categories as an array
export const allCategories = Object.keys(categoryConfig) as FortuneCategory[];

// Legacy compatibility mappings for BrowsePageContent
export const categoryIcons: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(categoryConfig).map(([key, value]) => [key, value.icon])
);

export const categoryColors: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([key, value]) => [
    key,
    `${value.bgColor} ${value.color.replace("text-", "text-")}`.replace(
      "text-",
      ""
    ),
  ])
);

// Badge-style color classes for BrowsePageContent
export const categoryBadgeColors: Record<string, string> = {
  inspirational: "bg-blue-100 text-blue-800",
  funny: "bg-yellow-100 text-yellow-800",
  love: "bg-pink-100 text-pink-800",
  success: "bg-green-100 text-green-800",
  wisdom: "bg-purple-100 text-purple-800",
  friendship: "bg-orange-100 text-orange-800",
  health: "bg-red-100 text-red-800",
  travel: "bg-indigo-100 text-indigo-800",
  birthday: "bg-fuchsia-100 text-fuchsia-800",
  study: "bg-cyan-100 text-cyan-800",
};
