// /app/api/fal/result/route.ts
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import type { ModelId } from "@/lib/pricing";

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

    const { modelId, requestId } = (await req.json()) as { modelId: ModelId; requestId: string };

    if (!modelId || !requestId) {
      return NextResponse.json({ error: "Missing modelId/requestId" }, { status: 400 });
    }

    // true polling: queue.result
    const res = await fal.queue.result(modelId, { requestId });
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "result error" }, { status: 500 });
  }
}
