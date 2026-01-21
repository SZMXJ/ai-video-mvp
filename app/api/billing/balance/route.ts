// /app/api/billing/balance/route.ts
import { NextResponse } from "next/server";
import { requireBetaKey } from "@/lib/gate";
import { getCredits } from "@/lib/kvBilling";

export async function GET(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  const credits = await getCredits(g.betaKey);
  return NextResponse.json({ credits });
}
