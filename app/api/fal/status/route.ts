import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import { addCreditsByBetaKey } from "@/lib/dbBilling";
import type { ModelId } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertFalKey() {
  if (!process.env.FAL_KEY) {
    throw new Error("Missing FAL_KEY. Please set FAL_KEY in .env.local / Vercel env.");
  }
}

type FalStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED" | "UNKNOWN";

export async function POST(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  try {
    assertFalKey();

    const { modelId, requestId, chargedCredits } = (await req.json()) as {
      modelId: ModelId;
      requestId: string;
      chargedCredits?: number;
    };

    if (!modelId || !requestId) {
      return NextResponse.json({ error: "Missing modelId/requestId" }, { status: 400 });
    }

    const st: any = await fal.queue.status(modelId, { requestId });
    const status: FalStatus = (st?.status ?? "UNKNOWN") as FalStatus;

    // FAILED => refund once（幂等）
    if (status === "FAILED" && chargedCredits && chargedCredits > 0) {
      await addCreditsByBetaKey({
        betaKey: g.betaKey,
        amount: chargedCredits,
        idempotencyKey: `refund_failed:${requestId}`,
        reason: "REFUND_FAILED",
        meta: { modelId, requestId },
      });
    }

    return NextResponse.json({ status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "status error" }, { status: 500 });
  }
}
