// /app/api/fal/submit/route.ts
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import { quotePrice, type CreateMode, type ModelId } from "@/lib/pricing";
import { chargeCreditsByBetaKey, addCreditsByBetaKey } from "@/lib/dbBilling";
import { createJob } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // 2) charge credits（幂等 key：本次提交唯一）
    const idem = `gen_charge:${g.betaKey}:${modelId}:${crypto.randomUUID()}`;

    const charged = await chargeCreditsByBetaKey({
      betaKey: g.betaKey,
      amount: quote.sellCredits,
      idempotencyKey: idem,
      meta: { mode, modelId },
    });

    if (!charged.ok) {
      return NextResponse.json(
        { error: "Insufficient credits", remaining: charged.remaining, need: quote.sellCredits },
        { status: 402 }
      );
    }

    // 3) submit to fal queue
    try {
      const res = await fal.queue.submit(modelId, { input });
      const requestId = (res as any)?.request_id;

      if (!requestId) {
        await addCreditsByBetaKey({
          betaKey: g.betaKey,
          amount: quote.sellCredits,
          idempotencyKey: `refund_no_request_id:${idem}`,
          reason: "REFUND_NO_REQUEST_ID",
          meta: { modelId },
        });

        return NextResponse.json({ error: "Fal submit returned no request_id (refunded)" }, { status: 500 });
      }

      // ✅ 4) create DB job (QUEUED)
      const job = await createJob({
        betaKey: g.betaKey,
        mode,
        modelId,
        requestId,
        prompt: typeof input?.prompt === "string" ? input.prompt : null,
        inputJson: input,
        chargedCredits: quote.sellCredits,
      });

      return NextResponse.json({
        requestId,
        jobId: job.id, // ✅ 现在是真正的 DB jobId
        chargedCredits: quote.sellCredits,
        remaining: charged.remaining,
        quote,
      });
    } catch (e: any) {
      // submit failed => refund（幂等）
      await addCreditsByBetaKey({
        betaKey: g.betaKey,
        amount: quote.sellCredits,
        idempotencyKey: `refund_submit_fail:${idem}`,
        reason: "REFUND_SUBMIT_FAIL",
        meta: { modelId, message: e?.message },
      });

      return NextResponse.json({ error: e?.message ?? "Fal submit failed (refunded)" }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "submit error" }, { status: 500 });
  }
}
