// /lib/kvBilling.ts
import { kv } from "@vercel/kv";

const BAL_KEY = (betaKey: string) => `beta:credits:${betaKey}`;
const LEDGER_KEY = (id: string) => `ledger:${id}`; // idempotency guard

export async function getCredits(betaKey: string): Promise<number> {
  const v = await kv.get<number>(BAL_KEY(betaKey));
  return typeof v === "number" ? v : 0;
}

export async function addCredits(betaKey: string, delta: number, ledgerId: string) {
  // idempotent: if already applied, skip
  const already = await kv.get(LEDGER_KEY(ledgerId));
  if (already) return;

  // set ledger marker first (so even if retried, it's safe)
  await kv.set(LEDGER_KEY(ledgerId), { betaKey, delta, at: Date.now() }, { ex: 60 * 60 * 24 * 365 });

  // then increment balance
  await kv.incrby(BAL_KEY(betaKey), delta);
}

export async function chargeCredits(betaKey: string, amount: number, ledgerId: string) {
  if (amount <= 0) return { ok: true as const, remaining: await getCredits(betaKey) };

  // idempotency
  const already = await kv.get(LEDGER_KEY(ledgerId));
  if (already) {
    return { ok: true as const, remaining: await getCredits(betaKey) };
  }

  const current = await getCredits(betaKey);
  if (current < amount) return { ok: false as const, reason: "INSUFFICIENT" as const, remaining: current };

  await kv.set(LEDGER_KEY(ledgerId), { betaKey, delta: -amount, at: Date.now() }, { ex: 60 * 60 * 24 * 365 });
  await kv.incrby(BAL_KEY(betaKey), -amount);

  return { ok: true as const, remaining: current - amount };
}
