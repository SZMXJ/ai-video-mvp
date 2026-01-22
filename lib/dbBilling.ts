import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function ensureUserByBetaKey(betaKey: string) {
  return prisma.user.upsert({
    where: { betaKey },
    update: {},
    create: { betaKey, credits: 0 },
  });
}

export async function getCreditsByBetaKey(betaKey: string) {
  const user = await prisma.user.findUnique({
    where: { betaKey },
    select: { credits: true },
  });
  return user?.credits ?? 0;
}

export type ChargeResult =
  | { ok: true; remaining: number }
  | { ok: false; remaining: number };

/** ✅ 扣费（幂等） */
export async function chargeCreditsByBetaKey(params: {
  betaKey: string;
  amount: number;
  idempotencyKey: string;
  meta?: Prisma.InputJsonValue;
}): Promise<ChargeResult> {
  const { betaKey, amount, idempotencyKey, meta } = params;

  if (!amount || amount <= 0) {
    return { ok: true, remaining: await getCreditsByBetaKey(betaKey) };
  }

  return prisma.$transaction(async (tx) => {
    // 1) 幂等：处理过就返回当前余额
    const existed = await tx.creditLedger.findUnique({
      where: { idempotencyKey },
      select: { id: true },
    });

    if (existed) {
      const u = await tx.user.findUnique({
        where: { betaKey },
        select: { credits: true },
      });
      return { ok: true, remaining: u?.credits ?? 0 };
    }

    // 2) 确保用户存在
    const user = await tx.user.upsert({
      where: { betaKey },
      update: {},
      create: { betaKey, credits: 0 },
      select: { id: true, credits: true },
    });

    // 3) 校验余额
    if (user.credits < amount) {
      return { ok: false, remaining: user.credits };
    }

    // 4) 记账 + 扣余额
    await tx.creditLedger.create({
      data: {
        userId: user.id,
        delta: -amount,
        reason: "JOB_CHARGE",
        meta, // ✅ 不要写 null
        idempotencyKey,
      },
    });

    const updated = await tx.user.update({
      where: { id: user.id },
      data: { credits: { decrement: amount } },
      select: { credits: true },
    });

    return { ok: true, remaining: updated.credits };
  });
}

/** ✅ 加币/退款（幂等） */
export async function addCreditsByBetaKey(params: {
  betaKey: string;
  amount: number;
  idempotencyKey: string;
  reason?: string;
  meta?: Prisma.InputJsonValue;
}) {
  const { betaKey, amount, idempotencyKey, reason, meta } = params;
  if (!amount || amount <= 0) return;

  await prisma.$transaction(async (tx) => {
    const existed = await tx.creditLedger.findUnique({
      where: { idempotencyKey },
      select: { id: true },
    });
    if (existed) return;

    const user = await tx.user.upsert({
      where: { betaKey },
      update: {},
      create: { betaKey, credits: 0 },
      select: { id: true },
    });

    await tx.creditLedger.create({
      data: {
        userId: user.id,
        delta: amount,
        reason: reason ?? "STRIPE_TOPUP",
        meta,
        idempotencyKey,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { credits: { increment: amount } },
    });
  });
}
