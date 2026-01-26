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

function pickOutput(res: any): { url?: string; type?: "video" | "image" } {
  const data = res?.data ?? res;

  if (data?.video?.url) return { url: data.video.url, type: "video" };
  if (Array.isArray(data?.videos) && data.videos[0]?.url) return { url: data.videos[0].url, type: "video" };

  if (Array.isArray(data?.images) && data.images[0]?.url) return { url: data.images[0].url, type: "image" };
  if (data?.image?.url) return { url: data.image.url, type: "image" };

  return {};
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

    const res = await fal.queue.result(modelId, { requestId });

    const { url, type } = pickOutput(res);

    // ✅ 标准化返回：前端既可以用 data，也可以直接用 outputUrl/outputType
    return NextResponse.json({
      data: res?.data ?? res,
      outputUrl: url,
      outputType: type,
      raw: res, // 你要是怕太大，可以删掉；但调试阶段非常有用
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "result error" }, { status: 500 });
  }
}
