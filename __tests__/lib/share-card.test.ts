import { buildShareCardUrl } from "@/lib/share-card";

describe("buildShareCardUrl", () => {
  it("builds a fortune-type og URL with message/category/emoji", () => {
    const url = buildShareCardUrl({
      message: "You will find a coin.",
      category: "Oracle",
      emoji: "🔮",
    });
    const parsed = new URL(url, "http://localhost");
    expect(parsed.pathname).toBe("/api/og");
    expect(parsed.searchParams.get("type")).toBe("fortune");
    expect(parsed.searchParams.get("message")).toBe("You will find a coin.");
    expect(parsed.searchParams.get("category")).toBe("Oracle");
    expect(parsed.searchParams.get("emoji")).toBe("🔮");
    expect(parsed.searchParams.has("lucky")).toBe(false);
  });

  it("joins lucky numbers with comma-space when present", () => {
    const url = buildShareCardUrl({
      message: "Lucky day.",
      category: "Wedding",
      emoji: "🎉",
      luckyNumbers: [4, 8, 15, 16],
    });
    const parsed = new URL(url, "http://localhost");
    expect(parsed.searchParams.get("lucky")).toBe("4, 8, 15, 16");
  });

  it("omits the lucky param for an empty array", () => {
    const url = buildShareCardUrl({
      message: "Hi",
      category: "RPG",
      emoji: "🎲",
      luckyNumbers: [],
    });
    expect(new URL(url, "http://localhost").searchParams.has("lucky")).toBe(
      false,
    );
  });

  it("URL-encodes special characters in the message", () => {
    const url = buildShareCardUrl({
      message: "Fortune & fame? \"Yes\"",
      category: "Test",
      emoji: "✨",
    });
    const parsed = new URL(url, "http://localhost");
    expect(parsed.searchParams.get("message")).toBe('Fortune & fame? "Yes"');
  });
});
