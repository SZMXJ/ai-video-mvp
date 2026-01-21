import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

let _prisma: ReturnType<typeof makePrisma> | null = null;

function makePrisma() {
  return new PrismaClient({
    log: ["error", "warn"],
  }).$extends(withAccelerate());
}

// ✅ 只有真正调用 prisma() 时才实例化，避免 next build 收集阶段就触发构造校验
export function prisma() {
  if (!_prisma) _prisma = makePrisma();
  return _prisma;
}
