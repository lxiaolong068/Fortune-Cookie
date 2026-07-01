import { getScopedLimit } from "@/lib/quota";

describe("scoped quota limits (spec 5.3 / 5.4)", () => {
  it("home draw: guest 1/day, authenticated effectively unlimited", () => {
    expect(getScopedLimit("home", false)).toBe(1);
    expect(getScopedLimit("home", true)).toBeGreaterThanOrEqual(1000);
  });

  it("generator: guest 3/day, authenticated 10/day", () => {
    expect(getScopedLimit("generator", false)).toBe(3);
    expect(getScopedLimit("generator", true)).toBe(10);
  });

  it("home and generator are independent limits", () => {
    expect(getScopedLimit("home", false)).not.toBe(
      getScopedLimit("generator", false),
    );
  });
});
