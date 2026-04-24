import "dotenv/config";

import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/password.js";

const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@club.local";
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin123!";

const main = async () => {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists for ${defaultAdminEmail}.`);
    return;
  }

  const passwordHash = await hashPassword(defaultAdminPassword);

  await prisma.adminUser.create({
    data: {
      fullName: "Development Coach Admin",
      email: defaultAdminEmail,
      passwordHash,
    },
  });

  console.log(`Seeded development admin: ${defaultAdminEmail}`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed development admin.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
