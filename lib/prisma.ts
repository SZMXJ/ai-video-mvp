import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function makePrisma() {
  const accelerateUrl = process.env.DATABASE_URL; // prisma+postgres://... (Accelerate)
  if (!accelerateUrl) {
    throw new Error("Missing env DATABASE_URL (Accelerate prisma+postgres://...)");
  }

  // ✅ Prisma Accelerate 必须把 accelerateUrl 传进 PrismaClient
  return new PrismaClient({
    log: ["error", "warn"],
    accelerateUrl,
  }).$extends(withAccelerate());
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof makePrisma>;
};

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
