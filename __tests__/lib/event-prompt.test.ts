import {
  normalizeEventParams,
  buildEventSystemPrompt,
  buildEventUserPrompt,
} from "@/lib/prompts/event";
import { GLOBAL_SYSTEM_PROMPT } from "@/lib/prompts";

describe("normalizeEventParams", () => {
  it("applies safe defaults", () => {
    expect(normalizeEventParams(undefined)).toEqual({
      eventType: "wedding",
      personalization: "",
      tone: "sweet",
      quantity: 10,
      avoidDuplicates: true,
    });
  });

  it("validates eventType and tone, falling back", () => {
    expect(normalizeEventParams({ eventType: "nope" }).eventType).toBe("wedding");
    expect(normalizeEventParams({ eventType: "birthday" }).eventType).toBe(
      "birthday",
    );
    expect(normalizeEventParams({ tone: "nope" }).tone).toBe("sweet");
    expect(normalizeEventParams({ tone: "funny" }).tone).toBe("funny");
  });

  it("only accepts allowed quantities (10/20/50/100), else 10", () => {
    expect(normalizeEventParams({ quantity: 50 }).quantity).toBe(50);
    expect(normalizeEventParams({ quantity: 30 }).quantity).toBe(10);
  });

  it("sanitizes personalization (strip <>, truncate 200)", () => {
    const out = normalizeEventParams({ personalization: `<x>${"a".repeat(300)}` });
    expect(out.personalization).not.toContain("<");
    expect(out.personalization.length).toBeLessThanOrEqual(200);
  });

  it("respects avoidDuplicates boolean, defaults true", () => {
    expect(normalizeEventParams({ avoidDuplicates: false }).avoidDuplicates).toBe(
      false,
    );
    expect(normalizeEventParams({}).avoidDuplicates).toBe(true);
  });
});

describe("event prompts", () => {
  it("system prompt includes global contract + event rules", () => {
    const sys = buildEventSystemPrompt();
    expect(sys).toContain(GLOBAL_SYSTEM_PROMPT);
    expect(sys).toMatch(/writing fortune cookie messages for a specific event/i);
  });

  it("user prompt encodes event label, details, tone, quantity, JSON", () => {
    const prompt = buildEventUserPrompt({
      eventType: "baby-announcement",
      personalization: "due in June",
      tone: "playful",
      quantity: 20,
      avoidDuplicates: true,
    });
    expect(prompt).toContain("Baby Announcement");
    expect(prompt).toContain("due in June");
    expect(prompt).toContain("Playful");
    expect(prompt).toContain("exactly 20");
    expect(prompt).toMatch(/JSON array of 20 strings/i);
    expect(prompt).toMatch(/each must be distinct/i);
  });

  it("notes absent personalization gracefully", () => {
    const prompt = buildEventUserPrompt({
      eventType: "wedding",
      personalization: "",
      tone: "sweet",
      quantity: 10,
      avoidDuplicates: false,
    });
    expect(prompt).toMatch(/none provided/i);
  });
});
