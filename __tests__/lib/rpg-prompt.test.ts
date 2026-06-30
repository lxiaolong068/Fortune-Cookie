import {
  normalizeRpgParams,
  buildRpgSystemPrompt,
  buildRpgUserPrompt,
} from "@/lib/prompts/rpg";
import { GLOBAL_SYSTEM_PROMPT } from "@/lib/prompts";

describe("normalizeRpgParams", () => {
  it("applies safe defaults", () => {
    expect(normalizeRpgParams(undefined)).toEqual({
      target: "for-character",
      style: "ominous",
      setting: "classic-fantasy",
      quantity: 1,
    });
  });

  it("validates each field, falling back on invalid", () => {
    expect(normalizeRpgParams({ target: "nope" }).target).toBe("for-character");
    expect(normalizeRpgParams({ target: "for-player" }).target).toBe("for-player");
    expect(normalizeRpgParams({ style: "nope" }).style).toBe("ominous");
    expect(normalizeRpgParams({ style: "quest-hook" }).style).toBe("quest-hook");
    expect(normalizeRpgParams({ setting: "nope" }).setting).toBe("classic-fantasy");
    expect(normalizeRpgParams({ setting: "horror" }).setting).toBe("horror");
  });

  it("only accepts allowed quantities (1/5/10/20), else 1", () => {
    expect(normalizeRpgParams({ quantity: 20 }).quantity).toBe(20);
    expect(normalizeRpgParams({ quantity: 7 }).quantity).toBe(1);
  });
});

describe("rpg prompts", () => {
  it("system prompt includes global contract + RPG rules", () => {
    const sys = buildRpgSystemPrompt();
    expect(sys).toContain(GLOBAL_SYSTEM_PROMPT);
    expect(sys).toMatch(/tabletop RPG/i);
    expect(sys).toMatch(/break the fourth wall/i);
  });

  it("user prompt encodes setting, target, style, quantity, JSON", () => {
    const prompt = buildRpgUserPrompt({
      target: "for-player",
      style: "quest-hook",
      setting: "sci-fi",
      quantity: 5,
    });
    expect(prompt).toContain("Sci-Fi");
    expect(prompt).toContain("For the Player");
    expect(prompt).toContain("Quest Hook");
    expect(prompt).toContain("exactly 5");
    expect(prompt).toMatch(/JSON array of 5 strings/i);
  });
});
