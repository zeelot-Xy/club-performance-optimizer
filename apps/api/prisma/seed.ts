import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const formations = [
  { code: "4-3-3", label: "4-3-3", defenders: 4, midfielders: 3, forwards: 3 },
  { code: "4-4-2", label: "4-4-2", defenders: 4, midfielders: 4, forwards: 2 },
  { code: "4-2-3-1", label: "4-2-3-1", defenders: 4, midfielders: 5, forwards: 1 },
  { code: "3-5-2", label: "3-5-2", defenders: 3, midfielders: 5, forwards: 2 },
];

const main = async () => {
  for (const formation of formations) {
    await prisma.formation.upsert({
      where: { code: formation.code },
      update: {
        label: formation.label,
        defenders: formation.defenders,
        midfielders: formation.midfielders,
        forwards: formation.forwards,
        isActive: true,
      },
      create: {
        ...formation,
        isActive: true,
      },
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed Prisma data.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
