/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/auth/session/route";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/mobile-auth", () => ({
  validateMobileSession: jest.fn(),
}));

jest.mock("@/lib/error-monitoring", () => ({
  captureApiError: jest.fn(),
}));

import { getServerSession } from "next-auth";
import { validateMobileSession } from "@/lib/mobile-auth";

const createRequest = (headers: Record<string, string> = {}) => {
  return new NextRequest("http://localhost:3000/api/auth/session", {
    method: "GET",
    headers: new Headers(headers),
  });
};

describe("/api/auth/session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when Authorization header is missing and no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toMatchObject({
      error: "unauthorized",
    });
  });

  it("returns 200 when NextAuth session exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user_123", email: "test@example.com" },
      expires: "2099-01-01T00:00:00.000Z",
    });

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      user: { id: "user_123", email: "test@example.com" },
    });
  });

  it("returns 401 when bearer token is invalid", async () => {
    (validateMobileSession as jest.Mock).mockResolvedValue(null);

    const response = await GET(
      createRequest({ Authorization: "Bearer invalid-token" }),
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toMatchObject({
      error: "session_expired",
    });
  });

  it("returns 200 when bearer token is valid", async () => {
    const createdAt = new Date("2024-01-01T00:00:00.000Z");
    (validateMobileSession as jest.Mock).mockResolvedValue({
      user: {
        id: "user_abc",
        email: "mobile@example.com",
        name: "Mobile User",
        createdAt,
      },
      session: {
        provider: "apple",
      },
    });

    const response = await GET(
      createRequest({ Authorization: "Bearer valid-token" }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: "user_abc",
      email: "mobile@example.com",
      name: "Mobile User",
      provider: "apple",
      createdAt: createdAt.toISOString(),
    });
  });
});
