import {
  PERSONAS,
  FREE_PERSONA_IDS,
  getPersona,
  normalizePersonaParams,
  buildPersonaSystemPrompt,
  buildPersonaUserPrompt,
} from "@/lib/prompts/persona";

describe("personas catalogue", () => {
  it("defines all 8 spec personas with unique ids", () => {
    expect(PERSONAS).toHaveLength(8);
    const ids = PERSONAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(8);
    expect(ids).toContain("passive-aggressive");
  });

  it("has exactly 3 free personas including passive-aggressive", () => {
    expect(FREE_PERSONA_IDS).toHaveLength(3);
    expect(FREE_PERSONA_IDS).toContain("passive-aggressive");
    expect(FREE_PERSONA_IDS).toContain("existentialist");
    expect(FREE_PERSONA_IDS).toContain("unhinged-optimist");
  });

  it("marks the rest premium", () => {
    const premium = PERSONAS.filter((p) => p.tier === "premium");
    expect(premium).toHaveLength(5);
  });
});

describe("normalizePersonaParams", () => {
  it("defaults to passive-aggressive for unknown persona", () => {
    expect(normalizePersonaParams({ persona: "nope" }).persona).toBe(
      "passive-aggressive",
    );
  });

  it("keeps a valid persona id", () => {
    expect(normalizePersonaParams({ persona: "noir-detective" }).persona).toBe(
      "noir-detective",
    );
  });

  it("sanitizes and truncates topic, strips angle brackets", () => {
    const long = "a".repeat(100);
    const out = normalizePersonaParams({ topic: `<b>${long}` });
    expect(out.topic).not.toContain("<");
    expect(out.topic.length).toBeLessThanOrEqual(60);
  });

  it("only accepts allowed quantities else 1", () => {
    expect(normalizePersonaParams({ quantity: 5 }).quantity).toBe(5);
    expect(normalizePersonaParams({ quantity: 20 }).quantity).toBe(1);
  });
});

describe("persona prompts", () => {
  it("system prompt embeds the persona voice and stays-in-character rule", () => {
    const persona = getPersona("passive-aggressive")!;
    const sys = buildPersonaSystemPrompt(persona);
    expect(sys).toContain("Passive Aggressive");
    expect(sys).toContain(persona.example);
    expect(sys).toMatch(/Stay 100% in character/i);
  });

  it("user prompt includes topic when given, and quantity/JSON instruction", () => {
    const persona = getPersona("existentialist")!;
    const withTopic = buildPersonaUserPrompt(persona, "career", 5);
    expect(withTopic).toContain("career");
    expect(withTopic).toContain("5");
    expect(withTopic).toMatch(/JSON array of 5 strings/i);

    const noTopic = buildPersonaUserPrompt(persona, "", 1);
    expect(noTopic).toMatch(/persona's choice/i);
  });
});
