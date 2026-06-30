import {
  GLOBAL_SYSTEM_PROMPT,
  BANNED_WORD_STEMS,
  buildSystemPrompt,
  containsBannedWords,
  containsAntiPatterns,
  countWords,
  validateFortune,
} from "@/lib/prompts";

describe("prompts: banned words", () => {
  it("detects each banned stem", () => {
    for (const stem of BANNED_WORD_STEMS) {
      const found = containsBannedWords(`This sentence has ${stem} in it.`);
      expect(found).toContain(stem);
    }
  });

  it("detects inflected forms (manifesting, empowered, alignment)", () => {
    expect(containsBannedWords("manifesting your dreams")).toEqual(["manifesting"]);
    expect(containsBannedWords("you feel empowered")).toEqual(["empowered"]);
    expect(containsBannedWords("seek alignment")).toEqual(["alignment"]);
  });

  it("is case-insensitive and de-duplicates", () => {
    expect(containsBannedWords("Energy energy ENERGY")).toEqual(["energy"]);
  });

  it("does not false-positive on substrings (synergy, university)", () => {
    expect(containsBannedWords("Great synergy at the university today")).toEqual(
      [],
    );
  });

  it("returns nothing for clean text", () => {
    expect(
      containsBannedWords("You will find a coin in an old coat pocket."),
    ).toEqual([]);
  });
});

describe("prompts: anti-patterns", () => {
  it("flags motivational-poster phrasings", () => {
    expect(containsAntiPatterns("The key to success is grit")).toContain(
      "the-key-to",
    );
    expect(containsAntiPatterns("Remember that you matter")).toContain(
      "remember-that",
    );
    expect(containsAntiPatterns("Life is a highway")).toContain("life-is-a");
  });

  it("passes clean, specific fortunes", () => {
    expect(
      containsAntiPatterns("A stranger will ask you for directions on Thursday."),
    ).toEqual([]);
  });
});

describe("prompts: countWords", () => {
  it("counts whitespace-separated tokens", () => {
    expect(countWords("one two three")).toBe(3);
    expect(countWords("   padded   words  ")).toBe(2);
    expect(countWords("")).toBe(0);
  });
});

describe("prompts: validateFortune", () => {
  // Canonical "good" outputs from spec section 4.1 must validate cleanly.
  const specExamples = [
    "You will find money in a coat you haven't worn since last winter.",
    "A stranger will ask you for directions on Thursday.",
    "Your next password will be rejected three times.",
    "The person behind you in line knows your name.",
  ];

  it.each(specExamples)("accepts spec example: %s", (text) => {
    const result = validateFortune(text, { maxWords: 15 });
    expect(result.valid).toBe(true);
    expect(result.bannedWords).toEqual([]);
    expect(result.antiPatterns).toEqual([]);
  });

  it("rejects a fortune stuffed with banned words", () => {
    const result = validateFortune(
      "Embrace the journey and align your energy with the universe.",
    );
    expect(result.valid).toBe(false);
    expect(result.bannedWords).toEqual(
      expect.arrayContaining(["embrace", "journey", "align", "energy", "universe"]),
    );
  });

  it("enforces the word limit when provided", () => {
    const longText = Array.from({ length: 20 }, (_, i) => `word${i}`).join(" ");
    const result = validateFortune(longText, { maxWords: 15 });
    expect(result.wordCount).toBe(20);
    expect(result.exceedsWordLimit).toBe(true);
    expect(result.valid).toBe(false);
  });

  it("ignores word limit when not provided", () => {
    const longText = Array.from({ length: 30 }, (_, i) => `word${i}`).join(" ");
    const result = validateFortune(longText);
    expect(result.exceedsWordLimit).toBe(false);
    expect(result.valid).toBe(true);
  });
});

describe("prompts: buildSystemPrompt", () => {
  it("includes the global contract and the mode instructions", () => {
    const prompt = buildSystemPrompt("MODE: Oracle. Use 'You will...' format.");
    expect(prompt).toContain(GLOBAL_SYSTEM_PROMPT);
    expect(prompt).toContain("MODE: Oracle");
  });

  it("lists the banned words in the global contract", () => {
    expect(GLOBAL_SYSTEM_PROMPT).toContain("journey");
    expect(GLOBAL_SYSTEM_PROMPT).toContain("manifest");
  });

  it("returns just the global prompt when mode is empty", () => {
    expect(buildSystemPrompt("   ")).toBe(GLOBAL_SYSTEM_PROMPT);
  });
});
