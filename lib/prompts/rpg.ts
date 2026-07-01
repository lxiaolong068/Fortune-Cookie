/**
 * The Tabletop RPG mode (spec 4.2 mode 3 / 10.4) — campaign prophecies.
 * Uses the global anti-cliché contract.
 */
import { buildSystemPrompt } from "./index";

export const RPG_TARGETS = [
  { value: "for-character", label: "For the Character" },
  { value: "for-player", label: "For the Player" },
] as const;
export type RpgTarget = (typeof RPG_TARGETS)[number]["value"];

export const RPG_STYLES = [
  { value: "ominous", label: "Ominous Prophecy" },
  { value: "comic", label: "Comic Relief" },
  { value: "quest-hook", label: "Quest Hook" },
  { value: "riddle", label: "Cryptic Riddle" },
] as const;
export type RpgStyle = (typeof RPG_STYLES)[number]["value"];

export const RPG_SETTINGS = [
  { value: "classic-fantasy", label: "Classic Fantasy" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "horror", label: "Horror" },
  { value: "pirate", label: "Pirate" },
  { value: "steampunk", label: "Steampunk" },
  { value: "modern", label: "Modern" },
] as const;
export type RpgSetting = (typeof RPG_SETTINGS)[number]["value"];

export const RPG_QUANTITIES = [1, 5, 10, 20] as const;

export interface RpgParams {
  target: RpgTarget;
  style: RpgStyle;
  setting: RpgSetting;
  quantity: number;
}

const VALID_TARGETS = new Set(RPG_TARGETS.map((t) => t.value));
const VALID_STYLES = new Set(RPG_STYLES.map((s) => s.value));
const VALID_SETTINGS = new Set(RPG_SETTINGS.map((s) => s.value));

export function normalizeRpgParams(raw: unknown): RpgParams {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const target = VALID_TARGETS.has(obj.target as RpgTarget)
    ? (obj.target as RpgTarget)
    : "for-character";
  const style = VALID_STYLES.has(obj.style as RpgStyle)
    ? (obj.style as RpgStyle)
    : "ominous";
  const setting = VALID_SETTINGS.has(obj.setting as RpgSetting)
    ? (obj.setting as RpgSetting)
    : "classic-fantasy";

  const quantityNum = Number(obj.quantity);
  const quantity = (RPG_QUANTITIES as readonly number[]).includes(quantityNum)
    ? quantityNum
    : 1;

  return { target, style, setting, quantity };
}

const RPG_RULES = `You are a mysterious oracle delivering fortunes for a tabletop RPG session.

Rules:
- For the character: use archaic, in-world prophetic language
- For the player: break the fourth wall and reference dice and game mechanics (e.g. "Your dice will betray you")
- Quest Hook style: each fortune should spark an adventure idea
- Cryptic Riddle style: pose an enigmatic riddle rather than a plain statement
- Comic Relief style: be witty and genre-savvy
- Ominous Prophecy style: foreboding, like a movie trailer
- Avoid modern slang unless the setting is Modern
- Stay ambiguous enough to apply to multiple situations`;

export function buildRpgSystemPrompt(): string {
  return buildSystemPrompt(RPG_RULES);
}

export function buildRpgUserPrompt(params: RpgParams): string {
  const setting =
    RPG_SETTINGS.find((s) => s.value === params.setting)?.label ?? "Classic Fantasy";
  const target =
    RPG_TARGETS.find((t) => t.value === params.target)?.label ?? "For the Character";
  const style =
    RPG_STYLES.find((s) => s.value === params.style)?.label ?? "Ominous Prophecy";

  return [
    `Setting: a ${setting} world.`,
    `Target: ${target}.`,
    `Style: ${style}.`,
    `Generate exactly ${params.quantity} fortune${
      params.quantity === 1 ? "" : "s"
    } in this style.`,
    `Return ONLY a JSON array of ${params.quantity} string${
      params.quantity === 1 ? "" : "s"
    } — each element is one fortune. No keys, no commentary.`,
  ].join("\n");
}
