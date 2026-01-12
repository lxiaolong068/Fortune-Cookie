# Fortune Cookie Messages Page - Content Improvement Implementation Plan

> Based on review document: FortuneCookie Messages 页面内容改进意见 (2026-01-12)

## Executive Summary

This plan addresses four key areas of improvement for the /messages page:
1. **Classification System** - Adding style labels and secondary tags
2. **Content Quality** - Length grading and diversity sampling
3. **Lucky Numbers** - Meaning cards and interactive features
4. **AI Integration** - "Generate Similar" functionality

**Estimated Total Effort**: 3-4 development sessions
**Priority**: High impact features first (style labels, Generate Similar, Lucky Number meanings)

---

## 1. Enhanced Data Model

### 1.1 Updated FortuneMessage Interface

**File**: `lib/fortune-database.ts`

```typescript
// Current interface
interface FortuneMessage {
  id: string;
  message: string;
  category: FortuneCategory;
  tags: string[];
  luckyNumbers: number[];
  popularity: number;
  dateAdded: string;
}

// Enhanced interface
interface FortuneMessage {
  id: string;
  message: string;
  category: FortuneCategory;
  tags: string[];
  luckyNumbers: number[];
  popularity: number;
  dateAdded: string;
  
  // NEW FIELDS
  style: FortuneStyle;                    // Message style/tone
  lengthType: 'short' | 'medium' | 'long'; // Pre-computed length
  secondaryCategory?: FortuneCategory;    // Optional cross-category
}

type FortuneStyle = 
  | 'classic'    // Timeless wisdom, formal tone (古典)
  | 'poetic'     // Lyrical, metaphorical (诗性)
  | 'modern'     // Contemporary, casual (现代口语)
  | 'playful'    // Humorous, light-hearted (俏皮)
  | 'calm';      // Serene, meditative (沉稳)
```

### 1.2 Style Classification Guidelines

| Style | Characteristics | Example |
|-------|----------------|---------|
| **classic** | Timeless proverbs, formal language, universal truths | "A journey of a thousand miles begins with a single step" |
| **poetic** | Metaphors, imagery, lyrical flow | "Your heart is a garden; tend it with patience and watch dreams bloom" |
| **modern** | Casual tone, contemporary references, direct | "Sometimes the best move is to take a break and come back stronger" |
| **playful** | Witty, punny, light humor | "You're one smart cookie! 🍪 Fortune favors the well-prepared" |
| **calm** | Meditative, peaceful, reassuring | "Breathe deeply. The universe unfolds in its own time" |

### 1.3 Implementation Steps

1. Add new fields to `FortuneMessage` interface
2. Create auto-classification function based on message content
3. Manually review and adjust style assignments for accuracy
4. Add `lengthType` computation during data initialization

```typescript
// Auto-classification helper
function classifyMessageStyle(message: string): FortuneStyle {
  const lowerMsg = message.toLowerCase();
  
  // Playful indicators
  if (/😊|🍪|lol|haha|pun|joke/i.test(message) || 
      message.includes('!') && lowerMsg.includes('cookie')) {
    return 'playful';
  }
  
  // Poetic indicators
  if (/like a|as the|metaphor|bloom|sunrise|ocean|river/i.test(message)) {
    return 'poetic';
  }
  
  // Calm indicators
  if (/breathe|peace|calm|gentle|patience|flow/i.test(message)) {
    return 'calm';
  }
  
  // Modern indicators (shorter, direct)
  if (message.length < 80 && !/thy|thou|shall|wisdom of/i.test(message)) {
    return 'modern';
  }
  
  // Default to classic
  return 'classic';
}
```

---

## 2. Lucky Numbers Enhancement

### 2.1 New File: `lib/lucky-numbers.ts`

```typescript
export interface LuckyNumberMeaning {
  number: number;
  color: string;           // Hex color
  colorName: string;       // Display name
  element: string;         // Five elements
  keyword: string;         // One-word meaning
  meaning: string;         // Brief description
  suggestion: string;      // Action tip
}

// Number-to-meaning mapping (1-63 range covers fortune cookies)
export const luckyNumberMeanings: Record<number, LuckyNumberMeaning> = {
  1: {
    number: 1,
    color: '#E53935',
    colorName: 'Pioneer Red',
    element: 'Fire',
    keyword: 'Beginning',
    meaning: 'New starts, leadership, independence',
    suggestion: 'Take initiative on something new today'
  },
  2: {
    number: 2,
    color: '#1E88E5',
    colorName: 'Harmony Blue',
    element: 'Water',
    keyword: 'Balance',
    meaning: 'Partnership, diplomacy, cooperation',
    suggestion: 'Seek collaboration and mutual understanding'
  },
  3: {
    number: 3,
    color: '#FDD835',
    colorName: 'Creative Gold',
    element: 'Wood',
    keyword: 'Expression',
    meaning: 'Creativity, communication, joy',
    suggestion: 'Express yourself freely and connect with others'
  },
  // ... continue for numbers 4-63
  7: {
    number: 7,
    color: '#7B1FA2',
    colorName: 'Mystic Purple',
    element: 'Water',
    keyword: 'Wisdom',
    meaning: 'Intuition, spirituality, inner knowing',
    suggestion: 'Trust your inner voice and seek deeper understanding'
  },
  8: {
    number: 8,
    color: '#43A047',
    colorName: 'Prosperity Green',
    element: 'Metal',
    keyword: 'Abundance',
    meaning: 'Success, wealth, achievement',
    suggestion: 'Focus on your goals with confidence'
  },
  // ... etc
};

// Get meaning with fallback for unlisted numbers
export function getLuckyNumberMeaning(num: number): LuckyNumberMeaning {
  if (luckyNumberMeanings[num]) {
    return luckyNumberMeanings[num];
  }
  
  // Generate meaning for unlisted numbers based on digit sum
  const digitSum = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  const baseNum = digitSum > 9 ? digitSum % 9 || 9 : digitSum;
  const base = luckyNumberMeanings[baseNum];
  
  return {
    ...base,
    number: num,
    meaning: `${base.meaning} (amplified)`,
  };
}

// Date-based lucky numbers
export function getTodaysLuckyNumbers(date: Date = new Date()): number[] {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Seed-based generation for consistency
  const seed = day * 100 + month * 10000 + year;
  const numbers: number[] = [];
  
  let current = seed;
  while (numbers.length < 6) {
    current = (current * 1103515245 + 12345) % 2147483648;
    const num = (current % 63) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  return numbers.sort((a, b) => a - b);
}
```

### 2.2 LuckyNumberCard Component

**File**: `components/messages/LuckyNumberCard.tsx`

```tsx
'use client';

import { useState } from 'react';
import { getLuckyNumberMeaning, type LuckyNumberMeaning } from '@/lib/lucky-numbers';
import { cn } from '@/lib/utils';

interface LuckyNumberCardProps {
  numbers: number[];
  showMeanings?: boolean;
  compact?: boolean;
}

export function LuckyNumberCard({ 
  numbers, 
  showMeanings = false,
  compact = false 
}: LuckyNumberCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  
  const meanings = numbers.map(getLuckyNumberMeaning);
  
  if (compact) {
    return (
      <div className="flex gap-1.5">
        {numbers.slice(0, 3).map((num, i) => {
          const meaning = meanings[i];
          return (
            <span
              key={num}
              className="w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center text-white cursor-help"
              style={{ backgroundColor: meaning.color }}
              title={`${num}: ${meaning.keyword}`}
            >
              {num}
            </span>
          );
        })}
        {numbers.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{numbers.length - 3}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {/* Number badges */}
      <div className="flex flex-wrap gap-2">
        {numbers.map((num, i) => {
          const meaning = meanings[i];
          const isActive = activeNumber === num;
          return (
            <button
              key={num}
              onClick={() => setActiveNumber(isActive ? null : num)}
              className={cn(
                "w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center text-white transition-all",
                isActive && "ring-2 ring-offset-2 ring-primary scale-110"
              )}
              style={{ backgroundColor: meaning.color }}
            >
              {num}
            </button>
          );
        })}
      </div>
      
      {/* Active number meaning */}
      {activeNumber && (
        <div 
          className="p-3 rounded-lg border animate-in fade-in-50"
          style={{ 
            borderColor: getLuckyNumberMeaning(activeNumber).color + '40',
            backgroundColor: getLuckyNumberMeaning(activeNumber).color + '10'
          }}
        >
          {(() => {
            const m = getLuckyNumberMeaning(activeNumber);
            return (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{m.number}</span>
                  <span className="text-sm" style={{ color: m.color }}>
                    {m.colorName}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                    {m.element}
                  </span>
                </div>
                <p className="text-sm font-medium">{m.keyword}</p>
                <p className="text-sm text-muted-foreground">{m.meaning}</p>
                <p className="text-xs mt-2 italic">💡 {m.suggestion}</p>
              </>
            );
          })()}
        </div>
      )}
      
      {/* Expand all meanings */}
      {showMeanings && !activeNumber && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline"
        >
          {expanded ? 'Hide meanings' : 'Show all meanings'}
        </button>
      )}
      
      {expanded && (
        <div className="grid gap-2 text-xs">
          {meanings.map(m => (
            <div key={m.number} className="flex items-center gap-2">
              <span 
                className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]"
                style={{ backgroundColor: m.color }}
              >
                {m.number}
              </span>
              <span className="font-medium">{m.keyword}</span>
              <span className="text-muted-foreground">- {m.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 3. AI Generator Integration

### 3.1 "Generate Similar" Button

**Location**: `components/messages/MessageCategorySection.tsx`

```tsx
// Add to each message card
function GenerateSimilarButton({ message }: { message: FortuneMessage }) {
  const searchParams = new URLSearchParams({
    style: message.style,
    length: message.lengthType,
    category: message.category,
    ref: message.id,
  });
  
  return (
    <Link
      href={`/generator?${searchParams.toString()}`}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      title="Generate similar fortune"
    >
      <Sparkles className="h-4 w-4 text-primary" />
    </Link>
  );
}
```

### 3.2 Generator Page Enhancement

**File**: `app/generator/page.tsx`

```tsx
// Handle incoming parameters
export default function GeneratorPage({ 
  searchParams 
}: { 
  searchParams: { 
    style?: FortuneStyle;
    length?: 'short' | 'medium' | 'long';
    category?: string;
    ref?: string;
  } 
}) {
  const initialStyle = searchParams.style || 'classic';
  const initialLength = searchParams.length || 'medium';
  const initialCategory = searchParams.category || 'inspirational';
  const referenceId = searchParams.ref;
  
  // If reference ID provided, show "Generating similar to..."
  // Pre-fill form with extracted parameters
}
```

### 3.3 Enhanced OpenRouter Prompts

**File**: `lib/openrouter.ts`

```typescript
const stylePrompts: Record<FortuneStyle, string> = {
  classic: 'Write in a timeless, formal style like ancient proverbs. Use universal truths.',
  poetic: 'Use lyrical language with metaphors, imagery, and flowing rhythm.',
  modern: 'Write in contemporary, casual language. Be direct and relatable.',
  playful: 'Be witty, light-hearted, and fun. Gentle wordplay is welcome.',
  calm: 'Use serene, meditative language that soothes and reassures.'
};

// Incorporate style into fortune generation
function buildFortunePrompt(request: FortuneRequest): string {
  const styleGuide = request.style ? stylePrompts[request.style] : '';
  const lengthGuide = {
    short: 'Keep it concise, under 50 characters.',
    medium: 'Aim for 50-100 characters.',
    long: 'You may write 100-150 characters for depth.'
  }[request.length || 'medium'];
  
  return `Generate a fortune cookie message.
Category: ${request.theme || 'inspirational'}
Style: ${styleGuide}
Length: ${lengthGuide}
${request.customPrompt ? `Additional context: ${request.customPrompt}` : ''}

Respond with ONLY the fortune message, no quotes or attribution.`;
}
```

---

## 4. UI Enhancements

### 4.1 Style Filter in Search

**File**: `components/messages/MessagesSearchFilter.tsx`

```tsx
// Add style filter dropdown
const styleOptions = [
  { value: 'all', label: 'All Styles' },
  { value: 'classic', label: '🏛️ Classic' },
  { value: 'poetic', label: '🌸 Poetic' },
  { value: 'modern', label: '💬 Modern' },
  { value: 'playful', label: '🎭 Playful' },
  { value: 'calm', label: '🧘 Calm' },
];

// In filter component
<Select value={styleFilter} onValueChange={setStyleFilter}>
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="Style" />
  </SelectTrigger>
  <SelectContent>
    {styleOptions.map(opt => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### 4.2 Style Badge on Message Cards

```tsx
// Style badge component
function StyleBadge({ style }: { style: FortuneStyle }) {
  const config = {
    classic: { icon: '🏛️', bg: 'bg-stone-100', text: 'text-stone-700' },
    poetic: { icon: '🌸', bg: 'bg-pink-100', text: 'text-pink-700' },
    modern: { icon: '💬', bg: 'bg-blue-100', text: 'text-blue-700' },
    playful: { icon: '🎭', bg: 'bg-amber-100', text: 'text-amber-700' },
    calm: { icon: '🧘', bg: 'bg-green-100', text: 'text-green-700' },
  }[style];
  
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs', config.bg, config.text)}>
      {config.icon} {style}
    </span>
  );
}
```

### 4.3 Diversity Sampling Algorithm

```typescript
// Ensure variety in category displays
function diverseSample(
  messages: FortuneMessage[], 
  count: number = 15
): FortuneMessage[] {
  const result: FortuneMessage[] = [];
  const usedStyles = new Set<FortuneStyle>();
  const usedLengths = new Set<string>();
  
  // First pass: ensure style diversity
  const styles: FortuneStyle[] = ['classic', 'poetic', 'modern', 'playful', 'calm'];
  for (const style of styles) {
    const match = messages.find(m => 
      m.style === style && !result.includes(m)
    );
    if (match && result.length < count) {
      result.push(match);
      usedStyles.add(style);
    }
  }
  
  // Second pass: ensure length diversity
  for (const length of ['short', 'medium', 'long']) {
    const match = messages.find(m => 
      m.lengthType === length && !result.includes(m)
    );
    if (match && result.length < count) {
      result.push(match);
      usedLengths.add(length);
    }
  }
  
  // Fill remaining with popularity-weighted random
  const remaining = messages
    .filter(m => !result.includes(m))
    .sort((a, b) => b.popularity - a.popularity);
  
  while (result.length < count && remaining.length > 0) {
    const idx = Math.floor(Math.random() * Math.min(remaining.length, 10));
    result.push(remaining.splice(idx, 1)[0]);
  }
  
  return result;
}
```

---

## 5. Implementation Phases

### Phase 1: Data Model (Session 1)
- [ ] Add `style`, `lengthType` to FortuneMessage interface
- [ ] Create auto-classification function
- [ ] Run classification on all 200+ messages
- [ ] Manual review of edge cases (20-30 messages)
- [ ] Update tests

### Phase 2: Lucky Numbers (Session 2)
- [ ] Create `lib/lucky-numbers.ts` with meanings (1-63)
- [ ] Create `LuckyNumberCard` component
- [ ] Add tooltips to existing lucky number displays
- [ ] Create date-based lucky numbers utility
- [ ] Test on /messages page

### Phase 3: AI Integration (Session 3)
- [ ] Add "Generate Similar" button to message cards
- [ ] Update generator page to accept URL params
- [ ] Enhance OpenRouter prompts with style context
- [ ] Test end-to-end flow

### Phase 4: UI Polish (Session 4)
- [ ] Add style filter to MessagesSearchFilter
- [ ] Add style badges to message cards
- [ ] Implement diversity sampling
- [ ] Performance testing
- [ ] Documentation update

---

## 6. Files to Modify/Create

### New Files
- `lib/lucky-numbers.ts` - Lucky number meanings system
- `components/messages/LuckyNumberCard.tsx` - Enhanced lucky number display
- `components/messages/StyleBadge.tsx` - Style indicator badge

### Modified Files
- `lib/fortune-database.ts` - Enhanced data model + classification
- `lib/openrouter.ts` - Style-aware prompts
- `components/messages/MessageCategorySection.tsx` - Generate Similar button
- `components/messages/MessagesSearchFilter.tsx` - Style filter
- `app/generator/page.tsx` - URL param handling

### Test Files
- `__tests__/lib/lucky-numbers.test.ts`
- `__tests__/lib/fortune-database.test.ts` (update)
- `__tests__/components/LuckyNumberCard.test.tsx`

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Style coverage | 100% messages classified | Database audit |
| Lucky number meanings | All 1-63 defined | Code review |
| Generate Similar clicks | >5% of message views | Analytics |
| Search filter usage | Style filter used 10%+ | Analytics |
| Page load time | No regression | Web Vitals |

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Style misclassification | Manual review phase + user feedback mechanism |
| Lucky number system complexity | Start with 1-20, expand incrementally |
| AI prompt quality | A/B test style prompts before full rollout |
| Performance regression | Lazy load LuckyNumberCard component |

---

## Appendix: Message Classification Examples

### Classic Style
- "The journey of a thousand miles begins with a single step"
- "Patience is a virtue that brings its own reward"

### Poetic Style
- "Your heart is a garden; tend it with patience and watch dreams bloom"
- "Like the moon, your path has phases—each one beautiful"

### Modern Style
- "You've got this. Keep showing up."
- "Sometimes the best move is to take a break"

### Playful Style
- "You're one smart cookie! 🍪"
- "May your coffee be strong and your Monday short"

### Calm Style
- "Breathe deeply. The universe unfolds in its own time"
- "In stillness, you will find your answers"
