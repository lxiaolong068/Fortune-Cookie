/**
 * The Alter Ego mode (spec 4.4 / 10.5) — persona-driven fortunes.
 *
 * NOTE: persona mode deliberately does NOT use the global anti-cliché contract.
 * Several personas subvert it on purpose (e.g. Corporate Buzzword uses
 * "synergy/align", the Gen Z Oracle says "the universe is obsessed with you").
 * Output is therefore not run through the banned-word filter.
 */

export type PersonaTier = "free" | "premium";

export interface PersonaDef {
  id: string;
  label: string;
  /** What the persona is. */
  description: string;
  /** Language-style guide. */
  style: string;
  /** One-shot example of the voice (from spec 4.4). */
  example: string;
  tier: PersonaTier;
}

/**
 * All 8 personas are defined (spec fully specifies each voice). Free tier =
 * the 3 base personas usable now; premium = the rest (unlocked in P3 alongside
 * freemium gating). Passive Aggressive is first and the priority to polish.
 */
export const PERSONAS: readonly PersonaDef[] = [
  {
    id: "passive-aggressive",
    label: "Passive Aggressive",
    description: "Outwardly polite, secretly cutting.",
    style:
      "Sound supportive on the surface while landing a quiet jab. Use trailing qualifiers like 'Eventually.' or 'No rush.' Never openly hostile.",
    example: "I'm sure you'll figure it out. Eventually.",
    tier: "free",
  },
  {
    id: "existentialist",
    label: "The Existentialist",
    description: "A deadpan existentialist philosopher.",
    style:
      "Calm, detached, fond of cosmic futility delivered as comfort. Short declaratives.",
    example: "Nothing matters. Isn't that freeing?",
    tier: "free",
  },
  {
    id: "unhinged-optimist",
    label: "Unhinged Optimist",
    description: "Manically, alarmingly positive.",
    style:
      "ALL-CAPS bursts, exclamation marks, breathless enthusiasm bordering on unsettling.",
    example: "EVERYTHING is about to get SO GOOD for you!!!",
    tier: "free",
  },
  {
    id: "corporate-buzzword",
    label: "Corporate Buzzword",
    description: "A middle-manager fluent in jargon.",
    style:
      "Stack business buzzwords (synergize, leverage, core competencies, circle back, bandwidth) into hollow optimism.",
    example: "Synergize your core competencies to unlock value.",
    tier: "premium",
  },
  {
    id: "villain-monologue",
    label: "Villain Monologue",
    description: "A theatrical cartoon villain.",
    style:
      "Grandiose, menacing, fond of 'foolish mortal' theatrics and dramatic pauses.",
    example: "You dare open this cookie? Foolish mortal...",
    tier: "premium",
  },
  {
    id: "grandma-energy",
    label: "Grandma Energy",
    description: "A warm, fussing grandmother.",
    style:
      "Affectionate nagging about eating and resting, then a tender prediction. Calls the reader 'dear'.",
    example: "You look thin, dear. Eat something. Also, love is coming.",
    tier: "premium",
  },
  {
    id: "gen-z-oracle",
    label: "Gen Z Oracle",
    description: "A Gen Z prophet, terminally online.",
    style:
      "Lowercase, slang (bestie, literally, rn, no cap), affectionate chaos.",
    example: "bestie the universe is literally obsessed with you rn",
    tier: "premium",
  },
  {
    id: "noir-detective",
    label: "Noir Detective",
    description: "A hard-boiled film-noir detective.",
    style:
      "Moody, metaphor-soaked, world-weary. Rain, dames, trouble, cigarette smoke.",
    example: "The dame walked in. She smelled like trouble and jasmine.",
    tier: "premium",
  },
];

export const FREE_PERSONA_IDS = PERSONAS.filter((p) => p.tier === "free").map(
  (p) => p.id,
);

export const PERSONA_QUANTITIES = [1, 5, 10] as const;

const PERSONA_BY_ID = new Map(PERSONAS.map((p) => [p.id, p]));

export function getPersona(id: string): PersonaDef | undefined {
  return PERSONA_BY_ID.get(id);
}

export interface PersonaParams {
  persona: string; // persona id
  topic: string; // "" = random
  quantity: number;
}

const MAX_TOPIC_LEN = 60;

/** Coerce untrusted input into safe PersonaParams. */
export function normalizePersonaParams(raw: unknown): PersonaParams {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const persona = PERSONA_BY_ID.has(obj.persona as string)
    ? (obj.persona as string)
    : "passive-aggressive";

  const topic =
    typeof obj.topic === "string"
      ? obj.topic.replace(/[<>]/g, "").trim().slice(0, MAX_TOPIC_LEN)
      : "";

  const quantityNum = Number(obj.quantity);
  const quantity = (PERSONA_QUANTITIES as readonly number[]).includes(quantityNum)
    ? quantityNum
    : 1;

  return { persona, topic, quantity };
}

/** Build the persona system prompt (spec 10.5) — no global anti-cliché contract. */
export function buildPersonaSystemPrompt(persona: PersonaDef): string {
  return `You are writing a fortune cookie message AS a specific persona.

Persona: ${persona.label}
Who they are: ${persona.description}
Voice: ${persona.style}
Example of their voice: "${persona.example}"

Rules:
- Stay 100% in character — the reader must instantly recognize the persona from the writing style
- One sentence only (two at most)
- Be entertaining above all else
- Do NOT give earnest advice or sound like a generic AI assistant
- Do not repeat the example verbatim; produce fresh lines in the same voice`;
}

export function buildPersonaUserPrompt(
  persona: PersonaDef,
  topic: string,
  quantity: number,
): string {
  const topicLine = topic
    ? `Topic: ${topic}. Each message should relate to this topic.`
    : `Topic: the persona's choice (vary it across messages).`;

  return [
    `Write ${quantity} fortune cookie message${quantity === 1 ? "" : "s"} as ${persona.label}.`,
    topicLine,
    `Return ONLY a JSON array of ${quantity} string${
      quantity === 1 ? "" : "s"
    } — each element is one in-character message. No keys, no commentary.`,
  ].join("\n");
}
