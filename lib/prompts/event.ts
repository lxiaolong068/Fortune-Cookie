/**
 * The Event Master mode (spec 4.2 mode 2 / 10.3) — custom fortunes for events.
 * Uses the global anti-cliché contract (unlike persona mode).
 */
import { buildSystemPrompt } from "./index";

export const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "baby-announcement", label: "Baby Announcement" },
  { value: "birthday", label: "Birthday" },
  { value: "graduation", label: "Graduation" },
  { value: "retirement", label: "Retirement" },
  { value: "team-building", label: "Team Building" },
  { value: "secret-santa", label: "Secret Santa" },
  { value: "housewarming", label: "Housewarming" },
  { value: "farewell-party", label: "Farewell Party" },
] as const;
export type EventType = (typeof EVENT_TYPES)[number]["value"];

export const EVENT_TONES = [
  { value: "sweet", label: "Sweet" },
  { value: "funny", label: "Funny" },
  { value: "sentimental", label: "Sentimental" },
  { value: "playful", label: "Playful" },
] as const;
export type EventTone = (typeof EVENT_TONES)[number]["value"];

export const EVENT_QUANTITIES = [10, 20, 50, 100] as const;

const MAX_PERSONALIZATION_LEN = 200;

export interface EventParams {
  eventType: EventType;
  personalization: string;
  tone: EventTone;
  quantity: number;
  avoidDuplicates: boolean;
}

const VALID_EVENTS = new Set(EVENT_TYPES.map((e) => e.value));
const VALID_TONES = new Set(EVENT_TONES.map((t) => t.value));

export function normalizeEventParams(raw: unknown): EventParams {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const eventType = VALID_EVENTS.has(obj.eventType as EventType)
    ? (obj.eventType as EventType)
    : "wedding";

  const tone = VALID_TONES.has(obj.tone as EventTone)
    ? (obj.tone as EventTone)
    : "sweet";

  const personalization =
    typeof obj.personalization === "string"
      ? obj.personalization.replace(/[<>]/g, "").trim().slice(0, MAX_PERSONALIZATION_LEN)
      : "";

  const quantityNum = Number(obj.quantity);
  const quantity = (EVENT_QUANTITIES as readonly number[]).includes(quantityNum)
    ? quantityNum
    : 10;

  const avoidDuplicates =
    typeof obj.avoidDuplicates === "boolean" ? obj.avoidDuplicates : true;

  return { eventType, personalization, tone, quantity, avoidDuplicates };
}

const EVENT_RULES = `You are writing fortune cookie messages for a specific event.

Rules:
- Weave the personal details naturally into the messages
- Every message must feel unique — vary structure, angle, and wording (no two alike)
- Keep each under 15 words (it must fit on a real fortune cookie strip)
- Baby announcements: be clever and indirect, preserve the surprise
- Weddings: reference the couple without being cheesy
- Team building / office events: keep it light and inclusive, never off-color`;

export function buildEventSystemPrompt(): string {
  return buildSystemPrompt(EVENT_RULES);
}

export function buildEventUserPrompt(params: EventParams): string {
  const event =
    EVENT_TYPES.find((e) => e.value === params.eventType)?.label ?? "Wedding";
  const tone =
    EVENT_TONES.find((t) => t.value === params.tone)?.label ?? "Sweet";
  const details = params.personalization
    ? params.personalization
    : "(none provided — keep messages broadly fitting for the event)";

  return [
    `Event: ${event}`,
    `Personal details: ${details}`,
    `Tone: ${tone}`,
    `Generate exactly ${params.quantity} messages, all different in structure and approach.`,
    params.avoidDuplicates
      ? "Do not repeat any message; each must be distinct."
      : "",
    `Return ONLY a JSON array of ${params.quantity} strings — each element is one message. No keys, no commentary.`,
  ]
    .filter(Boolean)
    .join("\n");
}
