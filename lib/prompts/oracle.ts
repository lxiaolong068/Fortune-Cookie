/**
 * The True Oracle mode (spec 4.1 / 10.2) — classic predictive fortunes.
 * Pure prompt-building + param normalization; no I/O here.
 */
import { buildSystemPrompt } from "./index";

export const TIME_HORIZONS = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "this-year", label: "This Year" },
  { value: "lifetime", label: "In Your Lifetime" },
] as const;
export type TimeHorizon = (typeof TIME_HORIZONS)[number]["value"];

export const FORTUNE_TYPES = [
  { value: "good", label: "Good" },
  { value: "neutral", label: "Neutral" },
  { value: "bad", label: "Bad" },
  { value: "ominous", label: "Ominous" },
] as const;
export type FortuneType = (typeof FORTUNE_TYPES)[number]["value"];

export const ORACLE_QUANTITIES = [1, 5, 10, 20] as const;

export const MIN_INTENSITY = 1;
export const MAX_INTENSITY = 5;

export interface OracleParams {
  timeHorizon: TimeHorizon;
  intensity: number; // 1-5
  fortuneTypes: FortuneType[]; // at least one
  quantity: number; // one of ORACLE_QUANTITIES
}

const VALID_HORIZONS = new Set(TIME_HORIZONS.map((t) => t.value));
const VALID_TYPES = new Set(FORTUNE_TYPES.map((t) => t.value));

/**
 * Coerce untrusted input into safe OracleParams (clamps intensity, filters
 * invalid types/horizon/quantity, applies sensible defaults).
 */
export function normalizeOracleParams(raw: unknown): OracleParams {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const timeHorizon = VALID_HORIZONS.has(obj.timeHorizon as TimeHorizon)
    ? (obj.timeHorizon as TimeHorizon)
    : "today";

  const intensityNum = Number(obj.intensity);
  const intensity = Number.isFinite(intensityNum)
    ? Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, Math.round(intensityNum)))
    : 3;

  const rawTypes = Array.isArray(obj.fortuneTypes) ? obj.fortuneTypes : [];
  const fortuneTypes = Array.from(
    new Set(rawTypes.filter((t): t is FortuneType => VALID_TYPES.has(t as FortuneType))),
  );
  if (fortuneTypes.length === 0) fortuneTypes.push("good");

  const quantityNum = Number(obj.quantity);
  const quantity = (ORACLE_QUANTITIES as readonly number[]).includes(quantityNum)
    ? quantityNum
    : 1;

  return { timeHorizon, intensity, fortuneTypes, quantity };
}

const ORACLE_RULES = `You are an ancient oracle delivering prophecies through fortune cookies.

Rules:
- Use "You will..." or "A [noun] will..." phrasing
- Be specific about time, place, or sensory details
- Good fortunes feel like pleasant surprises, not generic blessings
- Bad fortunes are funny/absurd, never genuinely harmful (e.g. "You will step on a Lego at 2am")
- Ominous fortunes create intrigue, like a movie trailer
- Neutral fortunes are mundane but oddly specific observations`;

export function buildOracleSystemPrompt(): string {
  return buildSystemPrompt(ORACLE_RULES);
}

const INTENSITY_GUIDE: Record<number, string> = {
  1: "very vague and metaphorical",
  2: "loosely suggestive",
  3: "moderately specific",
  4: "quite specific",
  5: 'extremely specific — name a precise time, place, or object (e.g. "tomorrow at 3pm, check your left")',
};

/** Build the per-request user prompt that drives one generation call. */
export function buildOracleUserPrompt(params: OracleParams): string {
  const horizon =
    TIME_HORIZONS.find((t) => t.value === params.timeHorizon)?.label ?? "Today";
  const types = params.fortuneTypes.length ? params.fortuneTypes : ["good"];
  const intensity = Math.min(
    MAX_INTENSITY,
    Math.max(MIN_INTENSITY, Math.round(params.intensity)),
  );

  return [
    `Generate exactly ${params.quantity} fortune cookie ${
      params.quantity === 1 ? "prophecy" : "prophecies"
    }.`,
    `Time horizon: ${horizon} — the prediction should fit this timeframe.`,
    `Intensity ${intensity}/5: ${INTENSITY_GUIDE[intensity]}.`,
    `Fortune type(s): ${types.join(", ")}.${
      types.length > 1 ? " Spread across the selected types." : ""
    }`,
    `Return ONLY a JSON array of ${params.quantity} string${
      params.quantity === 1 ? "" : "s"
    } — each element is one fortune. No object keys, no commentary.`,
  ].join("\n");
}
