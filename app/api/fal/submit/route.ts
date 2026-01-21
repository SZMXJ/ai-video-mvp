// /app/api/fal/submit/route.ts
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import { quotePrice, type CreateMode, type ModelId } from "@/lib/pricing";
import { chargeCredits, addCredits } from "@/lib/kvBilling";

function assertFalKey() {
  if (!process.env.FAL_KEY) {
    throw new Error("Missing FAL_KEY. Please set FAL_KEY in .env.local / Vercel env.");
  }
}

export async function POST(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  try {
    assertFalKey();

    const { mode, modelId, input, imageMeta } = (await req.json()) as {
      mode: CreateMode;
      modelId: ModelId;
      input: Record<string, any>;
      imageMeta?: { width?: number; height?: number; mp?: number };
    };

    if (!mode || !modelId || !input) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1) quote
    const quote = quotePrice({ mode, modelId, input, imageMeta });

    // 2) charge credits (idempotency)
    const idem = `gen_charge:${g.betaKey}:${modelId}:${Date.now()}`;
    const charged = await chargeCredits(g.betaKey, quote.sellCredits, idem);

    if (!charged.ok) {
      return NextResponse.json(
        { error: "Insufficient credits", remaining: charged.remaining, need: quote.sellCredits },
        { status: 402 }
      );
    }

    // 3) submit to queue (true polling architecture)
    try {
      const res = await fal.queue.submit(modelId, { input });
      // fal returns request_id in snake_case
      const requestId = (res as any)?.request_id;

      if (!requestId) {
        await addCredits(g.betaKey, quote.sellCredits, `refund_no_request_id:${idem}`);
        return NextResponse.json(
          { error: "Fal submit returned no request_id (refunded)" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        requestId,
        chargedCredits: quote.sellCredits,
        remaining: charged.remaining,
        quote,
      });
    } catch (e: any) {
      // submit failed => refund
      await addCredits(g.betaKey, quote.sellCredits, `refund_submit_fail:${idem}`);
      return NextResponse.json(
        { error: e?.message ?? "Fal submit failed (refunded)" },
        { status: 500 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "submit error" }, { status: 500 });
  }
}
