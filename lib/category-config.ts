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
  // Modern gradient colors for card icons
  gradientFrom: string;
  gradientTo: string;
}

export const categoryConfig: Record<FortuneCategory, CategoryConfig> = {
  inspirational: {
    icon: Sparkles,
    label: "Inspirational",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    hoverBgColor: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
    borderColor: "border-indigo-200 dark:border-indigo-700/50",
    description: "Motivational messages to inspire your day",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-500",
  },
  funny: {
    icon: Smile,
    label: "Funny",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    hoverBgColor: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
    borderColor: "border-amber-200 dark:border-amber-700/50",
    description: "Lighthearted fortunes to make you smile",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
  },
  love: {
    icon: Heart,
    label: "Love",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    hoverBgColor: "hover:bg-rose-100 dark:hover:bg-rose-900/30",
    borderColor: "border-rose-200 dark:border-rose-700/50",
    description: "Romantic wisdom for matters of the heart",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-500",
  },
  success: {
    icon: TrendingUp,
    label: "Success",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    hoverBgColor: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
    borderColor: "border-emerald-200 dark:border-emerald-700/50",
    description: "Guidance for achieving your goals",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-500",
  },
  wisdom: {
    icon: Brain,
    label: "Wisdom",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    hoverBgColor: "hover:bg-violet-100 dark:hover:bg-violet-900/30",
    borderColor: "border-violet-200 dark:border-violet-700/50",
    description: "Timeless insights and profound thoughts",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
  },
  friendship: {
    icon: Users,
    label: "Friendship",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    hoverBgColor: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-700/50",
    description: "Celebrate the bonds that matter most",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
  },
  health: {
    icon: Activity,
    label: "Health",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    hoverBgColor: "hover:bg-red-100 dark:hover:bg-red-900/30",
    borderColor: "border-red-200 dark:border-red-700/50",
    description: "Wellness and vitality fortunes",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-500",
  },
  travel: {
    icon: Plane,
    label: "Travel",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    hoverBgColor: "hover:bg-sky-100 dark:hover:bg-sky-900/30",
    borderColor: "border-sky-200 dark:border-sky-700/50",
    description: "Adventure awaits beyond the horizon",
    gradientFrom: "from-sky-500",
    gradientTo: "to-blue-500",
  },
  birthday: {
    icon: Cake,
    label: "Birthday",
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    hoverBgColor: "hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30",
    borderColor: "border-fuchsia-200 dark:border-fuchsia-700/50",
    description: "Special wishes for your celebration",
    gradientFrom: "from-fuchsia-500",
    gradientTo: "to-pink-500",
  },
  study: {
    icon: BookOpen,
    label: "Study",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    hoverBgColor: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30",
    borderColor: "border-cyan-200 dark:border-cyan-700/50",
    description: "Learning and academic encouragement",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-teal-500",
  },
};

// Helper to get all categories as an array
export const allCategories = Object.keys(categoryConfig) as FortuneCategory[];

// Legacy compatibility mappings for BrowsePageContent
export const categoryIcons: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(categoryConfig).map(([key, value]) => [key, value.icon]),
);

export const categoryColors: Record<string, string> = Object.fromEntries(
  Object.entries(categoryConfig).map(([key, value]) => [
    key,
    `${value.bgColor} ${value.color.replace("text-", "text-")}`.replace(
      "text-",
      "",
    ),
  ]),
);

// Badge-style color classes for BrowsePageContent - Updated with dark mode support
export const categoryBadgeColors: Record<string, string> = {
  inspirational:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  funny: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  love: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  wisdom:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  friendship:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  travel: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  birthday:
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  study: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
};
