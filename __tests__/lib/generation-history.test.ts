/**
 * @jest-environment node
 */

jest.mock("@/lib/database", () => ({
  db: {
    generationHistory: {
      createMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import { db } from "@/lib/database";
import {
  recordGenerationHistory,
  getGenerationHistory,
} from "@/lib/generation-history";

const mockDb = db as unknown as {
  generationHistory: {
    createMany: jest.Mock;
    count: jest.Mock;
    findMany: jest.Mock;
    deleteMany: jest.Mock;
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("recordGenerationHistory", () => {
  it("does nothing for an empty entry list", async () => {
    await recordGenerationHistory("user1", []);
    expect(mockDb.generationHistory.createMany).not.toHaveBeenCalled();
  });

  it("caps inserts at 20 per request even for a large batch", async () => {
    mockDb.generationHistory.count.mockResolvedValue(20);
    const entries = Array.from({ length: 100 }, (_, i) => ({
      mode: "event",
      params: {},
      message: `msg ${i}`,
    }));

    await recordGenerationHistory("user1", entries);

    expect(mockDb.generationHistory.createMany).toHaveBeenCalledTimes(1);
    const data = mockDb.generationHistory.createMany.mock.calls[0][0].data;
    expect(data).toHaveLength(20);
  });

  it("serializes params and luckyNumbers as JSON", async () => {
    mockDb.generationHistory.count.mockResolvedValue(1);
    await recordGenerationHistory("user1", [
      {
        mode: "oracle",
        params: { timeHorizon: "today" },
        message: "hello",
        luckyNumbers: [1, 2, 3],
      },
    ]);
    const row = mockDb.generationHistory.createMany.mock.calls[0][0].data[0];
    expect(row.userId).toBe("user1");
    expect(JSON.parse(row.params)).toEqual({ timeHorizon: "today" });
    expect(JSON.parse(row.luckyNumbers)).toEqual([1, 2, 3]);
  });

  it("trims older rows beyond the 50-row cap", async () => {
    mockDb.generationHistory.count.mockResolvedValue(55);
    mockDb.generationHistory.findMany.mockResolvedValue([
      { id: "old1" },
      { id: "old2" },
    ]);

    await recordGenerationHistory("user1", [
      { mode: "oracle", params: {}, message: "hi" },
    ]);

    expect(mockDb.generationHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user1" }, skip: 50 }),
    );
    expect(mockDb.generationHistory.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["old1", "old2"] } },
    });
  });

  it("does not throw when the database call fails", async () => {
    mockDb.generationHistory.createMany.mockRejectedValue(new Error("db down"));
    await expect(
      recordGenerationHistory("user1", [
        { mode: "oracle", params: {}, message: "hi" },
      ]),
    ).resolves.toBeUndefined();
  });
});

describe("getGenerationHistory", () => {
  it("maps rows and parses JSON fields", async () => {
    mockDb.generationHistory.findMany.mockResolvedValue([
      {
        id: "h1",
        mode: "oracle",
        params: JSON.stringify({ timeHorizon: "today" }),
        message: "hello",
        luckyNumbers: JSON.stringify([7, 8]),
        createdAt: new Date("2026-01-01"),
      },
    ]);

    const result = await getGenerationHistory("user1");
    expect(result).toEqual([
      {
        id: "h1",
        mode: "oracle",
        params: { timeHorizon: "today" },
        message: "hello",
        luckyNumbers: [7, 8],
        createdAt: new Date("2026-01-01"),
      },
    ]);
  });

  it("handles a null luckyNumbers field", async () => {
    mockDb.generationHistory.findMany.mockResolvedValue([
      {
        id: "h2",
        mode: "rpg",
        params: "{}",
        message: "hi",
        luckyNumbers: null,
        createdAt: new Date("2026-01-01"),
      },
    ]);
    const result = await getGenerationHistory("user1");
    expect(result[0]?.luckyNumbers).toBeUndefined();
  });
});
