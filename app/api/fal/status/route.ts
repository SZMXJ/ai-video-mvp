// /app/api/fal/status/route.ts
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import { addCredits } from "@/lib/kvBilling";
import type { ModelId } from "@/lib/pricing";

function assertFalKey() {
  if (!process.env.FAL_KEY) {
    throw new Error("Missing FAL_KEY. Please set FAL_KEY in .env.local / Vercel env.");
  }
}

type FalStatus =
  | "IN_QUEUE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "UNKNOWN";

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

    // true polling: queue.status
    const st: any = await fal.queue.status(modelId, { requestId });

    const status: FalStatus = (st?.status ?? "UNKNOWN") as FalStatus;

    // If FAILED: refund once (idempotent)
    if (status === "FAILED" && chargedCredits && chargedCredits > 0) {
      await addCredits(g.betaKey, chargedCredits, `refund_failed:${requestId}`);
    }

    return NextResponse.json({ status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "status error" }, { status: 500 });
  }
}
