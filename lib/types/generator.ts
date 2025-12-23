// Shared TypeScript interfaces for the Generator page
// This file contains all type definitions used across generator components

// ============================================================================
// Theme Types
// ============================================================================

export type Theme = 'funny' | 'inspirational' | 'love' | 'success' | 'wisdom' | 'random';

export interface ThemeConfig {
  icon: string; // Emoji fallback for lazy-loaded icons
  color: string; // Tailwind class for badge color
  label: string;
  description: string;
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  funny: {
    icon: '😊',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Funny',
    description: 'Humorous and witty messages',
  },
  inspirational: {
    icon: '✨',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Inspirational',
    description: 'Motivational and uplifting',
  },
  love: {
    icon: '❤️',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    label: 'Love & Relationships',
    description: 'Romance and connections',
  },
  success: {
    icon: '📈',
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Success & Career',
    description: 'Achievement and prosperity',
  },
  wisdom: {
    icon: '🧠',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Wisdom',
    description: 'Philosophical insights',
  },
  random: {
    icon: '🔀',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Random',
    description: 'Surprise me!',
  },
};

// ============================================================================
// Personalization Types
// ============================================================================

export type Scenario = 'work' | 'love' | 'study' | 'health' | 'other' | '';
export type Tone = 'soft' | 'direct' | 'playful' | '';
export type Language = 'en' | 'zh';

export interface Personalization {
  scenario: Scenario;
  tone: Tone;
  language: Language;
}

export const DEFAULT_PERSONALIZATION: Personalization = {
  scenario: '',
  tone: '',
  language: 'en',
};

export const SCENARIO_OPTIONS: { value: Scenario; label: string }[] = [
  { value: '', label: 'Any scenario' },
  { value: 'work', label: 'Work' },
  { value: 'love', label: 'Love' },
  { value: 'study', label: 'Study' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

export const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: '', label: 'Default', description: 'Standard fortune style' },
  { value: 'soft', label: 'Soft & warm', description: 'Gentle and encouraging' },
  { value: 'direct', label: 'Direct & honest', description: 'Straightforward advice' },
  { value: 'playful', label: 'Playful', description: 'Fun and lighthearted' },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '简体中文' },
];

// ============================================================================
// Fortune Types
// ============================================================================

export interface Fortune {
  message: string;
  luckyNumbers: number[];
  theme: string;
  timestamp: string;
  source?: 'ai' | 'database' | 'fallback';
  cached?: boolean;
  aiError?: {
    provider: string;
    status?: number;
    code?: string;
    message: string;
  };
}

// ============================================================================
// Quota Types
// ============================================================================

export interface QuotaStatus {
  limit: number;
  used: number;
  remaining: number;
  resetsAtUtc: string;
  isAuthenticated: boolean;
}

// ============================================================================
// Cookie State Types
// ============================================================================

export type CookieState = 'unopened' | 'cracking' | 'opened';

// ============================================================================
// History Tab Types
// ============================================================================

export type HistoryTab = 'recent' | 'favorites' | 'trending';

export interface HistoryItem {
  id: string;
  message: string;
  category: string;
  timestamp: Date;
  liked: boolean;
  shared: boolean;
  luckyNumbers?: number[];
  source?: 'ai' | 'database' | 'offline';
}

export interface TrendingFortune {
  id: string;
  message: string;
  category: string;
  saves: number;
  shares: number;
}

// Static trending data (placeholder for future API)
export const TRENDING_FORTUNES: TrendingFortune[] = [
  {
    id: 'trending-1',
    message: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    category: 'wisdom',
    saves: 245,
    shares: 89,
  },
  {
    id: 'trending-2',
    message: 'Your smile is your superpower. Use it generously.',
    category: 'inspirational',
    saves: 198,
    shares: 67,
  },
  {
    id: 'trending-3',
    message: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    category: 'success',
    saves: 187,
    shares: 72,
  },
  {
    id: 'trending-4',
    message: 'A day without laughter is a day wasted.',
    category: 'funny',
    saves: 156,
    shares: 54,
  },
  {
    id: 'trending-5',
    message: 'The heart that loves is always young.',
    category: 'love',
    saves: 143,
    shares: 61,
  },
  {
    id: 'trending-6',
    message: 'Your future self is watching you right now through memories.',
    category: 'wisdom',
    saves: 134,
    shares: 48,
  },
  {
    id: 'trending-7',
    message: 'Be the energy you want to attract.',
    category: 'inspirational',
    saves: 128,
    shares: 45,
  },
  {
    id: 'trending-8',
    message: 'Fortune favors the brave, but also those who double-check their work.',
    category: 'funny',
    saves: 112,
    shares: 38,
  },
];

// ============================================================================
// Generator State (for page-level state management)
// ============================================================================

export interface GeneratorState {
  cookieState: CookieState;
  currentFortune: Fortune | null;
  selectedTheme: Theme;
  personalization: Personalization;
  customPrompt: string;
  quotaStatus: QuotaStatus | null;
  activeTab: HistoryTab;
  isGenerating: boolean;
  generationError: string | null;
  generationSource: 'ai' | 'offline' | null;
  showPersonalization: boolean;
}

export const DEFAULT_GENERATOR_STATE: GeneratorState = {
  cookieState: 'unopened',
  currentFortune: null,
  selectedTheme: 'random',
  personalization: DEFAULT_PERSONALIZATION,
  customPrompt: '',
  quotaStatus: null,
  activeTab: 'recent',
  isGenerating: false,
  generationError: null,
  generationSource: null,
  showPersonalization: false,
};

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GenerateFortuneRequest {
  theme: Theme;
  customPrompt?: string;
  mood?: string;
  length?: string;
  // New personalization fields
  scenario?: Scenario;
  tone?: Tone;
  language?: Language;
}

export interface GenerateFortuneResponse {
  data: Fortune;
  meta?: {
    quota?: QuotaStatus;
    source?: 'ai' | 'database' | 'fallback';
  };
}
