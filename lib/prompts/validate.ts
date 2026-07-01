/**
 * Fortune output validation — enforces the anti-cliché rules from the spec
 * (section 10.1). Used to QA AI-generated fortunes across all generator modes
 * and to drive automated regression of prompt quality.
 */

/**
 * Banned word stems. The matcher appends `\w*` so inflections are caught too
 * (e.g. "manifest" → "manifesting", "manifestation"; "empower" → "empowered").
 * These are the AI-slop / self-help words users most dislike (spec 10.1).
 */
export const BANNED_WORD_STEMS = [
  "journey",
  "embrace",
  "manifest",
  "align",
  "energy",
  "universe",
  "gratitude",
  "mindful",
  "authentic",
  "empower",
] as const;

/**
 * Anti-pattern phrasings to reject (spec 10.1). Each has a human-readable name
 * so validation output is actionable.
 */
export const ANTI_PATTERNS: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: "the-key-to", pattern: /\bthe key to\b/i },
  { name: "remember-that", pattern: /\bremember that\b/i },
  { name: "life-is-a", pattern: /\blife is (?:a|an|like)\b/i },
  { name: "believe-in-yourself", pattern: /\bbelieve in yourself\b/i },
  { name: "follow-your-dreams", pattern: /\bfollow your (?:dreams|heart)\b/i },
];

// Single compiled regex for all banned stems (case-insensitive, whole-word start).
const BANNED_REGEX = new RegExp(
  `\\b(${BANNED_WORD_STEMS.join("|")})\\w*\\b`,
  "gi",
);

export interface ValidationResult {
  /** True when no banned words, no anti-patterns, and within the word limit. */
  valid: boolean;
  /** Actual matched words (lower-cased, de-duplicated), e.g. ["manifesting"]. */
  bannedWords: string[];
  /** Names of matched anti-patterns, e.g. ["the-key-to"]. */
  antiPatterns: string[];
  /** Number of words in the text. */
  wordCount: number;
  /** True when a maxWords limit was provided and exceeded. */
  exceedsWordLimit: boolean;
}

/** Return the banned words present in `text` (deduped, lower-cased). */
export function containsBannedWords(text: string): string[] {
  const matches = text.match(BANNED_REGEX) ?? [];
  return Array.from(new Set(matches.map((m) => m.toLowerCase())));
}

/** Return the names of anti-patterns present in `text`. */
export function containsAntiPatterns(text: string): string[] {
  return ANTI_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
    ({ name }) => name,
  );
}

/** Count words (whitespace-separated, ignoring empty tokens). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Validate a generated fortune against the global quality rules.
 * @param text The fortune message to check.
 * @param opts.maxWords Optional word-count ceiling (spec default is 15 for most modes).
 */
export function validateFortune(
  text: string,
  opts: { maxWords?: number } = {},
): ValidationResult {
  const bannedWords = containsBannedWords(text);
  const antiPatterns = containsAntiPatterns(text);
  const wordCount = countWords(text);
  const exceedsWordLimit =
    typeof opts.maxWords === "number" && wordCount > opts.maxWords;

  return {
    valid:
      bannedWords.length === 0 &&
      antiPatterns.length === 0 &&
      !exceedsWordLimit,
    bannedWords,
    antiPatterns,
    wordCount,
    exceedsWordLimit,
  };
}
