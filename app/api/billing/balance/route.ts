// /app/api/billing/balance/route.ts
import { NextResponse } from "next/server";
import { requireBetaKey } from "@/lib/gate";
import { getCreditsByBetaKey } from "@/lib/dbBilling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  const credits = await getCreditsByBetaKey(g.betaKey);
  return NextResponse.json({ credits });
}

