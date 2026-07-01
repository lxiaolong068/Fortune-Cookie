import { buildFortunesTxt } from "@/lib/export-txt";

describe("buildFortunesTxt", () => {
  it("numbers each fortune and separates with a blank line", () => {
    const txt = buildFortunesTxt([
      { message: "You will find a coin." },
      { message: "A stranger will wave at you." },
    ]);
    expect(txt).toBe(
      "1. You will find a coin.\n\n2. A stranger will wave at you.",
    );
  });

  it("appends lucky numbers when present", () => {
    const txt = buildFortunesTxt([
      { message: "Fortune favors you.", luckyNumbers: [4, 8, 15] },
    ]);
    expect(txt).toBe("1. Fortune favors you.\nLucky numbers: 4, 8, 15");
  });

  it("handles an empty list", () => {
    expect(buildFortunesTxt([])).toBe("");
  });
});
