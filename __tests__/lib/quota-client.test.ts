import {
  extractQuota,
  formatResetIn,
  isUnlimitedRemaining,
  SIGNED_IN_DAILY_LIMIT,
  GUEST_GENERATOR_DAILY_LIMIT,
  UNLIMITED_REMAINING_THRESHOLD,
  type QuotaInfo,
} from "@/lib/quota-client";

const VALID: QuotaInfo = {
  limit: 3,
  used: 3,
  remaining: 0,
  resetsAtUtc: "2026-07-23T00:00:00.000Z",
  isAuthenticated: false,
};

describe("extractQuota", () => {
  it("reads the error envelope (meta.quota)", () => {
    expect(extractQuota({ success: false, meta: { quota: VALID } })).toEqual(
      VALID,
    );
  });

  it("reads the details envelope (details.quota)", () => {
    expect(extractQuota({ details: { quota: VALID } })).toEqual(VALID);
  });

  it("reads the success envelope (data.quota)", () => {
    expect(extractQuota({ data: { quota: VALID } })).toEqual(VALID);
  });

  it("reads a top-level quota as a last resort", () => {
    expect(extractQuota({ quota: VALID })).toEqual(VALID);
  });

  it("prefers meta over data when both are present", () => {
    const fromData: QuotaInfo = { ...VALID, limit: 10, remaining: 7 };
    expect(
      extractQuota({ meta: { quota: VALID }, data: { quota: fromData } }),
    ).toEqual(VALID);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "nope"],
    ["a number", 42],
    ["an empty object", {}],
  ])("returns null for %s", (_label, payload) => {
    expect(extractQuota(payload)).toBeNull();
  });

  it("returns null when the branch holds no quota", () => {
    expect(extractQuota({ meta: { requestId: "abc" } })).toBeNull();
  });

  it("returns null when the branch is not an object", () => {
    expect(extractQuota({ meta: "quota" })).toBeNull();
  });

  it.each([
    ["limit", "limit"],
    ["used", "used"],
    ["remaining", "remaining"],
    ["resetsAtUtc", "resetsAtUtc"],
    ["isAuthenticated", "isAuthenticated"],
  ])("rejects a quota missing %s", (_label, field) => {
    const partial: Record<string, unknown> = { ...VALID };
    delete partial[field];
    expect(extractQuota({ meta: { quota: partial } })).toBeNull();
  });

  it("rejects numeric fields sent as strings", () => {
    expect(
      extractQuota({ meta: { quota: { ...VALID, remaining: "0" } } }),
    ).toBeNull();
  });

  it("rejects a non-string resetsAtUtc", () => {
    expect(
      extractQuota({ meta: { quota: { ...VALID, resetsAtUtc: 1750000000000 } } }),
    ).toBeNull();
  });

  it("rejects a non-boolean isAuthenticated", () => {
    expect(
      extractQuota({ meta: { quota: { ...VALID, isAuthenticated: "false" } } }),
    ).toBeNull();
  });

  it("rejects a null quota inside a valid branch", () => {
    expect(extractQuota({ meta: { quota: null } })).toBeNull();
  });

  it("accepts an unparseable date string (shape check only)", () => {
    // Shape validation is deliberately separate from date validity — a bad date
    // still yields a usable quota, formatResetIn just returns null for it.
    const q = { ...VALID, resetsAtUtc: "not-a-date" };
    expect(extractQuota({ meta: { quota: q } })).toEqual(q);
  });
});

describe("formatResetIn", () => {
  const now = Date.parse("2026-07-22T12:00:00.000Z");
  const at = (iso: string) => formatResetIn(iso, now);

  it("returns minutes only under an hour", () => {
    expect(at("2026-07-22T12:42:00.000Z")).toBe("42m");
  });

  it("rounds partial minutes up so the wait is never understated", () => {
    expect(at("2026-07-22T12:41:30.000Z")).toBe("42m");
  });

  it("returns hours and minutes above an hour", () => {
    expect(at("2026-07-22T18:12:00.000Z")).toBe("6h 12m");
  });

  it("drops the trailing 0m exactly on the hour", () => {
    expect(at("2026-07-22T18:00:00.000Z")).toBe("6h");
  });

  it("shows 60 minutes as 1h, not 60m", () => {
    expect(at("2026-07-22T13:00:00.000Z")).toBe("1h");
  });

  it("keeps 59 minutes in minutes", () => {
    expect(at("2026-07-22T12:59:00.000Z")).toBe("59m");
  });

  it("handles the longest realistic wait (just under 24h)", () => {
    expect(at("2026-07-23T11:59:00.000Z")).toBe("23h 59m");
  });

  it("returns null for a reset that already passed", () => {
    expect(at("2026-07-22T11:59:00.000Z")).toBeNull();
  });

  it("returns null for a reset exactly now", () => {
    expect(at("2026-07-22T12:00:00.000Z")).toBeNull();
  });

  it("returns null for an unparseable date", () => {
    expect(at("tomorrow-ish")).toBeNull();
    expect(at("")).toBeNull();
  });

  it("defaults `now` to the current clock", () => {
    const future = new Date(Date.now() + 90 * 60_000).toISOString();
    expect(formatResetIn(future)).toMatch(/^1h (29|30)m$/);
  });

  it("rounds sub-minute waits up to 1m rather than 0m", () => {
    expect(at("2026-07-22T12:00:10.000Z")).toBe("1m");
  });
});

describe("isUnlimitedRemaining", () => {
  it("treats null as a real (unknown) value, not unlimited", () => {
    expect(isUnlimitedRemaining(null)).toBe(false);
  });

  it.each([0, 1, 3, 10, UNLIMITED_REMAINING_THRESHOLD - 1])(
    "treats %s as a real count",
    (n) => {
      expect(isUnlimitedRemaining(n)).toBe(false);
    },
  );

  it.each([UNLIMITED_REMAINING_THRESHOLD, 9999, Number.MAX_SAFE_INTEGER])(
    "treats the sentinel %s as unlimited",
    (n) => {
      expect(isUnlimitedRemaining(n)).toBe(true);
    },
  );
});

describe("limit constants", () => {
  it("falls back to the server defaults when the env vars are unset", () => {
    expect(SIGNED_IN_DAILY_LIMIT).toBe(10);
    expect(GUEST_GENERATOR_DAILY_LIMIT).toBe(3);
  });
});
