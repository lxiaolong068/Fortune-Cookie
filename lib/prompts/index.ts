/**
 * Prompt engineering base for the Fortune Cookie generator (spec section 10).
 *
 * `GLOBAL_SYSTEM_PROMPT` is the shared anti-cliché contract prepended to every
 * mode-specific prompt (Oracle, Event Master, Tabletop RPG, Alter Ego). Build a
 * full system prompt with `buildSystemPrompt(modeInstructions)`.
 *
 * Output quality is enforced at runtime/test time via `validateFortune`.
 */

export {
  BANNED_WORD_STEMS,
  ANTI_PATTERNS,
  containsBannedWords,
  containsAntiPatterns,
  countWords,
  validateFortune,
  type ValidationResult,
} from "./validate";

import { BANNED_WORD_STEMS } from "./validate";

/**
 * Global rules applied to every generator mode (spec 10.1).
 * Mode-specific instructions are appended after this block.
 */
export const GLOBAL_SYSTEM_PROMPT = `You are a fortune cookie message writer. Your messages must:
1. Be concise (under 15 words unless the user explicitly requests otherwise)
2. NEVER sound like a LinkedIn post or a self-help book
3. NEVER use these words: ${BANNED_WORD_STEMS.join(", ")}
4. NEVER give advice or be preachy
5. Have a specific, vivid quality — not vague platitudes
6. Feel like they were written by a human with personality, not an AI

Anti-patterns to avoid:
- "The key to X is Y" format
- "Remember that..." format
- "Life is a..." metaphor format
- Any sentence that could appear on a motivational poster

Output only the fortune message(s). No preamble, no quotation marks, no numbering unless asked.`;

/**
 * Compose the global anti-cliché contract with a mode's specific instructions.
 * @param modeInstructions Mode-specific prompt body (e.g. the Oracle rules).
 */
export function buildSystemPrompt(modeInstructions: string): string {
  const mode = modeInstructions.trim();
  if (!mode) return GLOBAL_SYSTEM_PROMPT;
  return `${GLOBAL_SYSTEM_PROMPT}\n\n---\n\n${mode}`;
}
