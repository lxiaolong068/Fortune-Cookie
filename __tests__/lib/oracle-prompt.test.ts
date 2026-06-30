import {
  normalizeOracleParams,
  buildOracleUserPrompt,
  buildOracleSystemPrompt,
} from "@/lib/prompts/oracle";
import { GLOBAL_SYSTEM_PROMPT } from "@/lib/prompts";

describe("normalizeOracleParams", () => {
  it("applies safe defaults for empty input", () => {
    expect(normalizeOracleParams(undefined)).toEqual({
      timeHorizon: "today",
      intensity: 3,
      fortuneTypes: ["good"],
      quantity: 1,
    });
  });

  it("clamps intensity to 1-5 and rounds", () => {
    expect(normalizeOracleParams({ intensity: 9 }).intensity).toBe(5);
    expect(normalizeOracleParams({ intensity: 0 }).intensity).toBe(1);
    expect(normalizeOracleParams({ intensity: 3.7 }).intensity).toBe(4);
  });

  it("filters invalid fortune types and de-dupes; falls back to good", () => {
    expect(
      normalizeOracleParams({ fortuneTypes: ["good", "bad", "bad", "nope"] })
        .fortuneTypes,
    ).toEqual(["good", "bad"]);
    expect(normalizeOracleParams({ fortuneTypes: ["nope"] }).fortuneTypes).toEqual([
      "good",
    ]);
  });

  it("only accepts allowed quantities, else 1", () => {
    expect(normalizeOracleParams({ quantity: 10 }).quantity).toBe(10);
    expect(normalizeOracleParams({ quantity: 7 }).quantity).toBe(1);
  });

  it("rejects an unknown time horizon", () => {
    expect(normalizeOracleParams({ timeHorizon: "yesterday" }).timeHorizon).toBe(
      "today",
    );
    expect(normalizeOracleParams({ timeHorizon: "lifetime" }).timeHorizon).toBe(
      "lifetime",
    );
  });
});

describe("buildOracleUserPrompt", () => {
  it("encodes quantity, horizon label, intensity and types", () => {
    const prompt = buildOracleUserPrompt({
      timeHorizon: "this-week",
      intensity: 5,
      fortuneTypes: ["bad", "ominous"],
      quantity: 5,
    });
    expect(prompt).toContain("exactly 5");
    expect(prompt).toContain("This Week");
    expect(prompt).toContain("Intensity 5/5");
    expect(prompt).toContain("bad, ominous");
    expect(prompt).toMatch(/JSON array of 5 strings/i);
  });

  it("uses singular phrasing for a single fortune", () => {
    const prompt = buildOracleUserPrompt({
      timeHorizon: "today",
      intensity: 1,
      fortuneTypes: ["good"],
      quantity: 1,
    });
    expect(prompt).toContain("exactly 1");
    expect(prompt).toMatch(/prophecy/);
    expect(prompt).toMatch(/JSON array of 1 string\b/i);
  });
});

describe("buildOracleSystemPrompt", () => {
  it("includes the global contract and oracle persona", () => {
    const sys = buildOracleSystemPrompt();
    expect(sys).toContain(GLOBAL_SYSTEM_PROMPT);
    expect(sys).toContain("ancient oracle");
    expect(sys).toMatch(/You will/);
  });
});
