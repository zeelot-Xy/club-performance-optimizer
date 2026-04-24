import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const formationService = {
  list() {
    return prisma.formation.findMany({
      where: { isActive: true },
      orderBy: [{ defenders: "asc" }, { midfielders: "asc" }, { forwards: "asc" }],
    });
  },

  async getById(id: string) {
    const formation = await prisma.formation.findUnique({ where: { id } });

    if (!formation) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Formation not found.");
    }

    return formation;
  },
};
