// /app/api/billing/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { addCreditsByBetaKey } from "@/lib/dbBilling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env STRIPE_SECRET_KEY");
  return new Stripe(key); // apiVersion 可选，不加也能跑
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whsec) return NextResponse.json({ error: "Missing env STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, whsec);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const betaKey = session.metadata?.betaKey;
      const credits = Number(session.metadata?.credits ?? 0);

      if (betaKey && credits > 0) {
        // ✅ 幂等：同一个 session 只加一次
        await addCreditsByBetaKey({
          betaKey,
          amount: credits,
          idempotencyKey: `stripe_session:${session.id}`,
          reason: "STRIPE_TOPUP",
          meta: {
            stripeSessionId: session.id,
            amountTotal: session.amount_total ?? null,
            currency: session.currency ?? null,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Webhook handler error" }, { status: 500 });
  }
}
