import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireBetaKey } from "@/lib/gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKS: Record<string, { priceEnv: string; credits: number }> = {
  "10": { priceEnv: "STRIPE_PRICE_10", credits: 1000 },
  "30": { priceEnv: "STRIPE_PRICE_30", credits: 3200 },
  "100": { priceEnv: "STRIPE_PRICE_100", credits: 11500 },
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env STRIPE_SECRET_KEY");
  // ✅ apiVersion 不写也能跑；你写的话就用 as any 固定住
  return new Stripe(key, { apiVersion: "2025-12-15.clover" as any });
}

export async function POST(req: Request) {
  try {
    const g = requireBetaKey(req);
    if (!g.ok) return g.res;

    const { pack } = await req.json().catch(() => ({ pack: "10" }));
    const p = PACKS[String(pack)] ?? PACKS["10"];

    const priceId = process.env[p.priceEnv];
    if (!priceId) {
      return NextResponse.json({ error: `Missing env ${p.priceEnv}` }, { status: 500 });
    }

    const origin = process.env.APP_ORIGIN;
    if (!origin) return NextResponse.json({ error: "Missing env APP_ORIGIN" }, { status: 500 });

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/create?paid=1`,
      cancel_url: `${origin}/create?paid=0`,
      metadata: {
        betaKey: g.betaKey,
        credits: String(p.credits),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "checkout error" }, { status: 500 });
  }
}
