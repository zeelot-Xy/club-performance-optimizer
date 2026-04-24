import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpError } from "../../lib/http-error.js";

const prismaMock = {
  adminUser: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const comparePasswordMock = vi.fn();
const signAccessTokenMock = vi.fn();

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../../lib/password.js", () => ({
  comparePassword: comparePasswordMock,
}));

vi.mock("../../lib/jwt.js", () => ({
  signAccessToken: signAccessTokenMock,
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in successfully and returns token plus user payload", async () => {
    const user = {
      id: "admin-1",
      fullName: "Development Coach Admin",
      email: "admin@club.local",
      role: "COACH_ADMIN",
      passwordHash: "hashed",
    };

    prismaMock.adminUser.findUnique.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(true);
    signAccessTokenMock.mockReturnValue("signed-token");

    const { authService } = await import("./auth.service.js");
    const result = await authService.login("admin@club.local", "Admin123!");

    expect(prismaMock.adminUser.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@club.local" },
    });
    expect(comparePasswordMock).toHaveBeenCalledWith("Admin123!", "hashed");
    expect(prismaMock.adminUser.update).toHaveBeenCalledWith({
      where: { id: "admin-1" },
      data: { lastLoginAt: expect.any(Date) },
    });
    expect(result).toEqual({
      accessToken: "signed-token",
      user: {
        id: "admin-1",
        fullName: "Development Coach Admin",
        email: "admin@club.local",
        role: "COACH_ADMIN",
      },
    });
  });

  it("rejects invalid credentials", async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      fullName: "Development Coach Admin",
      email: "admin@club.local",
      role: "COACH_ADMIN",
      passwordHash: "hashed",
    });
    comparePasswordMock.mockResolvedValue(false);

    const { authService } = await import("./auth.service.js");

    await expect(authService.login("admin@club.local", "wrong")).rejects.toBeInstanceOf(HttpError);
    await expect(authService.login("admin@club.local", "wrong")).rejects.toMatchObject({
      message: "Invalid email or password.",
    });
  });
});
