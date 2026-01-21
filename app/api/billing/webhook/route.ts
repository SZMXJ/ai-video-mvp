// /app/api/billing/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { addCredits } from "@/lib/kvBilling";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const whsec = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whsec);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const betaKey = session.metadata?.betaKey;
      const credits = Number(session.metadata?.credits ?? 0);

      if (betaKey && credits > 0) {
        // ledgerId uses Stripe session id for idempotency
        await addCredits(betaKey, credits, `stripe_session_${session.id}`);
      }
    }
    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Webhook handler error" }, { status: 500 });
  }
}
