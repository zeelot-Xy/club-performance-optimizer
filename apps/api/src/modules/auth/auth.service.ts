import { prisma } from "../../lib/prisma.js";
import { comparePassword } from "../../lib/password.js";
import { signAccessToken } from "../../lib/jwt.js";
import { HttpError } from "../../lib/http-error.js";
import { HTTP_STATUS } from "../../config/http.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        activeClubId: user.activeClubId,
      },
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        activeClubId: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Authenticated user no longer exists.");
    }

    return user;
  },
};
