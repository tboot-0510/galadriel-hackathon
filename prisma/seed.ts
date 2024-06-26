import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      role: Role.USER,
      address: "0x02Be16B98D1ed5F3cccA1dd0f202231E75aEb829",
    },
  });

  console.log(newUser);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
